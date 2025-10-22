"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RedditUserInteraction } from "@/types/db-schema";
import { getTemperatureConfig, LeadScore } from "@/utils/relationship-pipeline/lead-scoring";
import { IconChevronRight } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface UserRelationshipCardProps {
  username: string;
  interactions: RedditUserInteraction[];
  leadScore: LeadScore;
}

export function UserRelationshipCard({
  username,
  interactions,
  leadScore,
}: UserRelationshipCardProps) {
  // Calculate stats
  const totalInteractions = interactions.length;
  const latestInteraction = interactions.reduce((latest, current) =>
    new Date(current.created_at || 0) > new Date(latest.created_at || 0)
      ? current
      : latest
  );

  // Find first interaction date
  const firstInteraction = interactions.reduce((earliest, current) =>
    new Date(current.created_at || 0) < new Date(earliest.created_at || 0)
      ? current
      : earliest
  );

  // Find most frequent subreddit and count unique subreddits
  const subredditCounts = interactions.reduce((acc, interaction) => {
    const subreddit =
      interaction.reddit_content_discovered?.subreddit.display_name_prefixed ||
      "Unknown";
    acc[subreddit] = (acc[subreddit] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedSubreddits = Object.entries(subredditCounts).sort(
    (a, b) => b[1] - a[1]
  );
  const mostActiveSubreddit = sortedSubreddits[0]?.[0];
  const uniqueSubreddits = sortedSubreddits.length;

  // Calculate interaction type breakdown
  const interactionTypes = interactions.reduce((acc, interaction) => {
    acc[interaction.interaction_type] =
      (acc[interaction.interaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get avatar fallback
  const avatarFallback = username.substring(0, 2).toUpperCase();

  // Time since last interaction
  const timeSinceLastInteraction = latestInteraction.created_at
    ? formatDistanceToNow(new Date(latestInteraction.created_at), {
        addSuffix: true,
      })
    : "Unknown";

  // Time since first interaction (relationship duration)
  const relationshipDuration = firstInteraction.created_at
    ? formatDistanceToNow(new Date(firstInteraction.created_at), {
        addSuffix: false,
      })
    : "Unknown";

  // Get temperature configuration
  const tempConfig = getTemperatureConfig(leadScore.temperature);

  return (
    <Link href={`/dashboard/relationship-pipeline/${username}`}>
      <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            {/* Left: User Info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <Avatar className="size-12 shrink-0">
                <AvatarFallback className="text-sm font-semibold">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base truncate">
                    u/{username}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs shrink-0",
                      tempConfig.color,
                      tempConfig.bgColor,
                      tempConfig.borderColor
                    )}
                  >
                    <span className="mr-1">{tempConfig.emoji}</span>
                    {tempConfig.label}
                  </Badge>
                </div>

                {/* Primary Stats */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span>{totalInteractions} interactions</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    Last active {timeSinceLastInteraction}
                    {leadScore.daysSinceLastInteraction > 0 && (
                      <span className="text-muted-foreground/70">
                        {" "}
                        ({leadScore.daysSinceLastInteraction}d ago)
                      </span>
                    )}
                  </span>
                  {mostActiveSubreddit && (
                    <>
                      <span className="hidden md:inline">•</span>
                      <span className="hidden md:inline truncate">
                        Active in {mostActiveSubreddit}
                      </span>
                    </>
                  )}
                </div>

                {/* Secondary Stats - New Information */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                  {/* Relationship Duration */}
                  <span className="hidden sm:inline">
                    Connected {relationshipDuration}
                  </span>

                  {/* Multiple Subreddits Indicator */}
                  {uniqueSubreddits > 1 && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        {uniqueSubreddits} subreddits
                      </span>
                    </>
                  )}

                  {/* Interaction Type Breakdown */}
                  {interactionTypes.comment_reply && (
                    <>
                      <span className="hidden md:inline">•</span>
                      <span className="hidden md:inline">
                        {interactionTypes.comment_reply} comment
                        {interactionTypes.comment_reply > 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                  {interactionTypes.post_reply && (
                    <>
                      <span className="hidden lg:inline">•</span>
                      <span className="hidden lg:inline">
                        {interactionTypes.post_reply} post
                        {interactionTypes.post_reply > 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Action */}
            <div className="shrink-0">
              <div
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className:
                    "group-hover:bg-primary/10 group-hover:text-primary transition-colors",
                })}
              >
                <IconChevronRight className="size-5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
