export function buildThreadContext(
  originalPost: any,
  threadComments: any[]
): any {
  const buildRepliesTree = (comments: any[]): any[] => {
    return comments.map((commentNode) => {
      if (commentNode.kind !== "t1") return null;

      const commentData = commentNode.data;
      const comment: any = {
        id: commentData.name,
        author: commentData.author,
        content: commentData.body,
        date: new Date(commentData.created_utc * 1000)
          .toISOString()
          .split("T")[0],
        replies: [],
      };

      // RECURSIVELY PROCESS REPLIES
      if (
        commentData.replies &&
        typeof commentData.replies === "object" &&
        commentData.replies.data?.children
      ) {
        const nestedReplies = buildRepliesTree(
          commentData.replies.data.children
        );
        comment.replies = nestedReplies.filter((r) => r !== null);
      }

      return comment;
    });
  };

  const comments = buildRepliesTree(threadComments).filter(
    (c) => c !== null
  );

  return {
    original_post: {
      id: originalPost.name,
      author: originalPost.author,
      title: originalPost.title || "",
      content: originalPost.selftext || "",
    },
    comments,
  };
}
