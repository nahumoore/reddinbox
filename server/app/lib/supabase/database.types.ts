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
          content_type: Database["public"]["Enums"]["content_type"] | null
          created_at: string | null
          downs: number | null
          embedded_content: string | null
          id: string
          reddit_created_at: string
          reddit_id: string
          reddit_url: string | null
          subreddit_id: string | null
          title: string | null
          ups: number | null
        }
        Insert: {
          author: string
          content: string
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          downs?: number | null
          embedded_content?: string | null
          id?: string
          reddit_created_at: string
          reddit_id: string
          reddit_url?: string | null
          subreddit_id?: string | null
          title?: string | null
          ups?: number | null
        }
        Update: {
          author?: string
          content?: string
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          downs?: number | null
          embedded_content?: string | null
          id?: string
          reddit_created_at?: string
          reddit_id?: string
          reddit_url?: string | null
          subreddit_id?: string | null
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
      reddit_subreddits: {
        Row: {
          audience_ai_prompt: string | null
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
          audience_ai_prompt?: string | null
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
          audience_ai_prompt?: string | null
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
          id: string
          interacted_with_reddit_username: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          original_reddit_post_id: string
          our_interaction_content: string
          our_interaction_reddit_id: string | null
          reddit_content_discovered_id: string | null
          status: Database["public"]["Enums"]["reddit_interaction_status"]
          updated_at: string | null
          user_id: string
          website_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interacted_with_reddit_username: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          original_reddit_post_id: string
          our_interaction_content: string
          our_interaction_reddit_id?: string | null
          reddit_content_discovered_id?: string | null
          status?: Database["public"]["Enums"]["reddit_interaction_status"]
          updated_at?: string | null
          user_id: string
          website_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interacted_with_reddit_username?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          original_reddit_post_id?: string
          our_interaction_content?: string
          our_interaction_reddit_id?: string | null
          reddit_content_discovered_id?: string | null
          status?: Database["public"]["Enums"]["reddit_interaction_status"]
          updated_at?: string | null
          user_id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_user_interactions_reddit_content_discovered_id_fkey"
            columns: ["reddit_content_discovered_id"]
            isOneToOne: false
            referencedRelation: "reddit_content_discovered"
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
      scheduled_content: {
        Row: {
          created_at: string | null
          error_message: string | null
          failed_times: number | null
          id: string
          is_posted: boolean | null
          reddit_account_id: string
          scheduled_at: string
          source_user_interaction: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          failed_times?: number | null
          id?: string
          is_posted?: boolean | null
          reddit_account_id: string
          scheduled_at: string
          source_user_interaction: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          failed_times?: number | null
          id?: string
          is_posted?: boolean | null
          reddit_account_id?: string
          scheduled_at?: string
          source_user_interaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_content_reddit_account_id_fkey"
            columns: ["reddit_account_id"]
            isOneToOne: false
            referencedRelation: "reddit_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_content_source_user_interaction_fkey"
            columns: ["source_user_interaction"]
            isOneToOne: false
            referencedRelation: "reddit_user_interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["auth_user_id"]
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
          subscription_active: boolean | null
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
          subscription_active?: boolean | null
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
          subscription_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          keywords: string[] | null
          name: string
          subreddit_reddit_ids: string[] | null
          target_audience: string | null
          updated_at: string
          url: string
          user_id: string
          vector_ai_searcher: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          name: string
          subreddit_reddit_ids?: string[] | null
          target_audience?: string | null
          updated_at?: string
          url: string
          user_id: string
          vector_ai_searcher: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          name?: string
          subreddit_reddit_ids?: string[] | null
          target_audience?: string | null
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
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      find_relevant_reddit_content: {
        Args:
          | {
              p_acceptance_score?: number
              p_limit?: number
              p_website_id: string
            }
          | { p_acceptance_score?: number; p_website_id: string }
        Returns: {
          author: string
          content: string
          content_type: string
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
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      content_type: "post" | "comment"
      interaction_type: "comment_reply" | "post_reply" | "dm"
      reddit_interaction_status: "new" | "ignored" | "submitted" | "scheduled"
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
      content_type: ["post", "comment"],
      interaction_type: ["comment_reply", "post_reply", "dm"],
      reddit_interaction_status: ["new", "ignored", "submitted", "scheduled"],
    },
  },
} as const
