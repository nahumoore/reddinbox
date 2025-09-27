import Bottleneck from "bottleneck";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// BOTTLENECK FOR EMBEDDING API CALLS - MAX 200 CONCURRENT CALLS
const embeddingLimiter = new Bottleneck({
  maxConcurrent: 200,
});

// EMBEDDING GENERATION FUNCTION WITH RETRY LOGIC
async function generateEmbedding(
  title: string,
  content: string
): Promise<number[]> {
  const prompt = `<title>${title}</title><content>${content}</content>`;

  // RETRY LOGIC WITH EXPONENTIAL BACKOFF
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const embedding = await embeddingLimiter.schedule(() =>
        openai.embeddings.create({
          model: "text-embedding-3-small",
          input: prompt,
          encoding_format: "float",
        })
      );

      // VALIDATE RESPONSE FORMAT
      if (
        !embedding?.data?.[0]?.embedding ||
        !Array.isArray(embedding.data[0].embedding)
      ) {
        throw new Error("Invalid embedding response format");
      }

      return embedding.data[0].embedding;
    } catch (error) {
      retryCount++;
      console.error(`📊 Embedding API attempt ${retryCount} failed:`, error);

      if (retryCount >= maxRetries) {
        throw new Error(
          `Failed to generate embedding after ${maxRetries} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      // EXPONENTIAL BACKOFF: WAIT 1S, 2S, 4S
      const waitTime = Math.pow(2, retryCount - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  // THIS LINE SHOULD NEVER BE REACHED DUE TO THE THROW ABOVE
  throw new Error("Unexpected error in generateEmbedding function");
}

// GENERATE EMBEDDINGS FOR MULTIPLE POSTS WITH PARALLEL PROCESSING AND CONCURRENCY CONTROL
export async function generateEmbeddingsForPosts(posts: any[]): Promise<{
  postsWithEmbeddings: any[];
  successCount: number;
  failureCount: number;
}> {
  if (posts.length === 0) {
    return { postsWithEmbeddings: posts, successCount: 0, failureCount: 0 };
  }

  console.log(
    `📊 Generating embeddings for ${posts.length} posts in parallel...`
  );

  let successCount = 0;
  let failureCount = 0;

  // CREATE EMBEDDING GENERATION PROMISES FOR ALL POSTS
  const embeddingPromises = posts.map(async (post) => {
    try {
      // GENERATE EMBEDDING FOR TITLE + CONTENT
      const embedding = await generateEmbedding(
        post.title || "",
        post.content || ""
      );

      return {
        ...post,
        embedded_content: embedding,
        success: true,
      };
    } catch (error) {
      console.error(
        `⚠️ Failed to generate embedding for post ${post.reddit_id}:`,
        error
      );

      return {
        ...post,
        embedded_content: null,
        success: false,
      };
    }
  });

  // EXECUTE ALL EMBEDDING GENERATIONS IN PARALLEL WITH PROPER ERROR HANDLING
  const results = await Promise.allSettled(embeddingPromises);

  // PROCESS RESULTS AND COUNT SUCCESS/FAILURES
  const postsWithEmbeddings = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      const postResult = result.value;
      const { success, ...postWithoutSuccess } = postResult;
      postsWithEmbeddings.push(postWithoutSuccess);

      if (postResult.success) {
        successCount++;
      } else {
        failureCount++;
      }
    } else {
      // HANDLE PROMISE REJECTION (SHOULD BE RARE DUE TO TRY/CATCH ABOVE)
      console.error("Unexpected embedding promise rejection:", result.reason);
      failureCount++;

      // ADD A FALLBACK POST (THOUGH WE DON'T HAVE THE ORIGINAL POST DATA HERE)
      // THIS SHOULD BE VERY RARE DUE TO INTERNAL ERROR HANDLING
    }
  }

  console.log(
    `📊 Parallel embedding generation completed: ${successCount} success, ${failureCount} failures`
  );

  return { postsWithEmbeddings, successCount, failureCount };
}
