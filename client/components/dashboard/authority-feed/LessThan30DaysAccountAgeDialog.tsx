"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconAlertTriangle, IconExternalLink } from "@tabler/icons-react";

interface LessThan30DaysAccountAgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: () => void;
  postUrl?: string;
}

export default function LessThan30DaysAccountAgeDialog({
  open,
  onOpenChange,
  onProceed,
  postUrl,
}: LessThan30DaysAccountAgeDialogProps) {
  const handleProceed = () => {
    onProceed();
    onOpenChange(false);
  };

  const handleOpenPost = () => {
    if (postUrl) {
      window.open(postUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="size-5 text-amber-500" />
            <DialogTitle className="text-amber-500">
              Account Age Warning
            </DialogTitle>
          </div>
          <div className="pt-3 space-y-3 text-left">
            <p>
              Your Reddit account is less than <b>30 days old</b> and has less
              than <b>50 comment karma</b>.
            </p>
            <p>
              {" "}
              Posting comments from an external app with new accounts carries a{" "}
              <strong className="text-red-500">
                high risk of being banned
              </strong>{" "}
              by Reddit.
            </p>
            <p className="font-medium text-foreground">We recommend:</p>
            <ol className="list-decimal list-inside space-y-2 pl-6">
              <li>Go to the Reddit post</li>
              <li>Post the comment yourself</li>
              <li>
                Return to the platform and click &apos;Mark as Replied&apos; to
                keep track of your history
              </li>
            </ol>
            <p className="text-muted-foreground text-sm">
              However, you can still proceed with scheduling if you accept the
              risks.
            </p>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleOpenPost}
            className="gap-2"
            disabled={!postUrl}
          >
            <IconExternalLink className="size-4" />
            Open Post
          </Button>
          <Button onClick={handleProceed} className="gap-2">
            Proceed Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
