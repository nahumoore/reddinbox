"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { COMMENT_POST_CATEGORY } from "@/defs/comments/comment-post-category";
import { cn } from "@/lib/utils";
import { RedditUserInteraction } from "@/types/db-schema";
import {
  IconArrowDown,
  IconArrowUp,
  IconClock,
  IconExternalLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { InteractionPostFooter } from "./InteractionPostFooter";

interface InteractionPostProps {
  interaction: RedditUserInteraction;
  className?: string;
}

export function InteractionPost({
  interaction,
  className,
}: InteractionPostProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const avatarFallback = interaction.interacted_with_reddit_username
    .substring(0, 2)
    .toUpperCase();

  // Trigger animation when status changes to scheduled (posted) or when being ignored
  useEffect(() => {
    if (interaction.status === "scheduled") {
      setIsRemoving(true);
    }
  }, [interaction.status]);

  return (
    <Card
      className={cn(
        "h-fit hover:shadow-md transition-all duration-500 flex flex-col gap-4",
        isRemoving && "opacity-0 scale-95 -translate-x-4",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage
                  src=""
                  alt={interaction.interacted_with_reddit_username}
                />
                <AvatarFallback className="text-xs font-medium">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    u/{interaction.interacted_with_reddit_username}
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
            {interaction.reddit_content_discovered?.reddit_url && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={interaction.reddit_content_discovered?.reddit_url}
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
          {interaction.reddit_content_discovered?.title}
        </h3>
        {interaction.reddit_content_discovered?.content && (
          <div className="space-y-2">
            <MarkdownContent
              content={
                showFullContent
                  ? interaction.reddit_content_discovered.content
                  : interaction.reddit_content_discovered.summarized_content ||
                    interaction.reddit_content_discovered.content
              }
            />
            {interaction.reddit_content_discovered.summarized_content && (
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

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <IconArrowUp className="size-6" />
            <span>{interaction.reddit_content_discovered?.ups || 0}</span>
          </div>
          {interaction.reddit_content_discovered?.downs !== null && (
            <div className="flex items-center gap-1">
              <IconArrowDown className="size-6" />
              <span>{interaction.reddit_content_discovered?.downs}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <IconClock className="size-3" />
            <span>
              {formatTimeAgo(
                interaction.reddit_content_discovered?.reddit_created_at || ""
              )}
            </span>
          </div>
        </div>

        <InteractionPostFooter
          interaction={interaction}
          onRemove={() => setIsRemoving(true)}
        />
      </CardContent>
    </Card>
  );
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
