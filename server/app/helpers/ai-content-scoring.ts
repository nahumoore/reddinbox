import { SupabaseClient } from "@supabase/supabase-js";
import Bottleneck from "bottleneck";
import OpenAI from "openai";
import {
  LEAD_SCORING_SYSTEM_PROMPT,
  LeadScoringRequest,
  LeadScoringResponse,
} from "../defs/ai/lead-scoring";
import { buildMessageForLeadScoring } from "./build-message-for-lead-scoring";
import { RedditContent, Website } from "../types/database-schema";

// INTERFACES FOR CONTENT SCORING
interface UnprocessedContent extends RedditContent {
  reddit_id: string;
  website_id: string;
  content: string;
  content_type: "post" | "comment";
  subreddit: string;
  author: string;
  ups: number | null;
  downs: number | null;
}

interface WebsiteWithContent {
  website: Website;
  content: UnprocessedContent[];
}

interface ContentBatch {
  batch: UnprocessedContent[];
  batchNumber: number;
  totalBatches: number;
}

interface BatchWithWebsite extends ContentBatch {
  website: Website;
}

// OPENAI CLIENT FOR LEAD SCORING
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// RATE LIMITER FOR AI SCORING - 5K REQUESTS PER MINUTE WITH BUFFER FOR SAFETY
const scoringLimiter = new Bottleneck({
  maxConcurrent: 10, // MAX CONCURRENT REQUESTS
  minTime: 15, // MINIMUM TIME BETWEEN REQUESTS (15MS = ~4000 RPM WITH BUFFER)
});

// MAIN CONTENT SCORING FUNCTION
export async function scoreRedditContent(
  supabase: SupabaseClient,
  content: UnprocessedContent[],
  scoreThreshold: number = 0
): Promise<UnprocessedContent[]> {
  try {
    if (content.length === 0) {
      console.log("No content to score, skipping AI scoring");
      return [];
    }

    console.log(`Starting AI scoring for ${content.length} content items`);

    // GROUP CONTENT BY WEBSITE FOR BATCH PROCESSING
    const websiteContentGroups = await groupContentByWebsiteForScoring(
      supabase,
      content
    );

    if (websiteContentGroups.length === 0) {
      console.log("No website content groups found, skipping content scoring");
      return [];
    }

    console.log(
      `Processing ${websiteContentGroups.length} website groups for scoring`
    );

    // COLLECT ALL BATCHES FROM ALL WEBSITES
    const allBatches: BatchWithWebsite[] = [];
    let totalContentItems = 0;

    for (const group of websiteContentGroups) {
      const batches = splitContentIntoScoringBatches(group.content);

      // ADD WEBSITE CONTEXT TO EACH BATCH
      const batchesWithWebsite = batches.map((batch) => ({
        ...batch,
        website: group.website,
      }));

      allBatches.push(...batchesWithWebsite);
      totalContentItems += group.content.length;

      console.log(
        `Website ${group.website.name}: ${group.content.length} items split into ${batches.length} batches for scoring`
      );
    }

    console.log(
      `Total: ${allBatches.length} batches from ${totalContentItems} content items across ${websiteContentGroups.length} websites for scoring`
    );

    // PROCESS ALL BATCHES CONCURRENTLY (UP TO 10 AT ONCE)
    let totalItemsScored = 0;
    const scoredContent: UnprocessedContent[] = [];

    const batchResults = await Promise.allSettled(
      allBatches.map(async (batchWithWebsite) => {
        try {
          console.log(
            `Processing scoring batch ${batchWithWebsite.batchNumber}/${batchWithWebsite.totalBatches} for ${batchWithWebsite.website.name} (${batchWithWebsite.batch.length} items)`
          );

          // CREATE A TEMPORARY GROUP FOR THIS BATCH
          const batchGroup: WebsiteWithContent = {
            website: batchWithWebsite.website,
            content: batchWithWebsite.batch,
          };

          // ANALYZE BATCH WITH AI FOR LEAD SCORING
          const scoringResults = await analyzeContentWithAIForScoring(
            batchGroup
          );

          // PROCESS SCORES AND RETURN SCORED CONTENT
          const batchScoredContent = processScoringResults(
            batchWithWebsite.batch,
            scoringResults,
            scoreThreshold
          );

          console.log(
            `Completed scoring batch ${batchWithWebsite.batchNumber}/${batchWithWebsite.totalBatches} for ${batchWithWebsite.website.name}: ${batchScoredContent.length} items passed threshold from ${batchWithWebsite.batch.length} items`
          );

          return {
            success: true,
            scoredContent: batchScoredContent,
            website: batchWithWebsite.website.name,
          };
        } catch (error) {
          console.error(
            `Error processing scoring batch ${batchWithWebsite.batchNumber} for website ${batchWithWebsite.website.name}:`,
            error
          );

          return {
            success: false,
            scoredContent: [],
            website: batchWithWebsite.website.name,
            error,
          };
        }
      })
    );

    // COLLECT RESULTS
    for (const result of batchResults) {
      if (result.status === "fulfilled" && result.value.success) {
        scoredContent.push(...result.value.scoredContent);
        totalItemsScored += result.value.scoredContent.length;
      } else {
        console.error("Scoring batch processing failed:",
          result.status === 'fulfilled' ? result.value.error : result.reason);
      }
    }

    console.log(
      `AI content scoring completed: ${totalItemsScored} items passed threshold (${scoreThreshold}+) from ${totalContentItems} content items`
    );

    return scoredContent;
  } catch (error) {
    console.error("AI content scoring job failed:", error);
    throw error;
  }
}

