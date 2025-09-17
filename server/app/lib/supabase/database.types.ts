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
          ai_explanation: string | null
          author: string
          comments_last_fetched_at: string | null
          content: string
          content_type: Database["public"]["Enums"]["content_type"] | null
          created_at: string | null
          downs: number | null
          id: string
          is_processed: boolean | null
          lead_score: number | null
          matched_keywords: string[]
          parent_post_id: string | null
          reddit_created_at: string
          reddit_id: string
          reddit_url: string | null
          reviewed_by_user: boolean | null
          subreddit: string
          title: string | null
          ups: number | null
          website_id: string | null
        }
        Insert: {
          ai_explanation?: string | null
          author: string
          comments_last_fetched_at?: string | null
          content: string
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          downs?: number | null
          id?: string
          is_processed?: boolean | null
          lead_score?: number | null
          matched_keywords: string[]
          parent_post_id?: string | null
          reddit_created_at: string
          reddit_id: string
          reddit_url?: string | null
          reviewed_by_user?: boolean | null
          subreddit: string
          title?: string | null
          ups?: number | null
          website_id?: string | null
        }
        Update: {
          ai_explanation?: string | null
          author?: string
          comments_last_fetched_at?: string | null
          content?: string
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string | null
          downs?: number | null
          id?: string
          is_processed?: boolean | null
          lead_score?: number | null
          matched_keywords?: string[]
          parent_post_id?: string | null
          reddit_created_at?: string
          reddit_id?: string
          reddit_url?: string | null
          reviewed_by_user?: boolean | null
          subreddit?: string
          title?: string | null
          ups?: number | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reddit_content_discovered_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_leads: {
        Row: {
          ai_explanation: string | null
          contacted_at: string | null
          content: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string | null
          downs: number | null
          id: string
          lead_score: number
          parent_post_id: string | null
          reddit_author: string
          reddit_created_at: string
          reddit_url: string | null
          status: Database["public"]["Enums"]["lead_status"]
          subreddit: string
          updated_at: string | null
          ups: number | null
          user_id: string
          website_id: string
        }
        Insert: {
          ai_explanation?: string | null
          contacted_at?: string | null
          content: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          downs?: number | null
          id?: string
          lead_score: number
          parent_post_id?: string | null
          reddit_author: string
          reddit_created_at: string
          reddit_url?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          subreddit: string
          updated_at?: string | null
          ups?: number | null
          user_id: string
          website_id: string
        }
        Update: {
          ai_explanation?: string | null
          contacted_at?: string | null
          content?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          downs?: number | null
          id?: string
          lead_score?: number
          parent_post_id?: string | null
          reddit_author?: string
          reddit_created_at?: string
          reddit_url?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          subreddit?: string
          updated_at?: string | null
          ups?: number | null
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
      user_info: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string | null
          id: string
          last_connected: string
          name: string | null
          onboarding_completed: boolean
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
          updated_at?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          competitors: string[] | null
          created_at: string
          description: string | null
          id: string
          ideal_customer_profile: string | null
          is_active: boolean
          keywords: string[] | null
          name: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          competitors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          ideal_customer_profile?: string | null
          is_active?: boolean
          keywords?: string[] | null
          name: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          competitors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          ideal_customer_profile?: string | null
          is_active?: boolean
          keywords?: string[] | null
          name?: string
          updated_at?: string
          url?: string
          user_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type: "post" | "comment"
      lead_status:
        | "new"
        | "contacted"
        | "converted"
        | "not_interested"
        | "saved"
        | "discarded"
      reddit_content_collection_reason: "keyword_match" | "high_engagement"
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
      lead_status: [
        "new",
        "contacted",
        "converted",
        "not_interested",
        "saved",
        "discarded",
      ],
      reddit_content_collection_reason: ["keyword_match", "high_engagement"],
    },
  },
} as const
