"use client";

import { LeadTable } from "@/components/dashboard/reddit-leads/LeadTable";
import { LeadTableSkeleton } from "@/components/dashboard/reddit-leads/LeadTableSkeleton";
import { StatsOverview } from "@/components/dashboard/reddit-leads/StatsOverview";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRedditLeads } from "@/stores/reddit-leads";
import { RedditLeads } from "@/types/db-schema";
import {
  IconAlertCircle,
  IconHeartHandshake,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

export default function RedditLeadsClient({
  serverLeads,
}: {
  serverLeads: Partial<RedditLeads>[];
}) {
  const { leads, isLoadingRedditLeads, setLeads, setIsLoadingRedditLeads } =
    useRedditLeads();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");

  useEffect(() => {
    setLeads(serverLeads);
    setIsLoadingRedditLeads(false);
  }, [serverLeads]);

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter
      if (
        searchQuery &&
        !lead.reddit_username?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && lead.lead_status !== statusFilter) {
        return false;
      }

      // Score filter
      if (scoreFilter !== "all") {
        const score = lead.lead_score || 0;
        if (scoreFilter === "hot" && score < 80) return false;
        if (scoreFilter === "warm" && (score < 60 || score >= 80)) return false;
        if (scoreFilter === "cold" && score >= 60) return false;
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, scoreFilter]);

  // Calculate stats (use filtered leads for display)
  const totalLeads = filteredLeads.length;
  const hotLeads = filteredLeads.filter(
    (lead) => lead.lead_score! >= 80
  ).length;
  const contactedLeads = filteredLeads.filter(
    (lead) =>
      lead.lead_status === "contacted" || lead.lead_status === "responded"
  ).length;
  const convertedLeads = filteredLeads.filter(
    (lead) => lead.lead_status === "converted"
  ).length;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="py-3">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2 bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-sm">
            <IconHeartHandshake className="size-6 md:size-7" />
            Reddit Leads
          </h1>
        </div>
        <p className="text-muted-foreground font-medium">
          Track every Reddit lead you interacted with and nurture them to
          convert them into customers
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview
        isLoading={isLoadingRedditLeads}
        totalLeads={totalLeads}
        hotLeads={hotLeads}
        contactedLeads={contactedLeads}
        convertedLeads={convertedLeads}
      />

      {/* Leads List */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold mb-4">
          Your Leads
          {(searchQuery || statusFilter !== "all" || scoreFilter !== "all") && (
            <span className="text-muted-foreground font-normal text-base ml-2">
              ({totalLeads} {totalLeads === 1 ? "result" : "results"})
            </span>
          )}
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Lead Status Filter */}
          <div className="sm:flex-shrink-0 sm:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lead Score Filter */}
          <div className="sm:flex-shrink-0 sm:w-[200px]">
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="All Scores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="hot">Hot (80-100)</SelectItem>
                <SelectItem value="warm">Warm (60-79)</SelectItem>
                <SelectItem value="cold">Cold (&lt;60)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingRedditLeads ? (
          <LeadTableSkeleton />
        ) : filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="bg-muted p-4 rounded-full">
                  <IconAlertCircle className="size-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold">
                  {leads.length === 0 ? "No leads yet" : "No leads found"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {leads.length === 0
                    ? "Start engaging with Reddit users to generate leads. Your leads will appear here once interactions are analyzed."
                    : "Try adjusting your filters to see more results."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <LeadTable leads={filteredLeads} />
        )}
      </div>
    </div>
  );
}