// SCORE AND UPDATE CONTENT IN DATABASE
export async function scoreAndUpdateRedditContent(
  supabase: SupabaseClient,
  scoreThreshold: number = 0
): Promise<void> {
  try {
    console.log("Starting reddit content scoring job...");

    // GET ALL UNPROCESSED REDDIT CONTENT
    const unprocessedContent = await fetchUnprocessedContentForScoring(
      supabase
    );
    if (unprocessedContent.length === 0) {
      console.log("No unprocessed content found, skipping content scoring");
      return;
    }

    console.log(
      `Processing ${unprocessedContent.length} unprocessed content items for scoring`
    );

    // GROUP CONTENT BY WEBSITE FOR BATCH PROCESSING
    const websiteContentGroups = await groupContentByWebsiteForScoring(
      supabase,
      unprocessedContent
    );

    if (websiteContentGroups.length === 0) {
      console.log("No website content groups found, skipping content scoring");
      return;
    }

    console.log(
      `Processing ${websiteContentGroups.length} website groups for scoring`
    );

    // COLLECT ALL BATCHES FROM ALL WEBSITES
    const allBatches: BatchWithWebsite[] = [];
    let totalContentItems = 0;

    for (const group of websiteContentGroups) {
      const batches = splitContentIntoScoringBatches(group.content);

      // ADD WEBSITE CONTEXT TO EACH BATCH
      const batchesWithWebsite = batches.map((batch) => ({
        ...batch,
        website: group.website,
      }));

      allBatches.push(...batchesWithWebsite);
      totalContentItems += group.content.length;

      console.log(
        `Website ${group.website.name}: ${group.content.length} items split into ${batches.length} batches for scoring`
      );
    }

    console.log(
      `Total: ${allBatches.length} batches from ${totalContentItems} content items across ${websiteContentGroups.length} websites for scoring`
    );

    // PROCESS ALL BATCHES CONCURRENTLY (UP TO 10 AT ONCE)
    let totalItemsScored = 0;
    const processedRedditIds: string[] = [];

    const batchResults = await Promise.allSettled(
      allBatches.map(async (batchWithWebsite) => {
        try {
          console.log(
            `Processing scoring batch ${batchWithWebsite.batchNumber}/${batchWithWebsite.totalBatches} for ${batchWithWebsite.website.name} (${batchWithWebsite.batch.length} items)`
          );

          // CREATE A TEMPORARY GROUP FOR THIS BATCH
          const batchGroup: WebsiteWithContent = {
            website: batchWithWebsite.website,
            content: batchWithWebsite.batch,
          };

          // ANALYZE BATCH WITH AI FOR LEAD SCORING
          const scoringResults = await analyzeContentWithAIForScoring(
            batchGroup
          );

          // UPDATE CONTENT SCORES IN DATABASE
          const batchItemsScored = await updateContentScores(
            supabase,
            batchWithWebsite.website,
            scoringResults
          );

          console.log(
            `Completed scoring batch ${batchWithWebsite.batchNumber}/${batchWithWebsite.totalBatches} for ${batchWithWebsite.website.name}: ${batchItemsScored} items scored from ${batchWithWebsite.batch.length} items`
          );

          return {
            success: true,
            itemsScored: batchItemsScored,
            redditIds: batchWithWebsite.batch.map((c) => c.reddit_id),
            website: batchWithWebsite.website.name,
          };
        } catch (error) {
          console.error(
            `Error processing scoring batch ${batchWithWebsite.batchNumber} for website ${batchWithWebsite.website.name}:`,
            error
          );

          return {
            success: false,
            itemsScored: 0,
            redditIds: batchWithWebsite.batch.map((c) => c.reddit_id),
            website: batchWithWebsite.website.name,
            error,
          };
        }
      })
    );

    // COLLECT RESULTS
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        const { itemsScored, redditIds } = result.value;
        totalItemsScored += itemsScored;
        processedRedditIds.push(...redditIds);
      } else {
        console.error("Scoring batch processing failed:", result.reason);
      }
    }

    // LOG SUMMARY BY WEBSITE
    const websiteSummary = new Map<string, { scored: number; items: number }>();

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        const { itemsScored, redditIds, website } = result.value;
        const current = websiteSummary.get(website) || { scored: 0, items: 0 };
        websiteSummary.set(website, {
          scored: current.scored + itemsScored,
          items: current.items + redditIds.length,
        });
      }
    }

    for (const [websiteName, summary] of websiteSummary) {
      console.log(
        `Website ${websiteName}: ${summary.scored} items scored from ${summary.items} items`
      );
    }

    console.log(
      `Reddit content scoring job completed: ${totalItemsScored} items scored from ${totalContentItems} content items`
    );
  } catch (error) {
    console.error("Reddit content scoring job failed:", error);
    throw error;
  }
}

