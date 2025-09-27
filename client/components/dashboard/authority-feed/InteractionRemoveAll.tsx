"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { IconArrowUp, IconCheck, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

export default function InteractionRemoveAll() {
  const [showDialog, setShowDialog] = useState(false);
  const [isIgnoring, setIsIgnoring] = useState(false);
  const { redditUserInteractions, setRedditUserInteractions } =
    useRedditUserInteractions();

  const newPosts = redditUserInteractions.filter(
    (interaction) => interaction.status === "new"
  );

  const handleIgnoreAll = async () => {
    if (newPosts.length === 0) return;

    setIsIgnoring(true);
    try {
      const response = await fetch("/api/reddit/comments/ignore-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interaction_ids: newPosts.map((post) => post.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to ignore comments");
      }

      // Update local state
      const updatedInteractions = redditUserInteractions.map((interaction) =>
        newPosts.some((post) => post.id === interaction.id)
          ? { ...interaction, status: "ignored" as const }
          : interaction
      );
      setRedditUserInteractions(updatedInteractions);
      setShowDialog(false);
    } catch (error) {
      console.error("Error ignoring comments:", error);
      // You could add a toast notification here for better UX
    } finally {
      setIsIgnoring(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Don&apos;t render if there are no new posts to ignore
  if (newPosts.length === 0) return null;

  return (
    <>
      <div className="text-center py-8 px-6">
        <div className="flex items-center justify-center mb-4">
          <IconCheck className="size-8 text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold mb-2">
          Congrats for reviewing all the posts!
        </h3>
        <p className="text-muted-foreground mb-6">
          You&apos;ve gone through all the available interactions. There are
          still{" "}
          <span className="font-semibold text-primary">
            {newPosts.length} unreviewed{" "}
            {newPosts.length === 1 ? "post" : "posts"}
          </span>{" "}
          remaining.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={() => setShowDialog(true)}
            variant="destructive"
            className="flex items-center gap-2"
            disabled={isIgnoring}
          >
            <IconTrash className="size-4" />
            {isIgnoring
              ? "Ignoring..."
              : `Ignore remaining ${newPosts.length} ${
                  newPosts.length === 1 ? "post" : "posts"
                }`}
          </Button>
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <IconArrowUp className="size-4" />
            Return to top
          </Button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ignore Remaining Posts?</DialogTitle>
            <DialogDescription>
              Are you sure you want to ignore all {newPosts.length} remaining{" "}
              {newPosts.length === 1 ? "post" : "posts"}? This action cannot be
              undone and these posts will no longer appear in your feed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isIgnoring}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleIgnoreAll}
              disabled={isIgnoring}
            >
              {isIgnoring ? "Ignoring..." : "Confirm Ignore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
