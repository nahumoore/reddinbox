"use client";

import { useOnboardingForm, WebsiteAnalysis } from "@/stores/onboarding-form";
import {
  IconBrandReddit,
  IconExternalLink,
  IconEye,
  IconLoader2,
  IconMessage,
  IconShield,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const permissions = [
  {
    icon: IconEye,
    title: "Read access to your profile",
    description:
      "We need to access your Reddit username and basic profile information",
    required: true,
  },
  {
    icon: IconMessage,
    title: "Private message access",
    description:
      "Access your Reddit DMs to import them into Reddinbox for management",
    required: true,
  },
  {
    icon: IconBrandReddit,
    title: "Submit content on your behalf",
    description:
      "Send direct messages and interact with Reddit communities as you",
    required: true,
  },
];

export default function RedditAuthStep() {
  const { websiteAnalysis, websiteUrl, userName } = useOnboardingForm();
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
        userName
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
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF4500] to-[#FF6B35] rounded-full flex items-center justify-center">
            <IconBrandReddit className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">
              Connect Your Reddit Account
            </h1>
            <p className="text-muted-foreground">
              Connect your Reddit account to start managing your DMs and
              engaging with communities
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <IconShield className="size-5 text-green-500" />
              <span>Required Permissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Reddinbox needs these permissions to provide you with the best
              experience:
            </p>

            {permissions.map((permission, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <permission.icon className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{permission.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {permission.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

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

const generateRedditAuthUrl = () => {
  const randomState = Math.random().toString(36).substring(2, 15);

  const baseUrl = "https://www.reddit.com/api/v1/authorize";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID!,
    response_type: "code",
    state: randomState,
    redirect_uri: `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/auth/reddit/callback`,
    duration: "permanent",
    scope: "identity privatemessages read history",
  });

  return `${baseUrl}?${params.toString()}`;
};

const fetchCompleteOnboarding = async (
  websiteAnalysis: WebsiteAnalysis,
  websiteUrl: string,
  userName: string
) => {
  try {
    const response = await fetch("/api/onboarding/complete", {
      method: "POST",
      body: JSON.stringify({
        websiteAnalysis,
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
