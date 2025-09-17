"use client";

import { LeadCommentCard } from "@/components/dashboard/leads-discovery/LeadCommentCard";
import { LeadPMSheet } from "@/components/dashboard/leads-discovery/LeadPMSheet";
import { LeadPostCard } from "@/components/dashboard/leads-discovery/LeadPostCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedditLeads } from "@/stores/reddit-leads";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconSearch } from "@tabler/icons-react";

export default function LeadsPage() {
  const { userActiveWebsite } = useUserWebsites();
  const { redditLeads, isLoadingRedditLeads } = useRedditLeads();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-heading text-2xl font-bold">Lead Discovery</h1>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Discover new potential customers on Reddit for your product{" "}
            <b className="text-primary italic">{userActiveWebsite?.name}</b>
          </p>
          <div className="flex flex-wrap gap-2">
            {userActiveWebsite?.keywords?.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      {isLoadingRedditLeads ? (
        <div className="space-y-4">
          {/* Loading Skeletons */}
          {Array.from({ length: 3 }, (_, index) => (
            <LeadCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {redditLeads.map((lead) =>
            lead.content_type === "post" ? (
              <LeadPostCard key={lead.id} lead={lead} />
            ) : (
              <LeadCommentCard key={lead.id} lead={lead} />
            )
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoadingRedditLeads && redditLeads.length === 0 && (
        <div className="text-center py-12">
          <IconSearch className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">Collecting leads...</h3>
          <p className="text-muted-foreground">
            We&apos;re monitoring {userActiveWebsite?.name}&apos;s keywords 24/7
            and will notify you when we find new leads.
          </p>
        </div>
      )}

      {/* Lead Pivate Message Sheet */}
      <LeadPMSheet />
    </div>
  );
}

function LeadCardSkeleton() {
  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Content */}
        <div className="space-y-3 mb-4">
          <Skeleton className="h-5 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
