export interface RedditMessage {
  id: string;
  author: string;
  body: string;
  subject: string;
  createdAt: string; // ISO string
  isFromUser: boolean;
}

export interface RedditConversation {
  id: string; // conversation identifier (first_message or root message id)
  subject: string;
  latestMessageAt: string; // ISO string
  messages: RedditMessage[];
  totalMessages: number;
}

// Raw Reddit API response types
export interface RedditRawMessage {
  kind: string;
  data: {
    id: string;
    author: string;
    body: string;
    subject: string;
    created_utc: number;
    dest: string;
    first_message?: number | null;
    parent_id?: string | null;
    name: string;
  };
}

export interface RedditRawResponse {
  kind: string;
  data: {
    children: RedditRawMessage[];
  };
}

export interface RedditUserProfile {
  name: string;
  icon_img: string;
  total_karma: number;
  created_utc: number;
  verified: boolean;
  has_verified_email: boolean;
  public_description: string;
}

export interface SubredditData {
  id: string;
  display_name_prefixed: string;
  title: string;
  primary_color: string;
  subscribers: number;
  public_description: string;
  community_icon: string;
  banner_background_image: string;
  description: string;
  lang: string;
}
