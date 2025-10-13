"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { Textarea } from "@/components/ui/textarea";
import { COMMENT_POST_CATEGORY } from "@/defs/comments/comment-post-category";
import { cn } from "@/lib/utils";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { RedditUserInteraction } from "@/types/db-schema";
import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconClock,
  IconExternalLink,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import LessThan30DaysAccountAgeDialog from "./LessThan30DaysAccountAgeDialog";

interface ThreadCommentsProps {
  interaction: RedditUserInteraction;
  className?: string;
}

interface ThreadComment {
  id: string;
  date: string;
  author: string;
  content: string;
  replies: ThreadComment[];
}

interface ThreadContext {
  original_post: {
    id: string;
    title: string;
    author: string;
    content: string;
  };
  comments: ThreadComment[];
}

export default function ThreadComments({
  interaction,
  className,
}: ThreadCommentsProps) {
  const { activeRedditAccount } = useRedditAccounts();
  const { redditUserInteractions, setRedditUserInteractions } =
    useRedditUserInteractions();
  const [isRemoving, setIsRemoving] = useState(false);
  const [comment, setComment] = useState(
    interaction.our_interaction_content || ""
  );
  const [isPosting, setIsPosting] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const threadContext = interaction.thread_context as ThreadContext | null;
  const externalLink =
    interaction.reddit_content_discovered?.reddit_url ||
    `https://www.reddit.com/comments/${interaction.original_reddit_parent_id.replace(
      "t3_",
      ""
    )}`;

  const isNewAccount = () => {
    if (!activeRedditAccount) return false;

    const accountAgeInDays = activeRedditAccount.created_utc
      ? (Date.now() - activeRedditAccount.created_utc * 1000) /
        (1000 * 60 * 60 * 24)
      : Infinity;

    const commentKarma = activeRedditAccount.comment_karma || 0;

    return accountAgeInDays < 30 && commentKarma < 50;
  };

  const proceedWithSubmit = async () => {
    if (!comment.trim()) return;

    setIsPosting(true);

    // Trigger animation
    setIsRemoving(true);

    // Wait for animation before updating state
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Optimistic update
    setRedditUserInteractions(
      redditUserInteractions.map((item) =>
        item.id === interaction.id ? { ...item, status: "scheduled" } : item
      )
    );

    const response = await fetchPostComment({
      comment,
      thing_id: interaction.reddit_content_discovered?.reddit_id!,
      interaction_id: interaction.id,
    });
    setIsPosting(false);

    if (response.error) {
      console.error("Error posting comment:", response.error);
      toast.error("Failed to post comment", {
        description: response.error,
      });
      // Revert optimistic update
      setRedditUserInteractions(
        redditUserInteractions.map((item) =>
          item.id === interaction.id ? { ...item, status: "new" } : item
        )
      );
      return;
    }

    toast.success("Comment scheduled successfully", {
      description:
        "We will post it in a few minutes to follow a human like pattern",
    });
  };

  const handleSubmit = () => {
    if (!comment.trim()) return;

    if (isNewAccount()) {
      setShowWarningDialog(true);
    } else {
      proceedWithSubmit();
    }
  };

  const handleSkip = async () => {
    // Trigger animation
    setIsRemoving(true);

    // Wait for animation before removing from list
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Optimistic update - remove after animation
    const previousInteractions = redditUserInteractions;
    setRedditUserInteractions(
      redditUserInteractions.filter((item) => item.id !== interaction.id)
    );

    const response = await fetchSkipComment({
      interaction_id: interaction.id,
    });

    if (response.error) {
      console.error("Error skipping comment:", response.error);
      toast.error("Failed to skip comment", {
        description: response.error,
      });
      // Revert optimistic update
      setRedditUserInteractions(previousInteractions);
      return;
    }
  };

  const handleMarkAsReplied = async () => {
    setIsPosting(true);

    // Trigger animation
    setIsRemoving(true);

    // Wait for animation before updating state
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Optimistic update
    setRedditUserInteractions(
      redditUserInteractions.map((item) =>
        item.id === interaction.id ? { ...item, status: "posted" } : item
      )
    );

    const response = await fetchMarkAsReplied({
      interaction_id: interaction.id,
    });
    setIsPosting(false);

    if (response.error) {
      console.error("Error marking as replied:", response.error);
      toast.error("Failed to mark as replied", {
        description: response.error,
      });
      // Revert optimistic update
      setRedditUserInteractions(
        redditUserInteractions.map((item) =>
          item.id === interaction.id ? { ...item, status: "new" } : item
        )
      );
      return;
    }
  };

  if (!threadContext) {
    return null;
  }

  const { original_post, comments } = threadContext;

  return (
    <>
      <LessThan30DaysAccountAgeDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        onProceed={proceedWithSubmit}
        postUrl={interaction.reddit_content_discovered?.reddit_url || undefined}
      />
      <Card
        className={cn(
          "h-fit hover:shadow-md transition-all duration-500",
          isRemoving && "opacity-0 scale-95 -translate-x-4",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src="" alt={original_post.author} />
                  <AvatarFallback className="text-xs font-medium">
                    {original_post.author.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      u/{original_post.author}
                    </span>
                  </div>
                  {interaction.reddit_content_discovered?.subreddit
                    .display_name_prefixed && (
                    <div className="text-xs text-muted-foreground">
                      {
                        interaction.reddit_content_discovered.subreddit
                          .display_name_prefixed
                      }
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {interaction.reddit_content_discovered?.content_category && (
                  <Badge className="text-xs" variant="secondary">
                    {COMMENT_POST_CATEGORY[
                      interaction.reddit_content_discovered.content_category ||
                        "other"
                    ] || "Other"}
                  </Badge>
                )}
                {interaction.similarity_score !== null &&
                  interaction.similarity_score !== undefined && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-semibold",
                        interaction.similarity_score >= 0.5
                          ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                          : interaction.similarity_score >= 0.45
                          ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
                          : "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700"
                      )}
                    >
                      {interaction.similarity_score >= 0.5
                        ? "Perfect Match"
                        : interaction.similarity_score >= 0.45
                        ? "Strong Match"
                        : "Relevant"}
                    </Badge>
                  )}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {externalLink && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on Reddit"
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                  >
                    <IconExternalLink />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <h3 className="font-heading font-semibold text-base leading-tight mb-3">
            {original_post.title}
          </h3>

          {original_post.content && (
            <div className="space-y-2">
              <MarkdownContent
                content={
                  showFullContent
                    ? original_post.content
                    : interaction.reddit_content_discovered
                        ?.summarized_content || original_post.content
                }
                className="text-muted-foreground"
              />
              {interaction.reddit_content_discovered?.summarized_content && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="text-sm text-primary transition-colors underline-offset-4 hover:underline cursor-pointer flex items-center gap-1"
                >
                  {showFullContent ? (
                    <>
                      <IconArrowUp className="size-4" />
                      Read summary
                    </>
                  ) : (
                    <>
                      <IconArrowDown className="size-4" />
                      Read full post
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {interaction.reddit_content_discovered && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <IconArrowUp className="size-6" />
                <span>{interaction.reddit_content_discovered.ups || 0}</span>
              </div>
              {interaction.reddit_content_discovered.downs !== null && (
                <div className="flex items-center gap-1">
                  <IconArrowDown className="size-6" />
                  <span>{interaction.reddit_content_discovered.downs}</span>
                </div>
              )}
              {interaction.reddit_content_discovered.reddit_created_at && (
                <div className="flex items-center gap-1">
                  <IconClock className="size-3" />
                  <span>
                    {formatTimeAgo(
                      interaction.reddit_content_discovered.reddit_created_at
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Thread Comments */}
          <div className="space-y-3 pt-4 border-t">
            {comments.map((comment) => (
              <CommentThread key={comment.id} comment={comment} level={0} />
            ))}
          </div>

          {/* Reply Section */}
          <div className="pt-3">
            <div className="flex gap-3">
              <Avatar className="size-8 mt-2 shrink-0">
                <AvatarImage src="" alt="You" />
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  ME
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div className="text-sm text-muted-foreground">
                  Replying as{" "}
                  <span className="font-medium text-primary">
                    u/{activeRedditAccount?.name || "user"}
                  </span>
                </div>

                <div className="relative flex items-stretch">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={`Write a comment replying to u/${interaction.interacted_with_reddit_username}...`}
                    className="min-h-24 resize-none rounded-r-none border-r-0 pr-2 border border-muted bg-white"
                    disabled={isPosting}
                  />
                  {/* <Button
                  variant="outline"
                  disabled={isPosting}
                  className="rounded-l-none border border-muted border-l-0 px-8 h-auto self-stretch bg-white"
                >
                  <IconSparkles className="size-5 text-primary fill-primary" />
                </Button> */}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex justify-between items-center w-full gap-2">
                    <Button
                      onClick={handleSkip}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={isPosting}
                    >
                      <IconX className="size-4" />
                      Pass
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleMarkAsReplied}
                        disabled={!comment.trim() || isPosting}
                        size="sm"
                        className="gap-1"
                      >
                        <IconCheck className="size-3" />
                        Mark as Replied
                      </Button>
                      {/* <Button
                        onClick={handleSubmit}
                        disabled={!comment.trim() || isPosting}
                        size="sm"
                        className="gap-1"
                      >
                        <IconMessage className="size-3" />
                        Approve Comment
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function CommentThread({
  comment,
  level,
}: {
  comment: ThreadComment;
  level: number;
}) {
  const { activeRedditAccount } = useRedditAccounts();
  const maxIndent = 4;
  const indentLevel = Math.min(level, maxIndent);

  const isYou = comment.author === activeRedditAccount?.name;

  return (
    <div className={cn("space-y-3", indentLevel > 0 && "pl-6 border-l-2")}>
      <div className="flex gap-3">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src="" alt={comment.author} />
          <AvatarFallback
            className={cn("text-xs", isYou && "bg-primary/10 text-primary")}
          >
            {isYou ? "ME" : comment.author.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn("font-medium text-sm", isYou && "text-primary")}
            >
              u/{comment.author}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <IconClock className="size-3" />
              <span>{formatDate(comment.date)}</span>
            </div>
          </div>

          <MarkdownContent content={comment.content} className="text-sm" />
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentThread key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString + "Z"); // Append 'Z' to treat as UTC
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

const fetchSkipComment = async ({
  interaction_id,
}: {
  interaction_id: string;
}) => {
  try {
    const response = await fetch("/api/reddit/comments/skip-comments", {
      method: "POST",
      body: JSON.stringify({ interaction_ids: [interaction_id] }),
    });

    return response.json();
  } catch (error) {
    console.error("Error skipping comment:", error);
    return {
      error: "Failed to skip comment",
    };
  }
};

const fetchPostComment = async ({
  comment,
  thing_id,
  interaction_id,
}: {
  comment: string;
  thing_id: string;
  interaction_id: string;
}) => {
  try {
    const response = await fetch("/api/reddit/comments/post-comment", {
      method: "POST",
      body: JSON.stringify({ text: comment, thing_id, interaction_id }),
    });

    return response.json();
  } catch (error) {
    console.error("Error posting comment:", error);
    return {
      error: "Failed to post comment",
    };
  }
};

const fetchGenerateComment = async ({
  interaction_id,
  user_name,
}: {
  interaction_id: string;
  user_name: string;
}) => {
  try {
    const response = await fetch("/api/ai/generate-comment", {
      method: "POST",
      body: JSON.stringify({
        interactionId: interaction_id,
        userName: user_name,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error generating comment:", error);
    return {
      error: "Failed to generate comment",
    };
  }
};

const fetchMarkAsReplied = async ({
  interaction_id,
}: {
  interaction_id: string;
}) => {
  try {
    const response = await fetch("/api/reddit/comments/mark-replied", {
      method: "POST",
      body: JSON.stringify({ interaction_id }),
    });

    return response.json();
  } catch (error) {
    console.error("Error marking as replied:", error);
    return {
      error: "Failed to mark as replied",
    };
  }
};
