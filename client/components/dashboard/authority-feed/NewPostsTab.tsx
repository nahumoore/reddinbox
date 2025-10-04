"use client";

import { InteractionPost } from "@/components/dashboard/authority-feed/InteractionPost";
import InteractionRemoveAll from "@/components/dashboard/authority-feed/InteractionRemoveAll";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconSearch } from "@tabler/icons-react";

export default function NewPostsTab() {
  const { userActiveWebsite } = useUserWebsites();
  const { redditUserInteractions, isLoadingRedditUserInteractions } =
    useRedditUserInteractions();
  const newPostsToReview = redditUserInteractions.filter(
    (interaction) => interaction.status === "new" && interaction.interaction_type === "post_reply"
  );

  if (isLoadingRedditUserInteractions) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <LeadCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (newPostsToReview.length === 0) {
    return (
      <div className="text-center py-12 max-w-xl mx-auto">
        <IconSearch className="size-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <h3 className="font-medium text-lg mb-2">Collecting posts...</h3>
        <p className="text-muted-foreground">
          We&apos;re monitoring and analyzing posts for{" "}
          <b>{userActiveWebsite?.name}</b>. We&apos;ll notify you when we find
          new ones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newPostsToReview.map((post) => (
        <InteractionPost key={post.id} interaction={post} />
      ))}
      <InteractionRemoveAll />
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
