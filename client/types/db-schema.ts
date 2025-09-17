import { Database } from "@/lib/supabase/database.types";

export type UserInfo = Database["public"]["Tables"]["user_info"]["Row"];

export type RedditAccount =
  Database["public"]["Tables"]["reddit_accounts"]["Row"];

export type RedditLead = Database["public"]["Tables"]["reddit_leads"]["Row"];

export type ContentType = Database["public"]["Enums"]["content_type"];

export type LeadStatus = Database["public"]["Enums"]["lead_status"];

export type Website = Database["public"]["Tables"]["websites"]["Row"];
