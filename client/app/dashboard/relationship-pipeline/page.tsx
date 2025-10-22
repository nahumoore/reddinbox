"use client";

import { PipelineStats } from "@/components/dashboard/relationship-pipeline/PipelineStats";
import { UserRelationshipCard } from "@/components/dashboard/relationship-pipeline/UserRelationshipCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RedditUserInteraction } from "@/types/db-schema";
import { calculateLeadScore, LeadScore } from "@/utils/relationship-pipeline/lead-scoring";
import { IconHeartHandshake, IconSearch, IconUsers } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

interface UserGroup {
  username: string;
  interactions: RedditUserInteraction[];
  leadScore: LeadScore;
}

export default function RelationshipPipelinePage() {
  const [redditUserInteractions, setRedditUserInteractions] = useState<
    RedditUserInteraction[]
  >([]);
  const [isLoadingRedditUserInteractions, setIsLoadingRedditUserInteractions] =
    useState(true);

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("lead_score");
  const [engagementFilter, setEngagementFilter] = useState("all");

  // Fetch interactions from API
  useEffect(() => {
    const fetchInteractions = async () => {
      setIsLoadingRedditUserInteractions(true);
      try {
        const response = await fetch(
          "/api/relationship-pipeline/fetch-interactions",
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch interactions");
        }

        const data = await response.json();
        setRedditUserInteractions(data.interactions || []);
      } catch (error) {
        console.error("Error fetching interactions:", error);
      } finally {
        setIsLoadingRedditUserInteractions(false);
      }
    };

    fetchInteractions();
  }, []);

  // Group interactions by user and calculate lead scores
  const processedUsers = useMemo(() => {
    if (!redditUserInteractions || redditUserInteractions.length === 0) return [];

    // Group by username
    const groupedByUser = redditUserInteractions.reduce((acc, interaction) => {
      const username = interaction.interacted_with_reddit_username;
      if (!acc[username]) {
        acc[username] = [];
      }
      acc[username].push(interaction);
      return acc;
    }, {} as Record<string, RedditUserInteraction[]>);

    // Convert to array with lead scores, filtering out users with less than 2 interactions
    let userGroups: UserGroup[] = Object.entries(groupedByUser)
      .filter(([, interactions]) => interactions.length >= 2) // Minimum 2 interactions
      .map(([username, interactions]) => ({
        username,
        interactions,
        leadScore: calculateLeadScore(interactions),
      }));

    // Apply search filter
    if (searchQuery.trim()) {
      userGroups = userGroups.filter((group) =>
        group.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply engagement filter
    if (engagementFilter !== "all") {
      userGroups = userGroups.filter((group) => {
        const count = group.interactions.length;
        const { temperature } = group.leadScore;

        if (engagementFilter === "high_value") return count >= 5;
        if (engagementFilter === "growing") return count >= 2 && count <= 4;
        if (engagementFilter === "hot")
          return temperature === "hot" || temperature === "warm";
        if (engagementFilter === "needs_attention")
          return temperature === "cooling" || temperature === "cold" || temperature === "dormant";

        return true;
      });
    }

    // Apply sorting
    userGroups.sort((a, b) => {
      if (sortBy === "lead_score") {
        return b.leadScore.compositeScore - a.leadScore.compositeScore;
      } else if (sortBy === "recent") {
        const aLatest = Math.max(
          ...a.interactions.map((i) => new Date(i.created_at || 0).getTime())
        );
        const bLatest = Math.max(
          ...b.interactions.map((i) => new Date(i.created_at || 0).getTime())
        );
        return bLatest - aLatest;
      } else if (sortBy === "interactions") {
        return b.interactions.length - a.interactions.length;
      } else if (sortBy === "username") {
        return a.username.localeCompare(b.username);
      }
      return 0;
    });

    return userGroups;
  }, [redditUserInteractions, searchQuery, engagementFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="py-3">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2 bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-sm">
            <IconHeartHandshake className="size-6 md:size-7" />
            Relationship Pipeline
          </h1>
        </div>
        <p className="text-muted-foreground font-medium">
          Track and nurture relationships with users you&apos;ve engaged on
          Reddit
        </p>
      </div>

      {/* Stats Overview */}
      <PipelineStats
        interactions={redditUserInteractions}
        isLoading={isLoadingRedditUserInteractions}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Engagement Filter */}
        <Select value={engagementFilter} onValueChange={setEngagementFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white">
            <SelectValue placeholder="Engagement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            <SelectItem value="high_value">High Value (5+)</SelectItem>
            <SelectItem value="growing">Growing (2-4)</SelectItem>
            <SelectItem value="hot">Hot Leads (0-7 days)</SelectItem>
            <SelectItem value="needs_attention">Needs Attention (8+ days)</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lead_score">Lead Score</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="interactions">Most Interactions</SelectItem>
            <SelectItem value="username">Username A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Cards List */}
      {isLoadingRedditUserInteractions ? (
        <div className="text-center py-12">
          <div className="inline-block size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground mt-4">Loading leads...</p>
        </div>
      ) : processedUsers.length > 0 ? (
        <div className="flex flex-col gap-4">
          {processedUsers.map((userGroup) => (
            <UserRelationshipCard
              key={userGroup.username}
              username={userGroup.username}
              interactions={userGroup.interactions}
              leadScore={userGroup.leadScore}
            />
          ))}
        </div>
      ) : (
        // Empty state
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="p-4 rounded-full bg-muted mb-4">
            <IconUsers className="size-12 text-muted-foreground" />
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2">
            No qualified leads yet
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            Build relationships by engaging through the Authority Feed. Leads
            appear here after 2+ meaningful interactions with the same user.
          </p>
        </div>
      )}
    </div>
  );
}
