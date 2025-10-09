import { REDDIT_CATEGORY_CLASSIFICATION_PROMPT } from "@/defs/ai/reddit-post-classification";
import OpenAI from "openai";

export interface ClassificationInput {
  id: string;
  title: string;
  content: string;
}

export interface ClassificationResult {
  id: string;
  category: string;
  summary: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// TRUNCATE POST CONTENT TO MAX 1250 CHARACTERS (~200 WORDS)
function truncatePostContent(post: ClassificationInput): ClassificationInput {
  return {
    ...post,
    content:
      post.content.length > 1250
        ? post.content.substring(0, 1250) + "..."
        : post.content,
  };
}

// AI CLASSIFICATION FUNCTION FOR A SINGLE BATCH WITH RETRY LOGIC
async function classifyPostsBatch(
  posts: ClassificationInput[]
): Promise<ClassificationResult[]> {
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
            content: REDDIT_CATEGORY_CLASSIFICATION_PROMPT,
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
            name: "post_classification_list",
            strict: true,
            schema: {
              type: "object",
              properties: {
                posts: {
                  type: "array",
                  description:
                    "List of post objects with their assigned categories.",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description:
                          "Unique identifier for the post provided on the input.",
                        minLength: 1,
                      },
                      category: {
                        type: "string",
                        description: "The assigned category for the post.",
                        enum: [
                          "help_request",
                          "advice_seeking",
                          "problem_complaint",
                          "comparison_request",
                          "open_discussion",
                          "success_story",
                          "experience_share",
                          "news_update",
                          "tool_announcement",
                          "self_promotion",
                          "resource_compilation",
                          "other",
                        ],
                      },
                      summary: {
                        type: "string",
                        description:
                          "A concise summary of the post. 2-3 sentences maximum.",
                      },
                    },
                    required: ["id", "category", "summary"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["posts"],
              additionalProperties: false,
            },
          },
        },
        verbosity: "medium",
        reasoning_effort: "medium",
      });

      const result = analysisResponse.choices[0]?.message?.content;
      if (!result) {
        throw new Error("No response from OpenAI classification");
      }

      const parsedResult = JSON.parse(result);
      const classificationResults: ClassificationResult[] = parsedResult.posts;
      return classificationResults;
    } catch (error) {
      retryCount++;
      console.error(
        `🏷️ Classification API attempt ${retryCount} failed:`,
        error
      );

      if (retryCount >= maxRetries) {
        console.error(
          `❌ Classification failed after ${maxRetries} attempts, using fallback`
        );
        // FALLBACK - ASSIGN "OTHER" CATEGORY TO ALL POSTS IF AI FAILS AFTER ALL RETRIES
        return posts.map((post) => ({
          id: post.id,
          category: "other",
          summary: "",
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
    category: "other",
    summary: "",
  }));
}

// AI CLASSIFICATION FUNCTION WITH BATCH PROCESSING AND CONCURRENCY CONTROL
export async function classifyRedditPosts(
  posts: ClassificationInput[]
): Promise<ClassificationResult[]> {
  if (posts.length === 0) {
    return [];
  }

  console.log(
    `🏷️ Classifying ${posts.length} posts into categories in batches of 10...`
  );

  // SPLIT POSTS INTO BATCHES OF 10
  const batches: ClassificationInput[][] = [];
  for (let i = 0; i < posts.length; i += 10) {
    batches.push(posts.slice(i, i + 10));
  }

  console.log(`📦 Created ${batches.length} batches for classification`);

  // PROCESS BATCHES WITH CONCURRENCY CONTROL (MAX 10 PARALLEL JOBS)
  const results: ClassificationResult[] = [];
  const concurrencyLimit = 10;

  for (let i = 0; i < batches.length; i += concurrencyLimit) {
    const batchGroup = batches.slice(i, i + concurrencyLimit);

    console.log(
      `🔄 Processing classification batch group ${
        Math.floor(i / concurrencyLimit) + 1
      } with ${batchGroup.length} batches`
    );

    // PROCESS BATCHES IN PARALLEL (UP TO 10 AT A TIME)
    const batchPromises = batchGroup.map((batch, index) => {
      console.log(
        `   📋 Classifying batch ${i + index + 1}/${batches.length} (${
          batch.length
        } posts)`
      );
      return classifyPostsBatch(batch);
    });

    try {
      const batchResults = await Promise.allSettled(batchPromises);

      // FLATTEN RESULTS FROM ALL BATCHES IN THIS GROUP
      for (const result of batchResults) {
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
          results.push(...result.value);
        } else {
          // FALLBACK FOR FAILED INDIVIDUAL BATCH
          console.error(
            "Failed classification batch result:",
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
                category: "other",
                summary: "",
              }))
            );
          }
        }
      }

      console.log(
        `✅ Completed classification batch group ${
          Math.floor(i / concurrencyLimit) + 1
        }`
      );
    } catch (error) {
      console.error(
        `❌ Error processing classification batch group ${
          Math.floor(i / concurrencyLimit) + 1
        }:`,
        error
      );

      // FALLBACK FOR FAILED BATCH GROUP
      for (const batch of batchGroup) {
        results.push(
          ...batch.map((post) => ({
            id: post.id,
            category: "other",
            summary: "",
          }))
        );
      }
    }
  }

  // COUNT POSTS PER CATEGORY FOR LOGGING
  const categoryCounts = results.reduce((acc, result) => {
    acc[result.category] = (acc[result.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(
    `✅ Classification completed - ${results.length} posts categorized`
  );
  console.log(`📊 Category distribution:`, categoryCounts);

  return results;
}
