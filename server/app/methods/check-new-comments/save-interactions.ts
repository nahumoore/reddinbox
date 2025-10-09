import { SupabaseClient } from "@supabase/supabase-js";
import { AIReplyResult } from "./generate-ai-replies";
import { CommentWithContext } from "./fetch-comment-contexts";
import { buildThreadContext } from "./build-thread-context";

interface SaveInteractionsInput {
  validResults: AIReplyResult[];
  validContexts: CommentWithContext[];
  userId: string;
  websiteId: string;
  redditAccountId: string;
  supabase: SupabaseClient;
}

interface SaveInteractionsResult {
  success: boolean;
  data?: {
    newInteractions: any[];
  };
  error?: string;
}

export async function saveInteractions({
  validResults,
  validContexts,
  userId,
  websiteId,
  redditAccountId,
  supabase,
}: SaveInteractionsInput): Promise<SaveInteractionsResult> {
  // QUERY FOR reddit_content_discovered ROWS
  const postIds = validResults.map((result) => result.originalPost.name);

  console.log(
    `🔎 Querying discovered content for ${postIds.length} post IDs:`,
    postIds
  );

  const { data: discoveredContent, error: discoveredContentError } =
    await supabase
      .from("reddit_content_discovered")
      .select("id, reddit_id")
      .in("reddit_id", postIds);

  if (discoveredContentError) {
    console.error(
      "❌ Error fetching discovered content:",
      discoveredContentError
    );
  }

  // CREATE A MAP OF POST ID TO DISCOVERED CONTENT ID
  const discoveredContentMap = new Map(
    (discoveredContent || []).map((item) => [item.reddit_id, item.id])
  );

  console.log(
    `📋 Found ${discoveredContent?.length || 0} discovered content entries`
  );
  if (discoveredContent && discoveredContent.length > 0) {
    console.log(
      `✅ Discovered content map:`,
      Array.from(discoveredContentMap.entries())
    );
  }

  // BUILD THREAD CONTEXT AND INSERT INTERACTIONS
  const interactionsToInsert = validResults.map((result) => {
    // FETCH CONTEXT DATA FROM AI RESULTS TO BUILD THREAD CONTEXT
    const contextItem = validContexts.find(
      (ctx) => ctx.comment.data.id === result.comment.data.id
    );

    let threadContext = null;
    if (contextItem) {
      const threadListing = contextItem.context[1];
      const threadComments = threadListing?.data?.children || [];
      threadContext = buildThreadContext(result.originalPost, threadComments);
    }

    // GET DISCOVERED CONTENT ID FROM MAP IF IT EXISTS
    const discoveredContentId =
      discoveredContentMap.get(result.originalPost.name) || null;

    return {
      user_id: userId,
      website_id: websiteId,
      interaction_type: "comment_reply",
      original_reddit_parent_id: result.originalPost.name, // t3_xxxxx format
      interacted_with_reddit_username: result.comment.data.author,
      our_interaction_content: result.processedReply,
      our_interaction_reddit_id: null,
      reddit_content_discovered_id: discoveredContentId,
      reddit_account_id: redditAccountId,
      status: "new",
      thread_context: threadContext,
      discovered_reddit_id: `t1_${result.comment.data.id}`, // t1_xxxxx format
    };
  });

  const { data: newInteractions, error: insertError } = await supabase
    .from("reddit_user_interactions")
    .insert(interactionsToInsert)
    .select();

  if (insertError) {
    console.error(`❌ Error inserting interactions:`, insertError);
    return {
      success: false,
      error: "Failed to save interactions",
    };
  }

  console.log(
    `🎉 Successfully created ${newInteractions?.length || 0} new interactions`
  );

  return {
    success: true,
    data: {
      newInteractions: newInteractions || [],
    },
  };
}
