"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { RedditUserInteraction } from "@/types/db-schema";
import {
  IconChartLine,
  IconMessages,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import { useMemo } from "react";

interface Stats {
  totalUsers: number;
  totalInteractions: number;
  totalSubreddits: number;
  avgSimilarityScore: string;
}

interface PipelineStatsProps {
  interactions?: RedditUserInteraction[];
  stats?: Stats;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description?: string;
}

function StatCard({ icon: Icon, label, value, description }: StatCardProps) {
  const { isLoadingRedditUserInteractions } = useRedditUserInteractions();

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className="text-2xl font-bold font-heading">
                <>
                  {isLoadingRedditUserInteractions ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    value
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function PipelineStats({
  interactions,
  stats: providedStats,
}: PipelineStatsProps) {
  const calculatedStats = useMemo(() => {
    if (providedStats) {
      return providedStats;
    }

    if (!interactions) {
      return {
        totalUsers: 0,
        totalInteractions: 0,
        totalSubreddits: 0,
        avgSimilarityScore: "N/A",
      };
    }

    // Filter only 'posted' interactions (exclude ignored, new, scheduled)
    const postedInteractions = interactions.filter(
      (i) => i.status === "posted"
    );

    // Get unique users from posted interactions
    const uniqueUsers = new Set(
      postedInteractions.map((i) => i.interacted_with_reddit_username)
    );

    // Calculate average similarity score from posted interactions
    const scoresWithValue = postedInteractions.filter(
      (i) => i.similarity_score !== null && i.similarity_score !== undefined
    );
    const avgScore =
      scoresWithValue.length > 0
        ? (
            scoresWithValue.reduce(
              (sum, i) => sum + (i.similarity_score || 0),
              0
            ) / scoresWithValue.length
          ).toFixed(2)
        : "N/A";

    // Count subreddits from posted interactions
    const uniqueSubreddits = new Set(
      postedInteractions
        .map((i) => i.reddit_content_discovered?.subreddit.id)
        .filter(Boolean)
    );

    return {
      totalUsers: uniqueUsers.size,
      totalInteractions: postedInteractions.length,
      totalSubreddits: uniqueSubreddits.size,
      avgSimilarityScore: avgScore,
    };
  }, [interactions, providedStats]);

  const stats = calculatedStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        icon={IconUsers}
        label="Total Leads"
        value={stats.totalUsers}
        description="Users you've engaged with"
      />
      <StatCard
        icon={IconMessages}
        label="Total Interactions"
        value={stats.totalInteractions}
        description="Posted interactions"
      />
      <StatCard
        icon={IconUserCheck}
        label="Subreddits"
        value={stats.totalSubreddits}
        description="Communities engaged in"
      />
      <StatCard
        icon={IconChartLine}
        label="Avg Match Score"
        value={stats.avgSimilarityScore}
        description="Average relevance"
      />
    </div>
  );
}
