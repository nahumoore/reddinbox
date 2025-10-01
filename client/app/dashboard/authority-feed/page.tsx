"use client";

import { InteractionPost } from "@/components/dashboard/authority-feed/InteractionPost";
import InteractionRemoveAll from "@/components/dashboard/authority-feed/InteractionRemoveAll";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedditSubreddits } from "@/stores/reddit-subreddits";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconSearch, IconSettings } from "@tabler/icons-react";
import Link from "next/link";

export default function LeadsPage() {
  const { userActiveWebsite } = useUserWebsites();
  const { redditUserInteractions, isLoadingRedditUserInteractions } =
    useRedditUserInteractions();
  const { subreddits } = useRedditSubreddits();
  const newPostsToReview = redditUserInteractions.filter(
    (interaction) => interaction.status === "new"
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="border-b py-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-2xl font-bold">Authority Feed</h1>
          </div>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "bg-white hover:shadow-md transition-all",
            })}
            href="/dashboard/authority-feed/settings"
          >
            <IconSettings className="size-4" />
            Settings
          </Link>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Start building authority on Reddit for content around{" "}
            <b className="text-primary italic">{userActiveWebsite?.name}</b>
          </p>
          <div className="flex items-center gap-2">
            <span className="font-medium text-xs text-muted-foreground">
              Subreddits:
            </span>
            <div className="flex flex-wrap gap-2">
              {subreddits.map((subreddit) => (
                <Badge key={subreddit.id} variant="secondary">
                  {subreddit.display_name_prefixed}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      {isLoadingRedditUserInteractions ? (
        <div className="space-y-4">
          {/* Loading Skeletons */}
          {Array.from({ length: 3 }, (_, index) => (
            <LeadCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {newPostsToReview.map(
            (post) =>
              post.interaction_type === "post_reply" && (
                <InteractionPost key={post.id} interaction={post} />
              )
          )}
          <InteractionRemoveAll />
        </div>
      )}

      {/* Empty state */}
      {!isLoadingRedditUserInteractions && newPostsToReview.length === 0 && (
        <div className="text-center py-12 max-w-xl mx-auto">
          <IconSearch className="size-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="font-medium text-lg mb-2">Collecting posts...</h3>
          <p className="text-muted-foreground">
            We&apos;re monitoring and analyzing posts for{" "}
            <b>{userActiveWebsite?.name}</b>. We&apos;ll notify you when we find
            new ones.
          </p>
        </div>
      )}
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
