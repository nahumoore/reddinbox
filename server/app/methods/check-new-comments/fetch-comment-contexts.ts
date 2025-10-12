import Bottleneck from "bottleneck";
import { InboxMessage } from "./fetch-inbox-comments";

export interface ContextResponse {
  kind: string;
  data: {
    children: Array<{
      kind: string;
      data: any;
    }>;
  };
}

export interface CommentWithContext {
  comment: InboxMessage;
  context: ContextResponse[];
}

interface FetchCommentContextsResult {
  success: boolean;
  data?: {
    validContexts: CommentWithContext[];
  };
}

export async function fetchCommentContexts(
  newComments: InboxMessage[],
  accessToken: string,
  redditAccountName: string,
  redditLimiter: Bottleneck
): Promise<FetchCommentContextsResult> {
  console.log("🔍 Fetching conversation contexts...");

  const contextTasks = newComments.map((comment) =>
    redditLimiter.schedule(async () => {
      try {
        const contextUrl = `https://oauth.reddit.com${comment.data.context}`;
        const contextResponse = await fetch(contextUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `Reddinbox/1.0 (by /u/${redditAccountName})`,
          },
        });

        if (!contextResponse.ok) {
          console.error(
            `❌ Failed to fetch context for comment ${comment.data.id}`
          );
          return null;
        }

        const contextData =
          (await contextResponse.json()) as ContextResponse[];

        // Validate that the last comment was within the last 2 days
        const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
        let lastCommentTimestamp: number | null = null;

        // Check all comments in the thread to find the most recent one
        for (const response of contextData) {
          if (response.data?.children) {
            for (const child of response.data.children) {
              if (child.data?.created_utc) {
                const timestamp = child.data.created_utc * 1000;
                if (!lastCommentTimestamp || timestamp > lastCommentTimestamp) {
                  lastCommentTimestamp = timestamp;
                }
              }
            }
          }
        }

        if (lastCommentTimestamp && lastCommentTimestamp < twoDaysAgo) {
          console.log(
            `⏰ Skipping comment ${comment.data.id} - last activity is older than 2 days`
          );
          return null;
        }

        return {
          comment,
          context: contextData,
        };
      } catch (error) {
        console.error(
          `❌ Error fetching context for comment ${comment.data.id}:`,
          error
        );
        return null;
      }
    })
  );

  const contextResults = await Promise.all(contextTasks);
  const validContexts = contextResults.filter(
    (r): r is CommentWithContext => r !== null
  );

  console.log(`✅ Successfully fetched ${validContexts.length} contexts`);

  return {
    success: true,
    data: {
      validContexts,
    },
  };
}
