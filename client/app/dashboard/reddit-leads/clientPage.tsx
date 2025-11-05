"use client";

import { LeadCard } from "@/components/dashboard/reddit-leads/LeadCard";
import { LeadCardSkeleton } from "@/components/dashboard/reddit-leads/LeadCardSkeleton";
import { StatsOverview } from "@/components/dashboard/reddit-leads/StatsOverview";
import { Card, CardContent } from "@/components/ui/card";
import { useRedditLeads } from "@/stores/reddit-leads";
import { RedditLeads } from "@/types/db-schema";
import { IconAlertCircle, IconHeartHandshake } from "@tabler/icons-react";
import { useEffect } from "react";

export default function RedditLeadsClient({
  serverLeads,
}: {
  serverLeads: Partial<RedditLeads>[];
}) {
  const { leads, isLoadingRedditLeads, setLeads, setIsLoadingRedditLeads } =
    useRedditLeads();

  useEffect(() => {
    setLeads(serverLeads);
    setIsLoadingRedditLeads(false);
  }, [serverLeads]);

  // Calculate stats
  const totalLeads = leads.length;
  const hotLeads = leads.filter((lead) => lead.lead_score! >= 80).length;
  const contactedLeads = leads.filter(
    (lead) =>
      lead.lead_status === "contacted" || lead.lead_status === "responded"
  ).length;
  const convertedLeads = leads.filter(
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
      <div>
        <h2 className="font-heading text-xl font-semibold mb-4">Your Leads</h2>
        {isLoadingRedditLeads ? (
          <div className="flex flex-col gap-4">
            <LeadCardSkeleton />
            <LeadCardSkeleton />
            <LeadCardSkeleton />
            <LeadCardSkeleton />
          </div>
        ) : leads.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="bg-muted p-4 rounded-full">
                  <IconAlertCircle className="size-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold">
                  No leads yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Start engaging with Reddit users to generate leads. Your leads
                  will appear here once interactions are analyzed.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
