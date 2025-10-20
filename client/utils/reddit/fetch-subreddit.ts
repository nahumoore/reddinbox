import { SubredditData } from "@/types/reddit";
import { redditCallout } from "./reddit-callout";

interface RedditSubredditAbout {
  data: {
    id: string;
    display_name: string;
    display_name_prefixed: string;
    title: string;
    header_title?: string;
    primary_color?: string;
    subscribers: number;
    public_description: string;
    community_icon?: string;
    icon_img?: string;
    url: string;
    banner_background_image: string;
    description: string;
    lang: string;
  };
}

/**
 * Fetches a single subreddit's data by its name
 * @param subredditName - The subreddit name (can include or exclude 'r/' prefix)
 * @returns SubredditData or null if not found
 */
export async function fetchSubredditByName(
  subredditName: string
): Promise<SubredditData | null> {
  try {
    // Remove 'r/' prefix if present and clean the name
    const cleanName = subredditName.replace(/^r\//, "").trim();

    if (!cleanName) {
      console.error("Invalid subreddit name:", subredditName);
      return null;
    }

    const aboutUrl = `https://www.reddit.com/r/${cleanName}/about.json`;

    const result = await redditCallout<RedditSubredditAbout>(aboutUrl, {
      useOAuth: true, // Use OAuth to bypass IP blocking
    });

    if (!result.success || !result.data) {
      console.error(
        `Failed to fetch subreddit ${cleanName}:`,
        result.error || "No data returned"
      );
      return null;
    }

    const subreddit = result.data.data;

    return {
      id: subreddit.id,
      display_name_prefixed: subreddit.display_name_prefixed,
      title: subreddit.title,
      primary_color: subreddit.primary_color || "",
      subscribers: subreddit.subscribers,
      public_description: subreddit.public_description,
      community_icon: subreddit.community_icon || "",
      banner_background_image: subreddit.banner_background_image,
      description: subreddit.description,
      lang: subreddit.lang,
    };
  } catch (error) {
    console.error(`Error fetching subreddit ${subredditName}:`, error);
    return null;
  }
}

/**
 * Fetches multiple subreddits in parallel
 * @param subredditNames - Array of subreddit names
 * @returns Array of SubredditData (null entries for failed fetches are filtered out)
 */
export async function fetchMultipleSubreddits(
  subredditNames: string[]
): Promise<SubredditData[]> {
  const results = await Promise.all(
    subredditNames.map((name) => fetchSubredditByName(name))
  );

  // Filter out null results (failed fetches)
  return results.filter((subreddit): subreddit is SubredditData =>
    subreddit !== null
  );
}
