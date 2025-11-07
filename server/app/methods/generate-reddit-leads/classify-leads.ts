import {
  redditLeadClassificationPrompt,
  redditLeadClassificationSchema,
} from "@/defs/ai/reddit-lead-classification";
import Bottleneck from "bottleneck";
import OpenAI from "openai";
import { LeadPerWebsite } from "./group-leads-per-website";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// BOTTLENECK LIMITER FOR OPENAI API WITH 200 CONCURRENT REQUESTS
const limiter = new Bottleneck({
  maxConcurrent: 200,
});

// MAX LEADS PER OPENAI REQUEST TO AVOID OVER-STIMULATING THE MODEL
const MAX_LEADS_PER_BATCH = 5;

export type LeadPerWebsiteClassified = LeadPerWebsite & {
  leads: {
    reddit_username: string;
    lead_score: number;
    conversation_summary: string;
    buying_signals: string[];
    pain_points: string[];
    interactions: LeadPerWebsite["leads"][number]["interactions"];
  }[];
};

// CLASSIFY BATCH OF LEADS WITH RETRY LOGIC
const classifyLeadsBatch = async (
  leadBatch: LeadPerWebsite["leads"],
  websiteInfo: Pick<
    LeadPerWebsite,
    | "website_name"
    | "website_description"
    | "website_keywords"
    | "website_target_audience"
  >,
  maxRetries = 2
): Promise<
  Array<{
    reddit_username: string;
    lead_score: number;
    conversation_summary: string;
    buying_signals: string[];
    pain_points: string[];
  }>
> => {
  let lastError: Error | null = null;

  // TRY UP TO maxRetries + 1 TIMES (INITIAL ATTEMPT + RETRIES)
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // BUILD PROMPT FOR THIS WEBSITE
      const systemPrompt = redditLeadClassificationPrompt({
        productName: websiteInfo.website_name,
        productDescription: websiteInfo.website_description,
        productKeywords: websiteInfo.website_keywords,
        productTargetAudience: websiteInfo.website_target_audience,
      });

      // CALL OPENAI WITH BOTTLENECK RATE LIMITING
      const response = await limiter.schedule(() =>
        openai.chat.completions.create({
          model: "gpt-5-nano",
          reasoning_effort: "medium",
          response_format: {
            type: "json_schema",
            json_schema: redditLeadClassificationSchema,
          },
          messages: [
            {
              role: "developer",
              content: systemPrompt,
            },
            {
              role: "user",
              content: JSON.stringify(leadBatch),
            },
          ],
          store: true,
        })
      );

      // PARSE RESPONSE CONTENT
      const responseContent = JSON.parse(
        response.choices[0].message.content || "{}"
      ) as {
        leads: Array<{
          reddit_username: string;
          lead_score: number;
          conversation_summary: string;
          buying_signals: string[];
          pain_points: string[];
        }>;
      };

      // RETURN CLASSIFIED LEADS ON SUCCESS
      return responseContent.leads;
    } catch (error) {
      lastError = error as Error;
      console.error(
        `Attempt ${attempt + 1}/${maxRetries + 1} failed for batch in website ${
          websiteInfo.website_name
        }:`,
        error
      );

      // IF NOT LAST ATTEMPT, WAIT BEFORE RETRY
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }
  }

  // IF ALL RETRIES FAILED, THROW ERROR
  throw new Error(
    `Failed to classify leads batch for website ${
      websiteInfo.website_name
    } after ${maxRetries + 1} attempts: ${lastError?.message}`
  );
};

// CLASSIFY SINGLE WEBSITE BY BATCHING LEADS INTO GROUPS OF MAX 5
const classifySingleWebsite = async (
  leadPerWebsite: LeadPerWebsite
): Promise<LeadPerWebsiteClassified> => {
  // SPLIT LEADS INTO BATCHES OF MAX 5 LEADS
  const leadBatches: LeadPerWebsite["leads"][] = [];
  for (let i = 0; i < leadPerWebsite.leads.length; i += MAX_LEADS_PER_BATCH) {
    leadBatches.push(leadPerWebsite.leads.slice(i, i + MAX_LEADS_PER_BATCH));
  }

  // EXTRACT WEBSITE INFO FOR CLASSIFICATION
  const websiteInfo = {
    website_name: leadPerWebsite.website_name,
    website_description: leadPerWebsite.website_description,
    website_keywords: leadPerWebsite.website_keywords,
    website_target_audience: leadPerWebsite.website_target_audience,
  };

  // PROCESS EACH BATCH SEQUENTIALLY TO AVOID OVER-STIMULATING THE MODEL
  const allClassifiedLeads: Array<{
    reddit_username: string;
    lead_score: number;
    conversation_summary: string;
    buying_signals: string[];
    pain_points: string[];
  }> = [];

  for (const batch of leadBatches) {
    const classifiedBatch = await classifyLeadsBatch(batch, websiteInfo);
    allClassifiedLeads.push(...classifiedBatch);
  }

  // MAP CLASSIFIED LEADS BACK TO ORIGINAL LEADS BY REDDIT_USERNAME
  const classifiedLeads = leadPerWebsite.leads.map((originalLead) => {
    const classified = allClassifiedLeads.find(
      (cl) => cl.reddit_username === originalLead.reddit_username
    );

    // IF CLASSIFIED DATA FOUND, MERGE IT WITH ORIGINAL LEAD
    if (classified) {
      return {
        reddit_username: originalLead.reddit_username,
        lead_score: classified.lead_score,
        conversation_summary: classified.conversation_summary,
        buying_signals: classified.buying_signals,
        pain_points: classified.pain_points,
        interactions: originalLead.interactions,
      };
    }

    // IF NOT FOUND, RETURN ORIGINAL LEAD WITH NULL VALUES
    return {
      reddit_username: originalLead.reddit_username,
      lead_score: 0,
      conversation_summary: "No classification available",
      buying_signals: [],
      pain_points: [],
      interactions: originalLead.interactions,
    };
  });

  // RETURN CLASSIFIED LEADS GROUPED BACK BY WEBSITE
  return {
    ...leadPerWebsite,
    leads: classifiedLeads as unknown as LeadPerWebsiteClassified["leads"],
  };
};

export const classifyLeads = async ({
  leadsPerWebsite,
}: {
  leadsPerWebsite: LeadPerWebsite[];
}) => {
  // EXECUTE ALL CLASSIFICATIONS IN PARALLEL WITH SINGLE PROMISE
  const classifiedLeads = await Promise.all(
    leadsPerWebsite.map((leadPerWebsite) =>
      classifySingleWebsite(leadPerWebsite)
    )
  );

  return classifiedLeads;
};
