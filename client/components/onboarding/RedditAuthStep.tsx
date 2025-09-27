"use client";

import { useOnboardingForm, WebsiteAnalysis } from "@/stores/onboarding-form";
import { SubredditData } from "@/types/reddit";
import { generateRedditAuthUrl } from "@/utils/reddit/generate-auth-url";
import {
  IconBrandReddit,
  IconExternalLink,
  IconLoader2,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function RedditAuthStep() {
  const { websiteAnalysis, websiteUrl, userName, targetSubreddits } =
    useOnboardingForm();
  const [isConnecting, setIsConnecting] = useState(false);
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative size-16 bg-gradient-to-br from-[#FF4500] to-[#FF6B35] rounded-2xl flex items-center justify-center shadow-lg">
            <IconBrandReddit className="size-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Connect Your Reddit Account
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect your Reddit account in which you&apos;d like to build
              authority for your product
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground font-heading">
            Final Step
          </h2>
          <p className="text-muted-foreground">
            Connect your Reddit account to complete your setup
          </p>
        </div>

        {connectionError && (
          <Card className="bg-red-50/50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-700">{connectionError}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center pb-4">
          <Button
            onClick={handleRedditAuth}
            disabled={isConnecting}
            size="lg"
            className="px-12 py-6 text-lg font-semibold bg-[#FF4500] hover:bg-[#FF6B35] text-white"
          >
            {isConnecting ? (
              <>
                <IconLoader2 className="size-5 animate-spin mr-3" />
                Connecting to Reddit...
              </>
            ) : (
              <>
                <IconBrandReddit className="size-5 mr-3" />
                Connect with Reddit
                <IconExternalLink className="size-4 ml-2" />
              </>
            )}
          </Button>
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
