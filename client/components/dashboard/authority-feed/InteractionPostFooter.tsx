"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { RedditUserInteraction } from "@/types/db-schema";
import { IconMessage, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface CommentSectionProps {
  interaction: RedditUserInteraction;
}

export function InteractionPostFooter({ interaction }: CommentSectionProps) {
  const [comment, setComment] = useState(
    interaction.our_interaction_content?.replace(/\\n/g, "\n") || ""
  );
  const [isPosting, setIsPosting] = useState(false);
  const { activeRedditAccount } = useRedditAccounts();
  const { redditUserInteractions, setRedditUserInteractions } =
    useRedditUserInteractions();

  const userAvatar =
    activeRedditAccount?.icon_img || activeRedditAccount?.snoovatar_img;
  const userFallback =
    activeRedditAccount?.name?.substring(0, 2).toUpperCase() || "ME";

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setIsPosting(true);
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
      return;
    }

    toast.success("Comment scheduled successfully", {
      description:
        "We will post it in a few minutes to follow a human like pattern",
    });

    // SUBMIT COMMENT
    setRedditUserInteractions(
      redditUserInteractions.map((item) =>
        item.id === interaction.id ? { ...item, status: "scheduled" } : item
      )
    );
  };

  const handleIgnore = async () => {
    setIsPosting(true);
    const response = await fetchIgnoreComment({
      interaction_id: interaction.id,
    });
    setIsPosting(false);

    if (response.error) {
      console.error("Error ignoring comment:", response.error);
      toast.error("Failed to ignore comment", {
        description: response.error,
      });
      return;
    }

    // IGNORE COMMENT
    setRedditUserInteractions(
      redditUserInteractions.filter((item) => item.id !== interaction.id)
    );
  };

  return (
    <div className="pt-3">
      <div className="flex gap-3 pl-8">
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
            placeholder={`Write a comment replying to u/${interaction.interacted_with_reddit_username}...`}
            className="min-h-24 resize-none"
            disabled={isPosting}
          />

          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center w-full gap-2">
              <Button
                onClick={handleIgnore}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isPosting}
              >
                <IconX className="size-4" />
                Not Interested
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

const fetchIgnoreComment = async ({
  interaction_id,
}: {
  interaction_id: string;
}) => {
  try {
    const response = await fetch("/api/reddit/comments/ignore-comments", {
      method: "POST",
      body: JSON.stringify({ interaction_ids: [interaction_id] }),
    });

    return response.json();
  } catch (error) {
    console.error("Error ignoring comment:", error);
    return {
      error: "Failed to ignore comment",
    };
  }
};
