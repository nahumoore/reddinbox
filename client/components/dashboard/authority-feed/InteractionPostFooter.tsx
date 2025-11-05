"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { RedditUserInteraction } from "@/types/db-schema";
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import LessThan30DaysAccountAgeDialog from "./LessThan30DaysAccountAgeDialog";
import { RegeneratePromptPopover } from "./RegeneratePromptPopover";

interface CommentSectionProps {
  interaction: RedditUserInteraction;
  onRemove?: () => void;
}

export function InteractionPostFooter({
  interaction,
  onRemove,
}: CommentSectionProps) {
  const { activeRedditAccount } = useRedditAccounts();
  const { redditUserInteractions, setRedditUserInteractions } =
    useRedditUserInteractions();

  const [comment, setComment] = useState(
    interaction.our_interaction_content?.replace(/\\n/g, "\n") || ""
  );
  const [isPosting, setIsPosting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isDisabled = isPosting || isRegenerating;
  const userAvatar =
    activeRedditAccount?.icon_img || activeRedditAccount?.snoovatar_img;

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
    onRemove?.();

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
    setIsPosting(true);

    // Trigger animation
    onRemove?.();

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
    setIsPosting(false);

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

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(comment);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleMarkAsReplied = async () => {
    setIsPosting(true);

    // Trigger animation
    onRemove?.();

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

  return (
    <>
      <div className="pt-3">
        <div className="flex gap-3 pl-8">
          <Avatar className="size-8 mt-2 shrink-0">
            <AvatarImage
              src={userAvatar || ""}
              alt={activeRedditAccount?.name || "User"}
            />
            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
              ME
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Replying as{" "}
                <span className="font-medium text-foreground">
                  u/{activeRedditAccount?.name || "user"}
                </span>
              </div>
              <Button size="icon" variant="ghost" onClick={handleCopy}>
                {isCopied ? <IconCheck /> : <IconCopy />}
              </Button>
            </div>

            <div className="relative flex items-stretch">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Write a comment replying to u/${interaction.interacted_with_reddit_username}...`}
                className="min-h-24 resize-none rounded-r-none border-r-0 pr-2 border border-muted bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-ring"
                disabled={isDisabled}
              />
              <RegeneratePromptPopover
                interaction={interaction}
                onCommentGenerated={setComment}
                onRegeneratingChange={setIsRegenerating}
                disabled={isDisabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex justify-between items-center w-full gap-2">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isDisabled}
                >
                  <IconX className="size-4" />
                  Skip
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={handleMarkAsReplied}
                    disabled={!comment.trim() || isDisabled}
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
                    Approve
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LessThan30DaysAccountAgeDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        onProceed={proceedWithSubmit}
        postUrl={interaction.reddit_content_discovered?.reddit_url || undefined}
      />
    </>
  );
}

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
