import { Database } from "../lib/supabase/database.types";

export type Website = Database["public"]["Tables"]["websites"]["Row"];
export type RedditContent =
  Database["public"]["Tables"]["reddit_content_discovered"]["Insert"];
export type RedditUserInteraction =
  Database["public"]["Tables"]["reddit_user_interactions"]["Row"];
export type RedditLead = Database["public"]["Tables"]["reddit_leads"]["Row"];
export type RedditContentDiscovered =
  Database["public"]["Tables"]["reddit_content_discovered"]["Row"];
export type RedditAccount =
  Database["public"]["Tables"]["reddit_accounts"]["Row"];
