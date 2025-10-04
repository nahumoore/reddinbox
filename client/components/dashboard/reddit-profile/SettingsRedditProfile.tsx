"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsRedditProfile() {
  const { activeRedditAccount } = useRedditAccounts();
  const [showDialog, setShowDialog] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");

  const isDeleteEnabled = confirmationInput === activeRedditAccount?.name;

  const handleRemoveProfile = async () => {
    try {
      const response = await fetch("/api/reddit/remove-profile", {
        method: "POST",
      });
      const result = await response.json();

      if (result.error) {
        console.error(result.error);
        toast.error(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove Reddit profile");
    }

    setShowDialog(false);
    setConfirmationInput("");
  };

  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      setConfirmationInput("");
    }
  };

  return (
    <>
      <Card className="border-destructive/20 max-w-4xl">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <IconAlertTriangle className="size-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            <p className="text-sm text-muted-foreground">
              Once you remove your Reddit profile, all associated data will be
              permanently deleted. This action cannot be undone.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="destructive"
              onClick={() => setShowDialog(true)}
              className="w-full sm:w-auto"
            >
              <IconTrash className="size-4 mr-2" />
              Remove Reddit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Reddit Profile</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please type{" "}
              <span className="font-semibold">{activeRedditAccount?.name}</span>{" "}
              to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={`Type ${activeRedditAccount?.name} to confirm`}
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveProfile}
              disabled={!isDeleteEnabled}
            >
              Remove Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
