"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { RedditUserInteraction } from "@/types/db-schema";
import { IconClock, IconMessage, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

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
  const threadContext = interaction.thread_context as ThreadContext | null;

  const handleSubmit = async () => {
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

  if (!threadContext) {
    return null;
  }

  const { original_post, comments } = threadContext;

  return (
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
                <span className="font-medium text-sm">
                  u/{original_post.author}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <h3 className="font-heading font-semibold text-base leading-tight mb-3">
          {original_post.title}
        </h3>

        {original_post.content && (
          <MarkdownContent
            content={original_post.content}
            className="text-muted-foreground"
          />
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
                  <Button
                    onClick={handleSubmit}
                    disabled={!comment.trim() || isPosting}
                    size="sm"
                    className="gap-1"
                  >
                    <IconMessage className="size-3" />
                    Approve Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
