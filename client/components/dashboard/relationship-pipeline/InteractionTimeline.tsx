"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RedditUserInteraction } from "@/types/db-schema";
import {
  IconMessage,
  IconMessagePlus,
  IconSend,
} from "@tabler/icons-react";
import { format } from "date-fns";

interface InteractionTimelineProps {
  interactions: RedditUserInteraction[];
  maxItems?: number;
  onInteractionClick?: (interaction: RedditUserInteraction) => void;
}

function getInteractionIcon(type: string) {
  switch (type) {
    case "comment_reply":
      return IconMessage;
    case "post_reply":
      return IconMessagePlus;
    case "dm":
      return IconSend;
    default:
      return IconMessage;
  }
}

function getInteractionLabel(type: string) {
  switch (type) {
    case "comment_reply":
      return "Replied to comment";
    case "post_reply":
      return "Replied to post";
    case "dm":
      return "Sent DM";
    default:
      return "Interacted";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "posted":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700";
    case "new":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
    case "ignored":
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export function InteractionTimeline({
  interactions,
  maxItems = 3,
  onInteractionClick,
}: InteractionTimelineProps) {
  const sortedInteractions = [...interactions]
    .sort(
      (a, b) =>
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
    )
    .slice(0, maxItems);

  if (interactions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No interactions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedInteractions.map((interaction, index) => {
        const Icon = getInteractionIcon(interaction.interaction_type);
        const isLast = index === sortedInteractions.length - 1;

        return (
          <div key={interaction.id} className="flex gap-3">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                <Icon className="size-3.5" />
              </div>
              {!isLast && (
                <div className="w-px h-full bg-border flex-1 min-h-[24px]" />
              )}
            </div>

            {/* Content */}
            <button
              onClick={() => onInteractionClick?.(interaction)}
              className={cn(
                "flex-1 pb-2 space-y-1 text-left rounded-md p-2 -ml-2 transition-colors",
                onInteractionClick && "cursor-pointer hover:bg-muted/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">
                  {getInteractionLabel(interaction.interaction_type)}
                </p>
                <Badge
                  variant="outline"
                  className={cn("text-xs", getStatusColor(interaction.status))}
                >
                  {interaction.status}
                </Badge>
              </div>

              {/* Interaction details */}
              <p className="text-xs text-muted-foreground">
                in{" "}
                <span className="font-medium">
                  {
                    interaction.reddit_content_discovered?.subreddit
                      .display_name_prefixed
                  }
                </span>
              </p>

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground">
                {interaction.created_at
                  ? format(new Date(interaction.created_at), "MMM d, yyyy 'at' h:mm a")
                  : "Unknown date"}
              </p>

              {/* Preview of interaction content */}
              {interaction.our_interaction_content && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 italic">
                  &quot;
                  {interaction.our_interaction_content.substring(0, 100)}
                  {interaction.our_interaction_content.length > 100 && "..."}
                  &quot;
                </p>
              )}
            </button>
          </div>
        );
      })}

      {interactions.length > maxItems && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          +{interactions.length - maxItems} more interaction
          {interactions.length - maxItems !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
