import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProblemEmbedding(
  problemStatement: string
): Promise<number[]> {
  // Retry logic with exponential backoff
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: problemStatement,
        encoding_format: "float",
      });

      // Validate response format
      if (
        !embedding?.data?.[0]?.embedding ||
        !Array.isArray(embedding.data[0].embedding)
      ) {
        throw new Error("Invalid embedding response format");
      }

      return embedding.data[0].embedding;
    } catch (error) {
      retryCount++;
      console.error(`Embedding API attempt ${retryCount} failed:`, error);

      if (retryCount >= maxRetries) {
        throw new Error(
          `Failed to generate embedding after ${maxRetries} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      // Exponential backoff: wait 1s, 2s, 4s
      const waitTime = Math.pow(2, retryCount - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new Error("Unexpected error in embedding generation");
}
