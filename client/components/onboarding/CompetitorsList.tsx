"use client";

import { useOnboardingForm } from "@/stores/onboarding-form";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlus,
  IconVs,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CompetitorsList() {
  const { websiteAnalysis, competitors, setCompetitors, setStep } =
    useOnboardingForm();

  const [newCompetitor, setNewCompetitor] = useState("");
  const [errors, setErrors] = useState<{ competitors?: string }>({});

  useEffect(() => {
    if (websiteAnalysis?.competitors && competitors.length === 0) {
      setCompetitors(websiteAnalysis.competitors);
    }
  }, [websiteAnalysis, competitors, setCompetitors]);

  const validateForm = () => {
    const newErrors: { competitors?: string } = {};

    if (competitors.length === 0) {
      newErrors.competitors = "At least one competitor is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const normalizeUrl = (url: string) => {
    let normalized = url.trim().toLowerCase();
    normalized = normalized.replace(/^https?:\/\//, "");
    normalized = normalized.replace(/^www\./, "");
    normalized = normalized.replace(/\/$/, "");
    return normalized;
  };

  const isValidDomain = (domain: string) => {
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const addCompetitor = () => {
    const competitor = normalizeUrl(newCompetitor);

    if (!competitor) return;

    if (!isValidDomain(competitor)) {
      setErrors({
        competitors: "Please enter a valid domain (e.g., example.com)",
      });
      return;
    }

    if (!competitors.includes(competitor)) {
      setCompetitors([...competitors, competitor]);
      setNewCompetitor("");
      if (errors.competitors) {
        setErrors({});
      }
    }
  };

  const removeCompetitor = (competitorToRemove: string) => {
    const updatedCompetitors = competitors.filter(
      (competitor) => competitor !== competitorToRemove
    );
    setCompetitors(updatedCompetitors);
  };

  const handleCompetitorInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCompetitor();
    }
  };

  const handleContinue = () => {
    if (!validateForm()) return;
    setStep(4);
  };

  const handleGoBack = () => {
    setStep(2);
  };

  const getFaviconUrl = (domain: string) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <IconVs className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">
              Who are your competitors?
            </h1>
            <p className="text-muted-foreground">
              We&apos;ve identified some competitors from your website. Review
              and add any others you&apos;d like to monitor.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="competitorInput">Add Competitor</Label>

          <div className="flex gap-2">
            <Input
              id="competitorInput"
              type="text"
              placeholder="competitor.com"
              value={newCompetitor}
              onChange={(e) => setNewCompetitor(e.target.value)}
              onKeyPress={handleCompetitorInputKeyPress}
              className={`flex-1 ${
                errors.competitors ? "border-destructive" : ""
              }`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCompetitor}
              disabled={!newCompetitor.trim()}
              className="px-3"
            >
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Enter competitor domains (e.g., competitor.com) to track their
            mentions on Reddit.
          </p>

          {errors.competitors && (
            <p className="text-sm text-destructive">{errors.competitors}</p>
          )}
        </div>

        {competitors.length > 0 && (
          <div className="space-y-4">
            <Label>Your Competitors ({competitors.length})</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {competitors.map((competitor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={getFaviconUrl(competitor)}
                      alt={`${competitor} favicon`}
                      className="w-6 h-6 rounded-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/favicon.ico";
                      }}
                    />
                    <div>
                      <p className="font-medium text-sm">{competitor}</p>
                      <p className="text-xs text-muted-foreground">
                        https://{competitor}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCompetitor(competitor)}
                    className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between py-4">
        <Button variant="outline" onClick={handleGoBack} className="px-6">
          <IconArrowLeft className="size-4 mr-2" />
          Previous
        </Button>

        <Button onClick={handleContinue} className="px-8" size="lg">
          Continue
          <IconArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