// FETCH UNPROCESSED CONTENT FROM DATABASE
async function fetchUnprocessedContentForScoring(
  supabase: SupabaseClient
): Promise<UnprocessedContent[]> {
  const { data: content, error } = await supabase
    .from("reddit_content_discovered")
    .select(
      "reddit_id, website_id, content, content_type, subreddit, author, ups, downs"
    )
    .eq("is_processed", false)
    .not("website_id", "is", null)
    .order("reddit_created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Error fetching unprocessed content for scoring:", error);
    throw error;
  }

  return (content as UnprocessedContent[]) || [];
}

// GROUP CONTENT BY WEBSITE FOR BATCH PROCESSING
async function groupContentByWebsiteForScoring(
  supabase: SupabaseClient,
  content: UnprocessedContent[]
): Promise<WebsiteWithContent[]> {
  // GET ALL UNIQUE WEBSITE IDS FROM CONTENT
  const websiteIds = [...new Set(content.map((c) => c.website_id))];

  if (websiteIds.length === 0) {
    return [];
  }

  // FETCH WEBSITE DETAILS FOR AI CONTEXT
  const { data: websites, error } = await supabase
    .from("websites")
    .select("id, name, description, url, user_id")
    .in("id", websiteIds);

  if (error) {
    console.error("Error fetching websites for scoring:", error);
    throw error;
  }

  if (!websites || websites.length === 0) {
    return [];
  }

  // GROUP CONTENT BY WEBSITE
  const groups: WebsiteWithContent[] = [];

  for (const website of websites) {
    const websiteContent = content.filter((c) => c.website_id === website.id);

    if (websiteContent.length > 0) {
      groups.push({
        website: website as Website,
        content: websiteContent,
      });
    }
  }

  return groups;
}

// SPLIT CONTENT INTO BATCHES FOR AI PROCESSING
function splitContentIntoScoringBatches(
  content: UnprocessedContent[],
  batchSize: number = 20
): ContentBatch[] {
  const batches: ContentBatch[] = [];
  const totalBatches = Math.ceil(content.length / batchSize);

  for (let i = 0; i < content.length; i += batchSize) {
    const batch = content.slice(i, i + batchSize);
    batches.push({
      batch,
      batchNumber: Math.floor(i / batchSize) + 1,
      totalBatches,
    });
  }

  return batches;
}

