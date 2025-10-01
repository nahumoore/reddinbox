"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useUserWebsites } from "@/stores/user-wesbites";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FoundPremiumFeature from "../../FoundPremiumFeature";

export default function PostsPerHour() {
  const { userActiveWebsite, setUserActiveWebsite } = useUserWebsites();
  const [postsPerHour, setPostsPerHour] = useState(10);
  const [initialPostsPerHour, setInitialPostsPerHour] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [premiumFeatureDialogOpen, setPremiumFeatureDialogOpen] =
    useState(false);

  useEffect(() => {
    if (userActiveWebsite) {
      const options = userActiveWebsite.authority_feed_options as {
        posts_per_hour?: number;
      } | null;

      const value = options?.posts_per_hour ?? 10;
      setPostsPerHour(value);
      setInitialPostsPerHour(value);
    }
  }, [userActiveWebsite]);

  const hasChanges = postsPerHour !== initialPostsPerHour;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async () => {
    if (!userActiveWebsite) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/authority-feed/update-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website_id: userActiveWebsite.id,
          posts_per_hour: postsPerHour,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings");
      }

      if (result.data) {
        setUserActiveWebsite(result.data);
      }

      setInitialPostsPerHour(postsPerHour);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePostsPerHour = (value: number) => {
    if (value > 10) {
      setPremiumFeatureDialogOpen(true);
      return;
    }
    setPostsPerHour(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Posts Per Hour</CardTitle>
          <CardDescription>
            Control how many posts you want to see per hour in your authority
            feed. This helps you manage your workload and focus on quality
            interactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="posts-per-hour" className="text-base">
                Maximum posts per hour
              </Label>
              <Input
                id="posts-per-hour"
                type="number"
                min="1"
                max="50"
                value={postsPerHour}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 50) {
                    handleChangePostsPerHour(value);
                  }
                }}
                className="w-20 text-center"
              />
            </div>
            <Slider
              value={[postsPerHour]}
              onValueChange={(values) => handleChangePostsPerHour(values[0])}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 post</span>
              <span>50 posts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      <FoundPremiumFeature
        open={premiumFeatureDialogOpen}
        onOpenChange={setPremiumFeatureDialogOpen}
        title="Found Premium Feature!"
        description="You are limited to 10 posts per hour. Buttt, you can upgrade to a premium plan to get up to 50 posts per hour."
      />
    </div>
  );
}
