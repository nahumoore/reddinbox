"use client";

import { cn } from "@/lib/utils";
import { useOnboardingForm } from "@/stores/onboarding-form";
import {
  IconBrain,
  IconBulb,
  IconLoader2,
  IconSearch,
  IconTarget,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Highlighter } from "../ui/highlighter";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function WebsiteAnalysisStep() {
  const {
    userName,
    websiteUrl,
    isLoading,
    setWebsiteUrl,
    setWebsiteAnalysis,
    setTargetSubreddits,
    setLoading,
    setStep,
  } = useOnboardingForm();

  const [errors, setErrors] = useState<{
    userName?: string;
    websiteUrl?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { userName?: string; websiteUrl?: string } = {};

    if (!userName.trim()) {
      newErrors.userName = "Name is required";
    }

    if (!websiteUrl.trim()) {
      newErrors.websiteUrl = "Website URL is required";
    } else if (!websiteUrl.match(/^https?:\/\/.+\..+/)) {
      newErrors.websiteUrl =
        "Please enter a valid URL (e.g., https://example.com)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const analyzeWebsite = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await fetchWebsiteAnalysis(websiteUrl);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    setWebsiteAnalysis({
      websiteName: result.websiteName,
      companyDescription: result.companyDescription,
      keywordsToMonitor: result.keywordsToMonitor,
      targetAudience: result.targetAudience,
      expertise: result.expertise,
    });
    setTargetSubreddits(result.subreddits);

    setStep(2);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-center space-y-4 max-w-sm px-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
            <IconLoader2 className="size-8 text-white animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold font-heading">
              Analyzing Your Business
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We&apos;re scanning your website to identify your target audience,
              key messaging, and the Reddit communities where your customers
              spend time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className="relative z-10 space-y-8 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative size-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <IconWorld className="size-8 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground font-heading">
                Let&apos;s analyze your product
              </h1>
              <p className="text-lg text-muted-foreground">
                We&apos;ll analyze your product to provide you with the best{" "}
                <Highlighter action="underline" color="#ff5700">
                  Reddit experience
                </Highlighter>
              </p>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="space-y-2 flex-1 max-w-lg">
              <Label htmlFor="websiteUrl" className="text-base font-medium">
                Product URL *
              </Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://your-website.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className={cn(
                  "h-12 text-base",
                  errors.websiteUrl && "border-destructive"
                )}
                disabled={isLoading}
              />
              {errors.websiteUrl && (
                <p className="text-sm text-destructive">{errors.websiteUrl}</p>
              )}
            </div>
            <Button
              onClick={analyzeWebsite}
              disabled={isLoading || !userName.trim() || !websiteUrl.trim()}
              size="lg"
              className="h-12 px-6"
            >
              <IconBulb className="size-5 mr-2" />
              Analyze My Product
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
              <span className="text-sm font-medium text-muted-foreground px-3">
                What we&apos;ll discover
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="relative group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="size-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconUsers className="size-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold font-heading text-foreground">
                        Target Audience
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Identify who your ideal customers are and their pain
                        points
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="size-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconSearch className="size-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold font-heading text-foreground">
                        Reddit Communities
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Find the best subreddits where your customers are active
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="size-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconBrain className="size-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold font-heading text-foreground">
                        Content Strategy
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Get insights on how to create authentic, helpful content
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="size-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconTarget className="size-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold font-heading text-foreground">
                        Keywords to Monitor
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Track relevant keywords and topics across Reddit
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const fetchWebsiteAnalysis = async (websiteUrl: string) => {
  try {
    const response = await fetch("/api/onboarding/analyze-site", {
      method: "POST",
      body: JSON.stringify({ websiteUrl }),
    });

    return response.json();
  } catch (error) {
    console.error("Website analysis error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
