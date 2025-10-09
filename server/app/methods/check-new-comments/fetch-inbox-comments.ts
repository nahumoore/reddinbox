export interface InboxMessage {
  kind: string;
  data: {
    id: string;
    subject: string;
    author: string;
    body: string;
    parent_id: string;
    context: string;
    link_title: string;
    subreddit: string;
    new: boolean;
  };
}

interface FetchInboxCommentsResult {
  success: boolean;
  data?: {
    commentReplies: InboxMessage[];
  };
  error?: string;
  status?: number;
}

export async function fetchInboxComments(
  accessToken: string,
  redditAccountName: string
): Promise<FetchInboxCommentsResult> {
  console.log("📬 Fetching inbox messages...");

  const inboxResponse = await fetch(
    "https://oauth.reddit.com/message/inbox?limit=25",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": `Reddinbox/1.0 (by /u/${redditAccountName})`,
      },
    }
  );

  if (!inboxResponse.ok) {
    return {
      success: false,
      error: "Failed to fetch inbox",
      status: inboxResponse.status,
    };
  }

  const inboxData = (await inboxResponse.json()) as {
    kind: string;
    data: { children: InboxMessage[] };
  };
  const messages: InboxMessage[] = inboxData.data?.children || [];

  // FILTER BY COMMENT REPLY
  const commentReplies = messages.filter(
    (msg) => msg.data.subject === "comment reply"
  );

  console.log(`💬 Found ${commentReplies.length} comment replies`);

  return {
    success: true,
    data: {
      commentReplies,
    },
  };
}
