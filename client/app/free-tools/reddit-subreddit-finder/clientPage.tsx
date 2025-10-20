"use client";

import { IconBrandRedditNew } from "@/components/icons/BrandRedditNew";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Highlighter } from "@/components/ui/highlighter";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  IconAlertCircle,
  IconArrowRight,
  IconChartBar,
  IconExternalLink,
  IconFlame,
  IconLoader2,
  IconSearch,
  IconSparkles,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";

// TypeScript interfaces for type safety
interface Subreddit {
  id: string;
  name: string;
  displayName: string;
  description: string;
  subscribers: number;
  activeUsers: number;
  createdAt: Date;
  relevanceScore: number;
  activityLevel: "low" | "medium" | "high" | "very-high";
  subredditUrl: string;
  category?: string;
}

export default function SubredditFinderClientPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Subreddit[]>([]);
  const [error, setError] = useState("");

  // URL validation
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Get activity level badge styling
  const getActivityLevelStyle = (level: Subreddit["activityLevel"]): string => {
    switch (level) {
      case "very-high":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-900";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 hover:text-orange-900";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:text-yellow-900";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900";
    }
  };

  // Get activity level icon
  const getActivityLevelIcon = (level: Subreddit["activityLevel"]) => {
    switch (level) {
      case "very-high":
        return <IconFlame className="size-4" aria-hidden="true" />;
      case "high":
        return <IconTrendingUp className="size-4" aria-hidden="true" />;
      case "medium":
        return <IconChartBar className="size-4" aria-hidden="true" />;
      case "low":
        return <IconChartBar className="size-4" aria-hidden="true" />;
    }
  };

  // Get activity level label
  const getActivityLevelLabel = (level: Subreddit["activityLevel"]): string => {
    switch (level) {
      case "very-high":
        return "Very Active";
      case "high":
        return "Active";
      case "medium":
        return "Moderate";
      case "low":
        return "Low Activity";
    }
  };

  // Get relevance score color
  const getRelevanceScoreColor = (score: number): string => {
    if (score >= 90)
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900";
    if (score >= 80)
      return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900";
    if (score >= 70)
      return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:text-yellow-900";
    return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900";
  };

  // Format subscriber count
  const formatSubscribers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Handle form submission
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL
    if (!websiteUrl.trim()) {
      setError("Please enter a website URL");
      return;
    }

    if (!isValidUrl(websiteUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Call the real API endpoint
      const response = await fetch("/api/free-tools/subreddit-finder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze website");
      }

      // Transform the data to ensure Date objects
      const transformedResults: Subreddit[] = (data.subreddits || []).map(
        (subreddit: Subreddit) => ({
          ...subreddit,
          createdAt: new Date(subreddit.createdAt),
        })
      );

      setResults(transformedResults);
    } catch (err) {
      console.error("Error analyzing website:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze website"
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <IconSparkles className="size-4" aria-hidden="true" />
              <span>100% Free - No Signup Required</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-heading leading-tight max-w-4xl mx-auto">
              Discover The Best{" "}
              <Highlighter action="underline" color="#ff5700">
                <span className="text-primary">Subreddits</span>
                <IconBrandRedditNew className="size-12 -rotate-6 text-primary inline-block ml-2" />
              </Highlighter>{" "}
              For Your Niche
            </h1>

            <h2 className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
              Find <b>relevant communities</b> where your target audience is
              actively engaged and ready to discover your solution!
            </h2>

            {/* Search Form */}
            <form
              onSubmit={handleAnalyze}
              className="max-w-2xl mx-auto mb-4"
              noValidate
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="Enter your website URL (e.g., https://example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className={cn(
                      "h-12 md:h-14 text-base px-4",
                      error &&
                        "border-destructive focus-visible:ring-destructive/20"
                    )}
                    aria-label="Website URL"
                    aria-invalid={!!error}
                    aria-describedby={error ? "url-error" : undefined}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 md:h-14 px-8 text-base font-semibold min-w-[140px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <IconLoader2 className="size-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <IconSearch className="size-5" aria-hidden="true" />
                      Find Subreddits
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div
                  id="url-error"
                  className="flex items-center gap-2 text-destructive text-sm mt-2"
                  role="alert"
                >
                  <IconAlertCircle
                    className="size-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{error}</span>
                </div>
              )}
            </form>

            <p className="text-sm text-muted-foreground">
              We&apos;ll analyze your website and find the most relevant Reddit
              communities for your niche
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              {/* Skeleton Cards */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-28" />
                      <Skeleton className="h-8 w-28" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && hasSearched && results.length > 0 && (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-heading">
                  Top Subreddits For Your Niche
                </h2>
                <p className="text-muted-foreground">
                  These communities are most relevant to your website and have
                  active, engaged members.
                </p>
              </div>

              {/* Subreddit Cards */}
              <div className="grid grid-cols-1 gap-6">
                {results.map((subreddit, index) => (
                  <article
                    key={subreddit.id}
                    className="group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:scale-[1.01]">
                      <CardHeader className="space-y-4">
                        {/* Header: Subreddit Info & Relevance Score */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {/* Subreddit Icon */}
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-primary font-bold text-lg">
                                r/
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                {subreddit.displayName}
                              </span>
                              {subreddit.category && (
                                <span className="text-xs text-muted-foreground">
                                  {subreddit.category} •{" "}
                                  {formatDistanceToNow(subreddit.createdAt, {
                                    addSuffix: false,
                                  })}{" "}
                                  old
                                </span>
                              )}
                            </div>
                          </div>

                          <Badge
                            className={cn(
                              "font-semibold border",
                              getRelevanceScoreColor(subreddit.relevanceScore)
                            )}
                          >
                            {subreddit.relevanceScore}% Match
                          </Badge>
                        </div>

                        {/* Description */}
                        <div>
                          <CardDescription className="text-base leading-relaxed">
                            {subreddit.description}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          {/* Community Metrics */}
                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            {/* Subscribers */}
                            <div className="flex items-center gap-1.5">
                              <IconUsers
                                className="size-4 text-primary"
                                aria-hidden="true"
                              />
                              <span className="font-medium text-foreground">
                                {formatSubscribers(subreddit.subscribers)}
                              </span>
                              <span className="text-muted-foreground">
                                members
                              </span>
                            </div>

                            {/* Active Users */}
                            <div className="flex items-center gap-1.5">
                              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                              <span className="font-medium text-foreground">
                                ~{subreddit.activeUsers.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground">
                                online
                              </span>
                            </div>

                            {/* Activity Level */}
                            <Badge
                              className={cn(
                                "font-semibold border gap-1.5",
                                getActivityLevelStyle(subreddit.activityLevel)
                              )}
                            >
                              {getActivityLevelIcon(subreddit.activityLevel)}
                              {getActivityLevelLabel(subreddit.activityLevel)}
                            </Badge>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                              asChild
                              size="sm"
                              className="flex-1 sm:flex-initial"
                            >
                              <a
                                href={subreddit.subredditUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2"
                              >
                                Visit Subreddit
                                <IconExternalLink
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Empty State (after search with no results) */}
          {!isLoading && hasSearched && results.length === 0 && (
            <div className="text-center py-16">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <IconSearch
                  className="size-8 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Subreddits Found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn&apos;t find any relevant subreddits for this website
                right now. Try a different URL or check back later.
              </p>
            </div>
          )}

          {/* Initial State (before any search) */}
          {!isLoading && !hasSearched && (
            <div className="text-center py-16">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <IconSparkles
                  className="size-10 text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3 font-heading">
                Ready to Find Your Communities?
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Enter your website URL above and we&apos;ll analyze it to find
                the most relevant subreddits where your target audience is
                actively engaged.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Enter URL</h4>
                  <p className="text-xs text-muted-foreground">
                    Paste your website or product URL
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">We Analyze</h4>
                  <p className="text-xs text-muted-foreground">
                    Our AI identifies relevant communities
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Start Engaging</h4>
                  <p className="text-xs text-muted-foreground">
                    Join communities and build authority
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upgrade CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20 bg-primary/10 backdrop-blur-sm shadow-xl">
            <CardContent className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
                Want Deeper Subreddit Insights?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Upgrade to Reddinbox Pro for advanced subreddit analytics,
                posting guidelines, optimal timing, and engagement strategies.
                Build authority in the right communities.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  Advanced Analytics
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  Posting Guidelines
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  Optimal Timing
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  Engagement Strategies
                </Badge>
              </div>

              <Link
                href="/auth/register"
                className={cn(
                  "inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300",
                  "shadow-[0_4px_20px_rgba(var(--primary-rgb),0.15)] hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.25)]",
                  "hover:scale-105 hover:-translate-y-0.5",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                Start Free Trial
                <IconArrowRight className="size-6" aria-hidden="true" />
              </Link>

              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