// ANALYZE CONTENT WITH AI FOR SCORING
async function analyzeContentWithAIForScoring(
  group: WebsiteWithContent
): Promise<LeadScoringResponse> {
  try {
    // PREPARE CONTENT FOR AI ANALYSIS
    const scoringRequest: LeadScoringRequest = {
      websiteName: group.website.name,
      websiteDescription: group.website.description || "",
      redditContent: group.content.map((content) => ({
        reddit_id: content.reddit_id,
        content: content.content,
        subreddit: content.subreddit,
        content_type: content.content_type as "post" | "comment",
      })),
    };

    console.log(
      `Analyzing ${group.content.length} content items for ${group.website.name} with AI`
    );

    // CALL GPT-5-NANO FOR ANALYSIS WITH RATE LIMITING
    const completion = await scoringLimiter.schedule(() =>
      openai.chat.completions.create({
        model: "gpt-5-nano-2025-08-07",
        messages: [
          {
            role: "system",
            content: LEAD_SCORING_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: buildMessageForLeadScoring(scoringRequest),
          },
        ],
        response_format: { type: "json_object" },
        verbosity: "medium",
        reasoning_effort: "medium",
      })
    );

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response from AI");
    }

    // PARSE AI RESPONSE
    const scoringResponse: LeadScoringResponse = JSON.parse(responseContent);

    // VALIDATE RESPONSE FORMAT
    if (!scoringResponse.results || !Array.isArray(scoringResponse.results)) {
      throw new Error("Invalid response format from AI");
    }

    console.log(
      `AI analyzed ${scoringResponse.results.length} items for ${group.website.name}`
    );

    return scoringResponse;
  } catch (error) {
    console.error(
      `Error analyzing content with AI for ${group.website.name}:`,
      error
    );
    throw error;
  }
}

// PROCESS SCORING RESULTS AND FILTER BY THRESHOLD
function processScoringResults(
  content: UnprocessedContent[],
  scoringResponse: LeadScoringResponse,
  scoreThreshold: number
): UnprocessedContent[] {
  const scoredContent: UnprocessedContent[] = [];

  for (const item of content) {
    const result = scoringResponse.results.find(
      (r) => r.reddit_id === item.reddit_id
    );

    if (result) {
      // ADD SCORING DATA TO CONTENT ITEM
      const scoredItem = {
        ...item,
        lead_score: result.lead_score,
        ai_explanation: result.explanation,
        is_processed: true,
      };

      // ONLY FILTER BY THRESHOLD IF THRESHOLD > 0
      if (scoreThreshold === 0 || result.lead_score >= scoreThreshold) {
        scoredContent.push(scoredItem);
      }
    }
  }

  return scoredContent;
}

// UPDATE CONTENT SCORES IN DATABASE
async function updateContentScores(
  supabase: SupabaseClient,
  website: Website,
  scoringResponse: LeadScoringResponse
): Promise<number> {
  if (!scoringResponse.results || scoringResponse.results.length === 0) {
    console.log(`No scoring results to update for ${website.name}`);
    return 0;
  }

  // PREPARE UPDATES WITH SCORES AND EXPLANATIONS
  const updates = scoringResponse.results.map((result) => ({
    reddit_id: result.reddit_id,
    website_id: website.id,
    lead_score: result.lead_score,
    ai_explanation: result.explanation,
    is_processed: true,
  }));

  const batchSize = 50;
  let successCount = 0;
  let errorCount = 0;

  // PROCESS UPDATES IN BATCHES
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    try {
      // UPDATE EACH ITEM INDIVIDUALLY TO ENSURE PROPER MATCHING
      for (const update of batch) {
        try {
          const { error } = await supabase
            .from("reddit_content_discovered")
            .update({
              lead_score: update.lead_score,
              ai_explanation: update.ai_explanation,
              is_processed: update.is_processed,
            })
            .eq("reddit_id", update.reddit_id)
            .eq("website_id", update.website_id);

          if (error) {
            console.error(
              `Error updating content ${update.reddit_id} for website ${website.name}:`,
              error
            );
            errorCount++;
          } else {
            successCount++;
          }
        } catch (individualError) {
          console.error(
            `Failed to update content ${update.reddit_id}:`,
            individualError
          );
          errorCount++;
        }
      }
    } catch (batchError) {
      console.error(
        `Failed to process update batch ${Math.floor(i / batchSize) + 1} for ${
          website.name
        }:`,
        batchError
      );
      errorCount += batch.length;
    }
  }

  console.log(
    `Content scoring update completed for ${website.name}: ${successCount} updated successfully, ${errorCount} failed`
  );

  return successCount;
}