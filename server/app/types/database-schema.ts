import { Database } from "../lib/supabase/database.types";

export type Website = Database["public"]["Tables"]["websites"]["Row"];
export type RedditContent =
  Database["public"]["Tables"]["reddit_content_discovered"]["Insert"];
