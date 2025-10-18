"use client";

import { InteractionTimeline } from "@/components/dashboard/relationship-pipeline/InteractionTimeline";
import InteractionDialog from "@/components/dashboard/relationship-pipeline/username/InteractionDialog";
import { getLeadTemperature } from "@/components/dashboard/relationship-pipeline/UserRelationshipCard";
import { IconBrandRedditNew } from "@/components/icons/BrandRedditNew";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { RedditUserInteraction } from "@/types/db-schema";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconHeart,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { use, useMemo, useState } from "react";

export default function RelationshipPipelineUserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { redditUserInteractions, isLoadingRedditUserInteractions } =
    useRedditUserInteractions();

  // Dialog state
  const [selectedInteraction, setSelectedInteraction] =
    useState<RedditUserInteraction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInteractionClick = (interaction: RedditUserInteraction) => {
    setSelectedInteraction(interaction);
    setIsDialogOpen(true);
  };

  // Filter interactions for this specific user (only posted status)
  const userInteractions = useMemo(() => {
    return redditUserInteractions.filter(
      (interaction) =>
        interaction.interacted_with_reddit_username === username &&
        interaction.status === "posted"
    );
  }, [redditUserInteractions, username]);

  // Calculate stats
  const stats = useMemo(() => {
    if (userInteractions.length === 0) {
      return null;
    }

    const totalInteractions = userInteractions.length;

    // Latest interaction
    const latestInteraction = userInteractions.reduce((latest, current) =>
      new Date(current.created_at || 0) > new Date(latest.created_at || 0)
        ? current
        : latest
    );

    // First interaction
    const firstInteraction = userInteractions.reduce((earliest, current) =>
      new Date(current.created_at || 0) < new Date(earliest.created_at || 0)
        ? current
        : earliest
    );

    // Subreddit breakdown
    const subredditCounts = userInteractions.reduce((acc, interaction) => {
      const subreddit =
        interaction.reddit_content_discovered?.subreddit
          .display_name_prefixed || "Unknown";
      acc[subreddit] = (acc[subreddit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedSubreddits = Object.entries(subredditCounts).sort(
      (a, b) => b[1] - a[1]
    );
    const mostActiveSubreddit = sortedSubreddits[0]?.[0];
    const uniqueSubreddits = sortedSubreddits.length;

    // Interaction type breakdown
    const interactionTypes = userInteractions.reduce((acc, interaction) => {
      acc[interaction.interaction_type] =
        (acc[interaction.interaction_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInteractions,
      latestInteraction,
      firstInteraction,
      subredditCounts: sortedSubreddits,
      mostActiveSubreddit,
      uniqueSubreddits,
      interactionTypes,
    };
  }, [userInteractions]);

  // Loading state
  if (isLoadingRedditUserInteractions) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="text-center py-12">
          <div className="inline-block size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground mt-4">Loading user details...</p>
        </div>
      </div>
    );
  }

  // Empty state - no interactions found
  if (!stats || userInteractions.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Back navigation */}
        <Link href="/dashboard/relationship-pipeline">
          <Button variant="ghost" className="gap-2 -ml-2">
            <IconArrowLeft className="size-4" />
            Back to Pipeline
          </Button>
        </Link>

        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="p-4 rounded-full bg-muted mb-4">
            <IconUsers className="size-12 text-muted-foreground" />
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2">
            No interactions found
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            No posted interactions found for u/{username}. They may have been
            filtered out or deleted.
          </p>
        </div>
      </div>
    );
  }

  const avatarFallback = username.substring(0, 2).toUpperCase();
  const leadTemp = getLeadTemperature(stats.totalInteractions);

  // Time calculations
  const timeSinceLastInteraction = stats.latestInteraction.created_at
    ? formatDistanceToNow(new Date(stats.latestInteraction.created_at), {
        addSuffix: true,
      })
    : "Unknown";

  const relationshipDuration = stats.firstInteraction.created_at
    ? formatDistanceToNow(new Date(stats.firstInteraction.created_at), {
        addSuffix: false,
      })
    : "Unknown";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Back navigation */}
      <Link href="/dashboard/relationship-pipeline">
        <Button variant="ghost" className="gap-2 -ml-2 min-h-[44px]">
          <IconArrowLeft className="size-4" />
          Back to Pipeline
        </Button>
      </Link>

      {/* User Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <Avatar className="size-16 md:size-20 shrink-0">
            <AvatarFallback className="text-xl font-bold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h1 className="font-heading text-2xl md:text-3xl font-bold">
                u/{username}
              </h1>
              <Badge
                variant="outline"
                className={cn("text-sm w-fit", leadTemp.className)}
              >
                {leadTemp.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {stats.totalInteractions} interaction
              {stats.totalInteractions !== 1 ? "s" : ""} across{" "}
              {stats.uniqueSubreddits} subreddit
              {stats.uniqueSubreddits !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Link
              href={`https://reddit.com/user/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial"
            >
              <Button className="gap-2 w-full min-h-[44px]">
                <IconBrandRedditNew className="size-4" />
                View on Reddit
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Interactions */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <IconMessageCircle className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {stats.totalInteractions}
              </p>
              <p className="text-xs text-muted-foreground">
                Total Interactions
              </p>
            </div>
          </div>
        </Card>

        {/* First Contact */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <IconCalendar className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {stats.firstInteraction.created_at
                  ? format(
                      new Date(stats.firstInteraction.created_at),
                      "MMM d, yyyy"
                    )
                  : "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground">First Contact</p>
            </div>
          </div>
        </Card>

        {/* Last Active */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <IconClock className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {timeSinceLastInteraction}
              </p>
              <p className="text-xs text-muted-foreground">Last Active</p>
            </div>
          </div>
        </Card>

        {/* Relationship Duration */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <IconHeart className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {relationshipDuration}
              </p>
              <p className="text-xs text-muted-foreground">Connected For</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Interaction History */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconMessageCircle className="size-5 text-primary" />
          <h2 className="font-heading text-xl font-semibold">
            Interaction History
          </h2>
        </div>

        <InteractionTimeline
          interactions={userInteractions}
          maxItems={userInteractions.length}
          onInteractionClick={handleInteractionClick}
        />
      </Card>

      {/* Interaction Dialog */}
      <InteractionDialog
        interaction={selectedInteraction}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
