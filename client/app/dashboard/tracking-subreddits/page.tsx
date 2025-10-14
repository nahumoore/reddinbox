"use client";

import DialogSubredditSuggestion from "@/components/dashboard/tracking-subreddits/DialogSubredditSuggestion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRedditSubreddits } from "@/stores/reddit-subreddits";
import {
  IconNews,
  IconUsers,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";
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
          <SubredditTableSkeleton />
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
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="max-w-sm">Subreddit</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead className="text-right">Posts (24h)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subreddits.map((subreddit) => (
                    <TableRow key={subreddit.id}>
                      <TableCell className="max-w-sm">
                        <div className="flex items-center gap-3">
                          {subreddit.community_icon ? (
                            <img
                              src={subreddit.community_icon}
                              alt={subreddit.display_name_prefixed}
                              className="size-10 rounded-full bg-muted flex-shrink-0"
                            />
                          ) : (
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <IconWorld className="size-5 text-primary" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-sm">
                              {subreddit.display_name_prefixed}
                            </div>
                            {subreddit.title && (
                              <div className="text-xs text-muted-foreground truncate">
                                {subreddit.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          {subreddit.public_description ? (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {subreddit.public_description}
                            </p>
                          ) : (
                            <span className="text-sm text-muted-foreground/50">
                              No description
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {subreddit.subscribers ? (
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <IconUsers className="size-4 text-muted-foreground" />
                            <span>
                              {subreddit.subscribers.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground/50">
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <IconNews className="size-4 text-primary" />
                          <span className="font-medium text-primary text-sm">
                            {postsPerSubreddit[subreddit.id] || 0}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

function SubredditTableSkeleton() {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subreddit</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Members</TableHead>
            <TableHead className="text-right">Created</TableHead>
            <TableHead className="text-right">Posts (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }, (_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full flex-shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-64" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-24 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
