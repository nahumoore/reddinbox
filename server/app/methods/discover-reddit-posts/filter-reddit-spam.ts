import { REDDIT_SPAM_FILTER_PROMPT } from "@/defs/ai/reddit-spam-filter-prompt";
import OpenAI from "openai";

export interface SpamFilterInput {
  id: string;
  title: string;
  content: string;
}

export interface SpamFilterResult {
  id: string;
  approved: boolean;
  confidence: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// TRUNCATE POST CONTENT TO MAX 1250 CHARACTERS (~200 WORDS)
function truncatePostContent(post: SpamFilterInput): SpamFilterInput {
  return {
    ...post,
    content:
      post.content.length > 1250
        ? post.content.substring(0, 1250) + "..."
        : post.content,
  };
}

// AI SPAM FILTER FUNCTION FOR A SINGLE BATCH WITH RETRY LOGIC
async function filterSpamBatch(
  posts: SpamFilterInput[]
): Promise<SpamFilterResult[]> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // TRUNCATE POST CONTENT BEFORE SENDING TO LLM
      const truncatedPosts = posts.map(truncatePostContent);

      const analysisResponse = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          {
            role: "developer",
            content: REDDIT_SPAM_FILTER_PROMPT,
          },
          {
            role: "user",
            content: JSON.stringify(truncatedPosts),
          },
        ],
        store: true,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "post_approval_list",
            strict: true,
            schema: {
              type: "object",
              properties: {
                posts: {
                  type: "array",
                  description:
                    "List of post objects with approval status and confidence scores.",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description:
                          "Unique identifier for the post provided on the input.",
                        minLength: 1,
                      },
                      approved: {
                        type: "boolean",
                        description: "Whether the post is approved or not.",
                      },
                      confidence: {
                        type: "number",
                        description:
                          "Confidence score for the approval decision (0.0 - 1.0).",
                        minimum: 0,
                        maximum: 1,
                      },
                    },
                    required: ["id", "approved", "confidence"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["posts"],
              additionalProperties: false,
            },
          },
        },
        verbosity: "low",
        reasoning_effort: "medium",
      });

      const result = analysisResponse.choices[0]?.message?.content;
      if (!result) {
        throw new Error("No response from OpenAI spam filter");
      }

      const parsedResult = JSON.parse(result);
      const spamResults: SpamFilterResult[] = parsedResult.posts;
      return spamResults;
    } catch (error) {
      retryCount++;
      console.error(`🛡️ Spam filter API attempt ${retryCount} failed:`, error);

      if (retryCount >= maxRetries) {
        console.error(
          `❌ Spam filter failed after ${maxRetries} attempts, using fallback`
        );
        // FALLBACK - APPROVE ALL POSTS IF AI FAILS AFTER ALL RETRIES
        return posts.map((post) => ({
          id: post.id,
          approved: true,
          confidence: 0.5,
        }));
      }

      // EXPONENTIAL BACKOFF: WAIT 1S, 2S, 4S
      const waitTime = Math.pow(2, retryCount - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  // THIS LINE SHOULD NEVER BE REACHED DUE TO THE FALLBACK ABOVE
  return posts.map((post) => ({
    id: post.id,
    approved: true,
    confidence: 0.5,
  }));
}

// AI SPAM FILTER FUNCTION WITH BATCH PROCESSING AND CONCURRENCY CONTROL
export async function filterSpamPosts(
  posts: SpamFilterInput[]
): Promise<SpamFilterResult[]> {
  if (posts.length === 0) {
    return [];
  }

  console.log(
    `🤖 Filtering ${posts.length} posts for spam in batches of 10...`
  );

  // SPLIT POSTS INTO BATCHES OF 10
  const batches: SpamFilterInput[][] = [];
  for (let i = 0; i < posts.length; i += 10) {
    batches.push(posts.slice(i, i + 10));
  }

  console.log(`📦 Created ${batches.length} batches for processing`);

  // PROCESS BATCHES WITH CONCURRENCY CONTROL (MAX 10 PARALLEL JOBS)
  const results: SpamFilterResult[] = [];
  const concurrencyLimit = 50;

  for (let i = 0; i < batches.length; i += concurrencyLimit) {
    const batchGroup = batches.slice(i, i + concurrencyLimit);

    console.log(
      `🔄 Processing batch group ${Math.floor(i / concurrencyLimit) + 1} with ${
        batchGroup.length
      } batches`
    );

    // PROCESS BATCHES IN PARALLEL (UP TO 10 AT A TIME)
    const batchPromises = batchGroup.map((batch, index) => {
      console.log(
        `   📋 Processing batch ${i + index + 1}/${batches.length} (${
          batch.length
        } posts)`
      );
      return filterSpamBatch(batch);
    });

    try {
      const batchResults = await Promise.allSettled(batchPromises);

      // FLATTEN RESULTS FROM ALL BATCHES IN THIS GROUP - FIXED SPREAD SYNTAX ERROR
      for (const result of batchResults) {
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
          results.push(...result.value);
        } else {
          // FALLBACK FOR FAILED INDIVIDUAL BATCH
          console.error(
            "Failed batch result:",
            result.status === "rejected"
              ? result.reason
              : "Invalid result format"
          );
          // FIND CORRESPONDING BATCH TO APPLY FALLBACK
          const batchIndex = batchResults.indexOf(result);
          if (batchIndex !== -1 && batchIndex < batchGroup.length) {
            const failedBatch = batchGroup[batchIndex];
            results.push(
              ...failedBatch.map((post) => ({
                id: post.id,
                approved: true,
                confidence: 0.5,
              }))
            );
          }
        }
      }

      console.log(
        `✅ Completed batch group ${Math.floor(i / concurrencyLimit) + 1}`
      );
    } catch (error) {
      console.error(
        `❌ Error processing batch group ${
          Math.floor(i / concurrencyLimit) + 1
        }:`,
        error
      );

      // FALLBACK FOR FAILED BATCH GROUP
      for (const batch of batchGroup) {
        results.push(
          ...batch.map((post) => ({
            id: post.id,
            approved: true,
            confidence: 0.5,
          }))
        );
      }
    }
  }

  const approvedCount = results.filter((r) => r.approved).length;
  console.log(
    `✅ Spam filtering completed - ${approvedCount}/${results.length} posts approved`
  );

  return results;
}
