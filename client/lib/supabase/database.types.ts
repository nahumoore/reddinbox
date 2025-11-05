export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      email_notifications: {
        Row: {
          created_at: string | null
          email: string
          error_message: string | null
          id: string
          reason: Database["public"]["Enums"]["email_notification_reason"]
          sent_at: string
          status:
            | Database["public"]["Enums"]["email_notification_status"]
            | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          error_message?: string | null
          id?: string
          reason: Database["public"]["Enums"]["email_notification_reason"]
          sent_at?: string
          status?:
            | Database["public"]["Enums"]["email_notification_status"]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          error_message?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["email_notification_reason"]
          sent_at?: string
          status?:
            | Database["public"]["Enums"]["email_notification_status"]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      reddit_accounts: {
        Row: {
          access_token: string | null
          coins: number | null
          comment_karma: number | null
          created_at: string
          created_utc: number | null
          has_verified_email: boolean | null
          icon_img: string | null
          id: string
          is_active: boolean
          is_employee: boolean | null
          is_gold: boolean | null
          is_moderator: boolean | null
          is_suspended: boolean | null
          last_api_call: string | null
          link_karma: number | null
          name: string
          num_friends: number | null
          oauth_scopes: string[] | null
          public_description: string | null
          reddit_id: string
          refresh_token: string | null
          snoovatar_img: string | null
          subreddit: Json | null
          token_expires_at: string | null
          total_karma: number | null
          updated_at: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          access_token?: string | null
          coins?: number | null
          comment_karma?: number | null
          created_at?: string
          created_utc?: number | null
          has_verified_email?: boolean | null
          icon_img?: string | null
          id?: string
          is_active?: boolean
          is_employee?: boolean | null
          is_gold?: boolean | null
          is_moderator?: boolean | null
          is_suspended?: boolean | null
          last_api_call?: string | null
          link_karma?: number | null
          name: string
          num_friends?: number | null
          oauth_scopes?: string[] | null
          public_description?: string | null
          reddit_id: string
          refresh_token?: string | null
          snoovatar_img?: string | null
          subreddit?: Json | null
          token_expires_at?: string | null
          total_karma?: number | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          access_token?: string | null
          coins?: number | null
          comment_karma?: number | null
          created_at?: string
          created_utc?: number | null
          has_verified_email?: boolean | null
          icon_img?: string | null
          id?: string
          is_active?: boolean
          is_employee?: boolean | null
          is_gold?: boolean | null
          is_moderator?: boolean | null
          is_suspended?: boolean | null
          last_api_call?: string | null
          link_karma?: number | null
          name?: string
          num_friends?: number | null
          oauth_scopes?: string[] | null
          public_description?: string | null
          reddit_id?: string
          refresh_token?: string | null
          snoovatar_img?: string | null
          subreddit?: Json | null
          token_expires_at?: string | null
          total_karma?: number | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reddit_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      reddit_content_discovered: {
        Row: {
          author: string
          content: string
          content_category:
            | Database["public"]["Enums"]["reddit_post_category"]
            | null
          created_at: string | null
          downs: number | null
          embedded_content: string | null
          id: string
          reddit_created_at: string
          reddit_id: string
          reddit_url: string | null
          subreddit_id: string | null
          summarized_content: string | null
          title: string | null
          ups: number | null
        }
        Insert: {
          author: string
          content: string
          content_category?:
            | Database["public"]["Enums"]["reddit_post_category"]
            | null
          created_at?: string | null
          downs?: number | null
          embedded_content?: string | null
          id?: string
          reddit_created_at: string
          reddit_id: string
          reddit_url?: string | null
          subreddit_id?: string | null
          summarized_content?: string | null
          title?: string | null
          ups?: number | null
        }
        Update: {
          author?: string
          content?: string
          content_category?:
            | Database["public"]["Enums"]["reddit_post_category"]
            | null
          created_at?: string | null
          downs?: number | null
          embedded_content?: string | null
          id?: string
          reddit_created_at?: string
          reddit_id?: string
          reddit_url?: string | null
          subreddit_id?: string | null
          summarized_content?: string | null
          title?: string | null
          ups?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reddit_content_discovered_subreddit_id_fkey"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "reddit_subreddits"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_leads: {
        Row: {
          buying_signals: string[] | null
          conversation_summary: string | null
          created_at: string | null
          first_interaction_at: string | null
          id: string
          last_analyzed_at: string | null
          last_interaction_at: string | null
          lead_score: number
          lead_status: Database["public"]["Enums"]["reddit_lead_status"]
          marked_ready_at: string | null
          notes: string | null
          pain_points: string[] | null
          reddit_username: string
          total_interactions_count: number | null
          updated_at: string | null
          user_id: string
          website_id: string
        }
        Insert: {
          buying_signals?: string[] | null
          conversation_summary?: string | null
          created_at?: string | null
          first_interaction_at?: string | null
          id?: string
          last_analyzed_at?: string | null
          last_interaction_at?: string | null
          lead_score?: number
          lead_status?: Database["public"]["Enums"]["reddit_lead_status"]
          marked_ready_at?: string | null
          notes?: string | null
          pain_points?: string[] | null
          reddit_username: string
          total_interactions_count?: number | null
          updated_at?: string | null
          user_id: string
          website_id: string
        }
        Update: {
          buying_signals?: string[] | null
          conversation_summary?: string | null
          created_at?: string | null
          first_interaction_at?: string | null
          id?: string
          last_analyzed_at?: string | null
          last_interaction_at?: string | null
          lead_score?: number
          lead_status?: Database["public"]["Enums"]["reddit_lead_status"]
          marked_ready_at?: string | null
          notes?: string | null
          pain_points?: string[] | null
          reddit_username?: string
          total_interactions_count?: number | null
          updated_at?: string | null
          user_id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "reddit_leads_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_subreddits: {
        Row: {
          banner_background_image: string | null
          community_icon: string | null
          created_at: string | null
          created_utc: number | null
          description: string | null
          display_name_prefixed: string
          id: string
          is_active: boolean | null
          lang: string | null
          primary_color: string | null
          public_description: string | null
          subreddit_type: string | null
          subscribers: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          banner_background_image?: string | null
          community_icon?: string | null
          created_at?: string | null
          created_utc?: number | null
          description?: string | null
          display_name_prefixed: string
          id: string
          is_active?: boolean | null
          lang?: string | null
          primary_color?: string | null
          public_description?: string | null
          subreddit_type?: string | null
          subscribers?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_background_image?: string | null
          community_icon?: string | null
          created_at?: string | null
          created_utc?: number | null
          description?: string | null
          display_name_prefixed?: string
          id?: string
          is_active?: boolean | null
          lang?: string | null
          primary_color?: string | null
          public_description?: string | null
          subreddit_type?: string | null
          subscribers?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reddit_user_interactions: {
        Row: {
          created_at: string | null
          discovered_reddit_id: string | null
          error_message: string | null
          id: string
          interacted_with_reddit_username: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          original_reddit_parent_id: string
          our_interaction_content: string | null
          our_interaction_reddit_id: string | null
          reddit_account_id: string | null
          reddit_content_discovered_id: string | null
          reddit_lead: string | null
          retry_count: number | null
          scheduled_at: string | null
          similarity_score: number | null
          status: Database["public"]["Enums"]["reddit_interaction_status"]
          thread_context: Json | null
          updated_at: string | null
          user_id: string
          website_id: string
        }
        Insert: {
          created_at?: string | null
          discovered_reddit_id?: string | null
          error_message?: string | null
          id?: string
          interacted_with_reddit_username: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          original_reddit_parent_id: string
          our_interaction_content?: string | null
          our_interaction_reddit_id?: string | null
          reddit_account_id?: string | null
          reddit_content_discovered_id?: string | null
          reddit_lead?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          similarity_score?: number | null
          status?: Database["public"]["Enums"]["reddit_interaction_status"]
          thread_context?: Json | null
          updated_at?: string | null
          user_id: string
          website_id: string
        }
        Update: {
          created_at?: string | null
          discovered_reddit_id?: string | null
          error_message?: string | null
          id?: string
          interacted_with_reddit_username?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          original_reddit_parent_id?: string
          our_interaction_content?: string | null
          our_interaction_reddit_id?: string | null
          reddit_account_id?: string | null
          reddit_content_discovered_id?: string | null
          reddit_lead?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          similarity_score?: number | null
          status?: Database["public"]["Enums"]["reddit_interaction_status"]
          thread_context?: Json | null
          updated_at?: string | null
          user_id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_user_interactions_reddit_account_id_fkey"
            columns: ["reddit_account_id"]
            isOneToOne: false
            referencedRelation: "reddit_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_user_interactions_reddit_content_discovered_id_fkey"
            columns: ["reddit_content_discovered_id"]
            isOneToOne: false
            referencedRelation: "reddit_content_discovered"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_user_interactions_reddit_lead_fkey"
            columns: ["reddit_lead"]
            isOneToOne: false
            referencedRelation: "reddit_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_user_interactions_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "reddit_user_interactions_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_info: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string | null
          id: string
          last_connected: string
          name: string | null
          onboarding_completed: boolean
          stripe_customer_id: string | null
          subscription_period_end_at: string
          subscription_period_started_at: string
          subscription_status: Database["public"]["Enums"]["subscription_statuses"]
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email?: string | null
          id?: string
          last_connected?: string
          name?: string | null
          onboarding_completed?: boolean
          stripe_customer_id?: string | null
          subscription_period_end_at?: string
          subscription_period_started_at?: string
          subscription_status?: Database["public"]["Enums"]["subscription_statuses"]
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string | null
          id?: string
          last_connected?: string
          name?: string | null
          onboarding_completed?: boolean
          stripe_customer_id?: string | null
          subscription_period_end_at?: string
          subscription_period_started_at?: string
          subscription_status?: Database["public"]["Enums"]["subscription_statuses"]
          updated_at?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          authority_feed_options: Json | null
          created_at: string
          description: string | null
          expertise: string[] | null
          id: string
          is_active: boolean
          keywords: string[] | null
          name: string
          subreddit_reddit_ids: string[] | null
          target_audience: string | null
          type_of_service: Database["public"]["Enums"]["website_type_of_service"]
          updated_at: string
          url: string
          user_id: string
          vector_ai_searcher: string
        }
        Insert: {
          authority_feed_options?: Json | null
          created_at?: string
          description?: string | null
          expertise?: string[] | null
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          name: string
          subreddit_reddit_ids?: string[] | null
          target_audience?: string | null
          type_of_service?: Database["public"]["Enums"]["website_type_of_service"]
          updated_at?: string
          url: string
          user_id: string
          vector_ai_searcher: string
        }
        Update: {
          authority_feed_options?: Json | null
          created_at?: string
          description?: string | null
          expertise?: string[] | null
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          name?: string
          subreddit_reddit_ids?: string[] | null
          target_audience?: string | null
          type_of_service?: Database["public"]["Enums"]["website_type_of_service"]
          updated_at?: string
          url?: string
          user_id?: string
          vector_ai_searcher?: string
        }
        Relationships: [
          {
            foreignKeyName: "websites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      whitelist: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_relevant_reddit_content: {
        Args: { p_limit?: number; p_website_id: string }
        Returns: {
          author: string
          content: string
          downs: number
          id: string
          reddit_created_at: string
          reddit_id: string
          reddit_url: string
          similarity_score: number
          subreddit_id: string
          title: string
          ups: number
        }[]
      }
      match_reddit_content: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          author: string
          content: string
          id: string
          reddit_created_at: string
          reddit_url: string
          similarity: number
          subreddit_name: string
          title: string
          ups: number
        }[]
      }
    }
    Enums: {
      email_notification_reason:
        | "new-interactions-ready"
        | "subscription-expired"
        | "interactions-limit-reached"
        | "feedback"
      email_notification_status: "pending" | "sent" | "failed"
      interaction_type: "comment_reply" | "post_reply" | "dm"
      reddit_interaction_status: "new" | "ignored" | "posted" | "scheduled"
      reddit_lead_status:
        | "new"
        | "unqualified"
        | "contacted"
        | "responded"
        | "converted"
        | "not_interested"
      reddit_post_category:
        | "help_request"
        | "advice_seeking"
        | "problem_complaint"
        | "comparison_request"
        | "open_discussion"
        | "success_story"
        | "experience_share"
        | "news_update"
        | "tool_announcement"
        | "self_promotion"
        | "resource_compilation"
        | "other"
      subscription_statuses: "free-trial" | "active" | "stopped"
      website_type_of_service: "saas" | "agency"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      email_notification_reason: [
        "new-interactions-ready",
        "subscription-expired",
        "interactions-limit-reached",
        "feedback",
      ],
      email_notification_status: ["pending", "sent", "failed"],
      interaction_type: ["comment_reply", "post_reply", "dm"],
      reddit_interaction_status: ["new", "ignored", "posted", "scheduled"],
      reddit_lead_status: [
        "new",
        "unqualified",
        "contacted",
        "responded",
        "converted",
        "not_interested",
      ],
      reddit_post_category: [
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
      subscription_statuses: ["free-trial", "active", "stopped"],
      website_type_of_service: ["saas", "agency"],
    },
  },
} as const
