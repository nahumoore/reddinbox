"use client";

import DialogSubredditSuggestion from "@/components/dashboard/tracking-subreddits/DialogSubredditSuggestion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedditSubreddits } from "@/stores/reddit-subreddits";
import {
  IconBuildingCommunity,
  IconClock,
  IconUsers,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export default function TrackingSubredditsPage() {
  const { subreddits, isLoadingSubreddits } = useRedditSubreddits();
  const [postsPerSubreddit, setPostsPerSubreddit] = useState<
    Record<string, number>
  >({});
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isSuggestionDialogOpen, setIsSuggestionDialogOpen] = useState(false);

  useEffect(() => {
    const fetchLastHourPosts = async () => {
      try {
        const response = await fetch("/api/reddit/subreddits/get-latest-posts");
        if (response.ok) {
          const data = await response.json();
          setPostsPerSubreddit(data.postsPerSubreddit || {});
        }
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchLastHourPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="py-3">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <IconUsersGroup className="size-6" />
              Tracking Subreddits
            </h1>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We&apos;re monitoring these communities every hour to discover
              relevant posts where you can share your expertise.
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoadingSubreddits || isLoadingPosts ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <SubredditCardSkeleton key={index} />
            ))}
          </div>
        ) : subreddits.length === 0 ? (
          <div className="text-center py-12 max-w-xl mx-auto">
            <IconWorld className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No subreddits tracked</h3>
            <p className="text-muted-foreground">
              You haven&apos;t selected any subreddits to track yet. Configure
              your tracking preferences in the Authority Feed settings.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Tracking <b className="text-primary">{subreddits.length}</b>{" "}
              {subreddits.length === 1 ? "subreddit" : "subreddits"},{" "}
              <button
                onClick={() => setIsSuggestionDialogOpen(true)}
                className="text-primary hover:underline hover:text-primary/80 transition-all cursor-pointer"
              >
                are we missing any?
              </button>
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subreddits.map((subreddit) => (
                <Card
                  key={subreddit.id}
                  className="h-fit hover:shadow-md transition-shadow"
                >
                  <CardContent>
                    {/* Subreddit Header */}
                    <div className="flex items-start gap-3 mb-4">
                      {subreddit.community_icon ? (
                        <img
                          src={subreddit.community_icon}
                          alt={subreddit.display_name_prefixed}
                          className="size-12 rounded-full bg-muted"
                        />
                      ) : (
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconWorld className="size-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">
                          {subreddit.display_name_prefixed}
                        </h3>
                        {subreddit.title && (
                          <p className="text-xs text-muted-foreground truncate">
                            {subreddit.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {subreddit.public_description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {subreddit.public_description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      {subreddit.subscribers && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <IconUsers className="size-4" />
                          <span>
                            {subreddit.subscribers.toLocaleString()} members
                          </span>
                        </div>
                      )}
                      {subreddit.created_utc && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <IconClock className="size-4" />
                          <span>
                            Created{" "}
                            {formatDistanceToNow(
                              new Date(subreddit.created_utc * 1000),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        <IconBuildingCommunity className="size-4 text-primary" />
                        <span className="font-medium text-primary">
                          {postsPerSubreddit[subreddit.id] || 0} posts
                          discovered last 24 hours
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <DialogSubredditSuggestion
        open={isSuggestionDialogOpen}
        onOpenChange={setIsSuggestionDialogOpen}
      />
    </>
  );
}

function SubredditCardSkeleton() {
  return (
    <Card className="h-fit">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2 pt-4 border-t">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
