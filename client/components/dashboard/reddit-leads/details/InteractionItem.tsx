import { Badge } from "@/components/ui/badge";
import { RedditUserInteraction } from "@/types/db-schema";
import {
  IconArrowUp,
  IconCalendar,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
  IconMessageCircle,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";

interface InteractionItemProps {
  interaction: RedditUserInteraction;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

export function InteractionItem({
  interaction,
  isExpanded,
  onToggle,
  isLast,
}: InteractionItemProps) {
  const post = interaction.reddit_content_discovered;
  const subreddit = post?.subreddit;

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-[15px] top-10 h-full w-0.5 bg-border" />
      )}

      <div className="flex gap-4">
        {/* Timeline dot */}
        <div className="relative z-10 mt-1.5 flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-background">
          <IconMessageCircle className="size-4 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <button
            onClick={onToggle}
            className="group flex w-full items-start justify-between gap-3 text-left"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">
                  {post?.title || "Interaction"}
                </h4>
                <StatusBadge status={interaction.status} />
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                {interaction.created_at && (
                  <div className="flex items-center gap-1">
                    <IconCalendar className="size-3" />
                    {format(
                      new Date(interaction.created_at),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </div>
                )}
                {subreddit && (
                  <div className="flex items-center gap-1">
                    <span>{subreddit.display_name_prefixed}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
              {isExpanded ? (
                <IconChevronUp className="size-5" />
              ) : (
                <IconChevronDown className="size-5" />
              )}
            </div>
          </button>

          {/* Expandable content */}
          {isExpanded && (
            <div className="space-y-3 pb-2">
              {/* Original post */}
              {post && (
                <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Original Post
                    </span>
                    {post.reddit_url && (
                      <a
                        href={post.reddit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View on Reddit
                        <IconExternalLink className="size-3" />
                      </a>
                    )}
                  </div>

                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {post.content}
                  </p>

                  {(post.ups !== null || post.downs !== null) && (
                    <div className="flex items-center gap-3 pt-1">
                      {post.ups !== null && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <IconArrowUp className="size-3" />
                          <span>{post.ups} upvotes</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Our response */}
              {interaction.our_interaction_content && (
                <div className="rounded-lg border bg-primary/5 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      Your Response
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {interaction.interaction_type}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {interaction.our_interaction_content}
                  </p>
                </div>
              )}

              {/* Error message if any */}
              {interaction.error_message && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3">
                  <span className="text-xs font-medium text-destructive uppercase tracking-wide block mb-1">
                    Error
                  </span>
                  <p className="text-sm text-destructive/90">
                    {interaction.error_message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
