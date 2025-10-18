"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { COMMENT_POST_CATEGORY } from "@/defs/comments/comment-post-category";
import { cn } from "@/lib/utils";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { RedditUserInteraction } from "@/types/db-schema";
import {
  IconArrowDown,
  IconArrowUp,
  IconClock,
  IconExternalLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

interface InteractionDialogProps {
  interaction: RedditUserInteraction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export default function InteractionDialog({
  interaction,
  open,
  onOpenChange,
}: InteractionDialogProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  if (!interaction) {
    return null;
  }

  const isCommentReply = interaction.interaction_type === "comment_reply";
  const threadContext = interaction.thread_context as ThreadContext | null;

  // Common variables
  const avatarFallback = interaction.interacted_with_reddit_username
    .substring(0, 2)
    .toUpperCase();

  const externalLink =
    interaction.reddit_content_discovered?.reddit_url ||
    (interaction.original_reddit_parent_id
      ? `https://www.reddit.com/comments/${interaction.original_reddit_parent_id.replace(
          "t3_",
          ""
        )}`
      : undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            Interaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Header - User Info */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage
                    src=""
                    alt={
                      isCommentReply && threadContext
                        ? threadContext.original_post.author
                        : interaction.interacted_with_reddit_username
                    }
                  />
                  <AvatarFallback className="text-xs font-medium">
                    {isCommentReply && threadContext
                      ? threadContext.original_post.author
                          .substring(0, 2)
                          .toUpperCase()
                      : avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      u/
                      {isCommentReply && threadContext
                        ? threadContext.original_post.author
                        : interaction.interacted_with_reddit_username}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {
                      interaction.reddit_content_discovered?.subreddit
                        .display_name_prefixed
                    }
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Badge className="text-xs" variant="secondary">
                  {COMMENT_POST_CATEGORY[
                    interaction.reddit_content_discovered?.content_category ||
                      "other"
                  ] || "Other"}
                </Badge>
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

          {/* Post Title */}
          <h3 className="font-heading font-semibold text-base leading-tight">
            {isCommentReply && threadContext
              ? threadContext.original_post.title
              : interaction.reddit_content_discovered?.title}
          </h3>

          {/* Post Content */}
          {((!isCommentReply &&
            interaction.reddit_content_discovered?.content) ||
            (isCommentReply &&
              threadContext &&
              threadContext.original_post.content)) && (
            <div className="space-y-2">
              <MarkdownContent
                content={
                  showFullContent
                    ? isCommentReply && threadContext
                      ? threadContext.original_post.content
                      : interaction.reddit_content_discovered?.content || ""
                    : interaction.reddit_content_discovered
                        ?.summarized_content ||
                      (isCommentReply && threadContext
                        ? threadContext.original_post.content
                        : interaction.reddit_content_discovered?.content || "")
                }
                className={cn(isCommentReply && "text-muted-foreground")}
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

          {/* Stats */}
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

          {/* Thread Comments - Only for comment_reply type */}
          {isCommentReply &&
            threadContext &&
            threadContext.comments.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm">Comment Thread</h4>
                {threadContext.comments.map((comment) => (
                  <CommentThread key={comment.id} comment={comment} level={0} />
                ))}
              </div>
            )}

          {/* Your Reply */}
          {interaction.our_interaction_content && (
            <div className="pt-4 border-t space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                    ME
                  </AvatarFallback>
                </Avatar>
                Your Reply
              </h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <MarkdownContent
                  content={interaction.our_interaction_content}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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

  return (
    <div className={cn("space-y-3", indentLevel > 0 && "pl-6 border-l-2")}>
      <div className="flex gap-3">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src="" alt={comment.author} />
          <AvatarFallback
            className={cn(
              "text-xs",
              activeRedditAccount?.name == comment.author &&
                "font-medium bg-primary/10 text-primary"
            )}
          >
            {activeRedditAccount?.name == comment.author
              ? "ME"
              : comment.author.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">u/{comment.author}</span>
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
