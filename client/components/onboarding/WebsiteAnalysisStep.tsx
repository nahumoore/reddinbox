"use client";

import { useOnboardingForm } from "@/stores/onboarding-form";
import { IconBulb, IconLoader2, IconWorld } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function WebsiteAnalysisStep() {
  const {
    userName,
    websiteUrl,
    isLoading,
    setWebsiteUrl,
    setWebsiteAnalysis,
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
    } else {
      setWebsiteAnalysis({
        websiteName: result.websiteName,
        companyDescription: result.companyDescription,
        keywordsToMonitor: result.keywordsToMonitor,
        idealCustomerProfile: result.idealCustomerProfile,
        competitors: result.competitors,
      });
    }

    setStep(2);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <IconWorld className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">
              Let&apos;s analyze your product
            </h1>
            <p className="text-muted-foreground">
              We&apos;ll analyze your website to understand your product and
              identify your ideal customer profile
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL *</Label>
        <Input
          id="websiteUrl"
          type="url"
          placeholder="https://your-website.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className={errors.websiteUrl ? "border-destructive" : ""}
        />
        {errors.websiteUrl && (
          <p className="text-sm text-destructive">{errors.websiteUrl}</p>
        )}
      </div>
      <Button
        onClick={analyzeWebsite}
        disabled={isLoading || !userName.trim() || !websiteUrl.trim()}
        className="w-full py-6 text-lg font-semibold"
        size="lg"
      >
        {isLoading ? (
          <>
            <IconLoader2 className="size-5 animate-spin mr-2" />
            Analyzing your website...
          </>
        ) : (
          <>
            <IconBulb className="size-5 mr-2" />
            Analyze My Website
          </>
        )}
      </Button>
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
