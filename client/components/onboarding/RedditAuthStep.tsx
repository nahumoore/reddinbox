"use client";

import { useOnboardingForm, WebsiteAnalysis } from "@/stores/onboarding-form";
import { SubredditData } from "@/types/reddit";
import { generateRedditAuthUrl } from "@/utils/reddit/generate-auth-url";
import {
  IconCalendar,
  IconExternalLink,
  IconLoader2,
  IconMessage,
  IconSparkles,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { IconBrandRedditNew } from "../icons/BrandRedditNew";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function RedditAuthStep() {
  const { websiteAnalysis, websiteUrl, userName, targetSubreddits, setStep } =
    useOnboardingForm();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  const handleRedditAuth = async () => {
    setIsConnecting(true);
    setConnectionError("");

    try {
      // SAVE ONBOARDING DATA
      const response = await fetchCompleteOnboarding(
        websiteAnalysis!,
        websiteUrl,
        userName,
        targetSubreddits
      );

      if (response.error) {
        toast.error(response.error);
        setIsConnecting(false);
        return;
      }

      // REDIRECT TO REDDIT OAUTH
      const authUrl = generateRedditAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      setConnectionError("Failed to connect to Reddit. Please try again.");
      setIsConnecting(false);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    setConnectionError("");

    try {
      // SAVE ONBOARDING DATA WITHOUT REDDIT AUTH
      const response = await fetchCompleteOnboarding(
        websiteAnalysis!,
        websiteUrl,
        userName,
        targetSubreddits
      );

      if (response.error) {
        toast.error(response.error);
        setIsSkipping(false);
        return;
      }

      window.location.href = "/onboarding/completed";
    } catch (error) {
      setConnectionError("Failed to complete setup. Please try again.");
      setIsSkipping(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="relative z-10 space-y-8 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative size-16 bg-gradient-to-br from-[#FF4500] to-[#FF6B35] rounded-2xl flex items-center justify-center shadow-lg">
              <IconBrandRedditNew className="size-8 text-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground font-heading">
                  Connect Your Reddit Account
                </h1>
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20"
                >
                  Optional
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                Unlock the full power of Reddinbox by connecting your Reddit
                account
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex-1">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
              <span className="text-sm font-medium text-muted-foreground px-3">
                What you&apos;ll get with Reddit connection
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="relative group hover:shadow-md transition-shadow border-purple-500/20">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="size-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconMessage className="size-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold font-heading text-foreground">
                        Smart Lead Tracking
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Automatically track and manage potential customers from
                        your Reddit interactions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative group hover:shadow-md transition-shadow border-blue-500/20">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="size-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconCalendar className="size-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold font-heading text-foreground">
                        Schedule Posts & Comments
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Schedule your posts and comments to Reddit and manage
                        your content effectively
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative group hover:shadow-md transition-shadow border-emerald-500/20">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="size-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconSparkles className="size-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold font-heading text-foreground">
                        Reply Generation
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Get intelligent, context-aware reply suggestions when
                        users respond to your comments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {connectionError && (
          <Card className="bg-red-50/50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-700">{connectionError}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleSkip}
              disabled={isConnecting || isSkipping}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-10 py-6 text-lg font-semibold"
            >
              {isSkipping ? (
                <>
                  <IconLoader2 className="size-5 animate-spin mr-3" />
                  Completing setup...
                </>
              ) : (
                "Skip for now"
              )}
            </Button>
            <Button
              onClick={handleRedditAuth}
              disabled={isConnecting || isSkipping}
              size="lg"
              className="w-full sm:w-auto px-10 py-6 text-lg font-semibold bg-[#FF4500] hover:bg-[#FF6B35] text-white shadow-lg"
            >
              {isConnecting ? (
                <>
                  <IconLoader2 className="size-5 animate-spin mr-3" />
                  Connecting to Reddit...
                </>
              ) : (
                <>
                  <IconBrandRedditNew className="size-5 mr-3" />
                  Connect with Reddit
                  <IconExternalLink className="size-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            You can always connect your Reddit account later from your settings
          </p>
        </div>
      </div>
    </div>
  );
}

const fetchCompleteOnboarding = async (
  websiteAnalysis: WebsiteAnalysis,
  websiteUrl: string,
  userName: string,
  targetSubreddits: SubredditData[]
) => {
  try {
    const response = await fetch("/api/onboarding/reddit-oauth", {
      method: "POST",
      body: JSON.stringify({
        websiteAnalysis,
        targetSubreddits,
        websiteUrl,
        userName,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Complete onboarding error:", error);

    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
