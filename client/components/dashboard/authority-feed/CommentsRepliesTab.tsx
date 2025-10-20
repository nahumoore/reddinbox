"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconMessageOff, IconUserOff } from "@tabler/icons-react";
import Link from "next/link";
import InteractionRemoveAll from "./InteractionRemoveAll";
import ThreadComments from "./ThreadComments";

export default function CommentsRepliesTab() {
  const { userActiveWebsite } = useUserWebsites();
  const { redditUserInteractions, isLoadingRedditUserInteractions } =
    useRedditUserInteractions();
  const { activeRedditAccount } = useRedditAccounts();

  const commentRepliesToReview = redditUserInteractions?.filter(
    (interaction) =>
      interaction.status === "new" &&
      interaction.interaction_type === "comment_reply"
  );

  // const handleRefresh = async () => {
  //   setIsRefreshing(true);
  //   try {
  //     const response = await fetch("/api/reddit/comments/fetch-new", {
  //       method: "POST",
  //     });
  //     const result = await response.json();
  //     if (result.error) {
  //       throw new Error(result.error);
  //     }

  //     setRedditUserInteractions(result.interactions);
  //     toast.success("Comments refreshed successfully");
  //   } catch (error) {
  //     console.error("Failed to refresh comments:", error);
  //     toast.error("Failed to refresh comments", {
  //       description:
  //         error instanceof Error ? error.message : "Please try again",
  //     });
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // };

  if (isLoadingRedditUserInteractions) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <CommentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!activeRedditAccount) {
    return (
      <div className="text-center py-12 max-w-xl mx-auto">
        <IconUserOff className="size-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-2">No Reddit Account Connected</h3>
        <p className="text-muted-foreground mb-6">
          We cannot track the comments you receive without an active Reddit account.
          Connect your account to monitor replies and generate helpful responses.
        </p>
        <Button asChild>
          <Link href="/dashboard/reddit-profile">
            Connect Reddit Account
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:shadow-md transition-all"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <IconRefresh
            className={`size-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div> */}
      {!commentRepliesToReview || commentRepliesToReview.length === 0 ? (
        <div className="text-center py-12 max-w-xl mx-auto">
          <IconMessageOff className="size-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="font-medium text-lg mb-2">No comment replies yet</h3>
          <p className="text-muted-foreground">
            When users reply to your comments on posts related to{" "}
            <b>{userActiveWebsite?.name}</b>, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <>
          {commentRepliesToReview.map((comment) => (
            <ThreadComments key={comment.id} interaction={comment} />
          ))}
          <InteractionRemoveAll interactionType="comment_reply" />
        </>
      )}
    </div>
  );
}

function CommentCardSkeleton() {
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
