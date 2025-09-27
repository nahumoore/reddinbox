import { Database } from "@/lib/supabase/database.types";

export type UserInfo = Database["public"]["Tables"]["user_info"]["Row"];

export type RedditAccount =
  Database["public"]["Tables"]["reddit_accounts"]["Row"];

export type ContentType = Database["public"]["Enums"]["content_type"];

export type Website = Database["public"]["Tables"]["websites"]["Row"];

export type RedditContentDiscovered =
  Database["public"]["Tables"]["reddit_content_discovered"]["Row"];

export type RedditSubreddit =
  Database["public"]["Tables"]["reddit_subreddits"]["Row"];

export type RedditUserInteraction =
  Database["public"]["Tables"]["reddit_user_interactions"]["Row"] & {
    reddit_content_discovered:
      | (RedditContentDiscovered & {
          subreddit: RedditSubreddit;
        })
      | null;
  };
