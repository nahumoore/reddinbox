interface ScrapedContent {
  title: string;
  description: string;
  content: string;
  error?: string;
}

export async function scrapeWebsite(url: string): Promise<ScrapedContent> {
  try {
    // Validate and normalize URL
    const normalizedUrl = normalizeUrl(url);

    // Fetch the webpage
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract content using simple regex patterns (no external dependencies)
    const content = extractContent(html);

    return content;
  } catch (error) {
    console.error("Website scraping error:", error);
    return {
      title: "",
      description: "",
      content: "",
      error:
        error instanceof Error ? error.message : "Failed to scrape website",
    };
  }
}

function normalizeUrl(url: string): string {
  // Add protocol if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  // Basic URL validation
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error("Invalid URL format");
  }
}

function extractContent(html: string): ScrapedContent {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)</i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // Extract meta description
  const descriptionMatch =
    html.match(
      /<meta[^>]*name=['"]description['"][^>]*content=['"]([^'"]+)['"][^>]*>/i
    ) ||
    html.match(
      /<meta[^>]*content=['"]([^'"]+)['"][^>]*name=['"]description['"][^>]*>/i
    );
  const description = descriptionMatch ? descriptionMatch[1].trim() : "";

  // Extract headings (h1, h2, h3)
  const headings = html.match(/<h[123][^>]*>([^<]+)</gi) || [];
  const headingText = headings
    .map((h) => h.replace(/<[^>]*>/g, "").trim())
    .join(" ");

  // Extract paragraph content
  const paragraphs = html.match(/<p[^>]*>([^<]+)</gi) || [];
  const paragraphText = paragraphs
    .map((p) => p.replace(/<[^>]*>/g, "").trim())
    .filter((p) => p.length > 20) // Only keep substantial paragraphs
    .slice(0, 10) // Limit to first 10 paragraphs
    .join(" ");

  // Combine all text content
  const combinedContent = [title, description, headingText, paragraphText]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: title || "No title found",
    description: description || "No description found",
    content: combinedContent || "No content extracted",
  };
}
