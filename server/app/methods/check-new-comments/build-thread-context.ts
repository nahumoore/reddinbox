export function buildThreadContext(
  originalPost: any,
  threadComments: any[],
  userFullName?: string
): any {
  const comments = buildRepliesTree(threadComments, userFullName).filter(
    (c) => c !== null
  );

  return {
    original_post: {
      id: originalPost.name,
      author:
        originalPost.author_fullname === userFullName
          ? "YOU"
          : originalPost.author,
      title: originalPost.title || "",
      content: originalPost.selftext || "",
    },
    comments,
  };
}

const buildRepliesTree = (comments: any[], userFullName?: string): any[] => {
  return comments.map((commentNode) => {
    if (commentNode.kind !== "t1") return null;

    const commentData = commentNode.data;

    const comment: any = {
      id: commentData.name,
      author:
        commentData.author_fullname === userFullName
          ? "YOU"
          : commentData.author,
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
        commentData.replies.data.children,
        userFullName
      );
      comment.replies = nestedReplies.filter((r) => r !== null);
    }

    return comment;
  });
};
