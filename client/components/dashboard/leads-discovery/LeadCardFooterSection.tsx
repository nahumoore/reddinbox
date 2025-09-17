"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { RedditLead } from "@/types/db-schema";
import { IconMessage, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface CommentSectionProps {
  lead: RedditLead;
}

export function LeadCardFooterSection({ lead }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { activeRedditAccount } = useRedditAccounts();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setComment("");
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setIsPosting(true);
    const response = await fetchPostComment({
      comment,
      thing_id: lead.id,
    });
    setIsPosting(false);

    if (response.error) {
      console.error("Error posting comment:", response.error);
      toast.error("Failed to post comment", {
        description: response.error,
      });
      return;
    }

    toast.success("Comment posted successfully", {
      description: "This user has been saved to your leads list",
    });

    // Reset after posting
    setComment("");
  };

  const handleCancel = () => {
    setComment("");
    setIsExpanded(false);
  };

  const userAvatar =
    activeRedditAccount?.icon_img || activeRedditAccount?.snoovatar_img;
  const userFallback =
    activeRedditAccount?.name?.substring(0, 2).toUpperCase() || "ME";

  if (!isExpanded) {
    return (
      <div className="border-t border-border/50 pt-3 flex items-center gap-6">
        <Button
          onClick={handleToggle}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <IconMessage className="size-4" />
          Reply to u/{lead.reddit_author}
        </Button>
        <Button
          onClick={handleToggle}
          variant="destructive"
          size="sm"
          className="gap-2"
        >
          <IconX className="size-4" />
          Not Interested
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t border-border/50 pt-3">
      <div className="flex gap-3 pl-8 border-l-2 border-muted">
        <Avatar className="size-8 mt-2 shrink-0">
          <AvatarImage
            src={userAvatar || ""}
            alt={activeRedditAccount?.name || "User"}
          />
          <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
            {userFallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="text-sm text-muted-foreground">
            Replying as{" "}
            <span className="font-medium text-foreground">
              u/{activeRedditAccount?.name || "user"}
            </span>
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Write a comment replying to u/${lead.reddit_author}...`}
            className="min-h-24 resize-none"
            autoFocus
            disabled={isPosting}
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {comment.length > 0 && `${comment.length} characters`}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="gap-1"
                disabled={isPosting}
              >
                <IconX className="size-3" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!comment.trim() || isPosting}
                size="sm"
                className="gap-1"
              >
                <IconMessage className="size-3" />
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const fetchPostComment = async ({
  comment,
  thing_id,
}: {
  comment: string;
  thing_id: string;
}) => {
  try {
    const response = await fetch("/api/reddit/comments/post-comment", {
      method: "POST",
      body: JSON.stringify({ text: comment, thing_id }),
    });

    return response.json();
  } catch (error) {
    console.error("Error posting comment:", error);
    return {
      error: "Failed to post comment",
    };
  }
};
