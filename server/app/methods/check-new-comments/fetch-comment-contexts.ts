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
