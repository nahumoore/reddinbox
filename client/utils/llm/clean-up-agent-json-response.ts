/**
 * Cleans up and parses JSON responses from AI agents that may come in various formats:
 * - Wrapped in markdown code blocks (```json ... ```)
 * - Plain JSON strings
 * - With extra whitespace or newlines
 * - With escaped characters
 *
 * @param response - The raw response string from the AI agent
 * @returns Parsed JSON object
 * @throws Error if the response cannot be parsed as valid JSON
 */
export function cleanUpAgentJsonResponse<T = any>(response: string): T {
  if (!response || typeof response !== "string") {
    throw new Error("Invalid response: response must be a non-empty string");
  }

  let cleanedResponse = response.trim();

  // Remove markdown code block wrappers (```json ... ``` or ``` ... ```)
  const jsonCodeBlockRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/;
  const match = cleanedResponse.match(jsonCodeBlockRegex);

  if (match) {
    cleanedResponse = match[1].trim();
  }

  // Remove any leading/trailing whitespace again after extraction
  cleanedResponse = cleanedResponse.trim();

  // Try to parse the JSON
  try {
    const parsed = JSON.parse(cleanedResponse);
    return parsed as T;
  } catch (parseError) {
    // If initial parse fails, try additional cleanup strategies

    // Strategy 1: Remove any text before the first { or [
    const jsonStartMatch = cleanedResponse.match(/^[^{\[]*([{\[][\s\S]*)/);
    if (jsonStartMatch) {
      try {
        const parsed = JSON.parse(jsonStartMatch[1]);
        return parsed as T;
      } catch {
        // Continue to next strategy
      }
    }

    // Strategy 2: Remove any text after the last } or ]
    const jsonEndMatch = cleanedResponse.match(/([\s\S]*[}\]])[^}\]]*$/);
    if (jsonEndMatch) {
      try {
        const parsed = JSON.parse(jsonEndMatch[1]);
        return parsed as T;
      } catch {
        // Continue to next strategy
      }
    }

    // Strategy 3: Try to extract JSON from the middle of text
    const combinedMatch = cleanedResponse.match(/([{\[][\s\S]*[}\]])/);
    if (combinedMatch) {
      try {
        const parsed = JSON.parse(combinedMatch[1]);
        return parsed as T;
      } catch {
        // All strategies failed
      }
    }

    // If all strategies fail, throw a descriptive error
    throw new Error(
      `Failed to parse JSON response. Original error: ${parseError instanceof Error ? parseError.message : "Unknown error"}. Response preview: ${cleanedResponse.substring(0, 200)}...`
    );
  }
}
