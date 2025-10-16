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
  CardTitle,
} from "@/components/ui/card";
import { Highlighter } from "@/components/ui/highlighter";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  IconAlertCircle,
  IconArrowRight,
  IconArrowUp,
  IconExternalLink,
  IconLoader2,
  IconSearch,
  IconSparkles,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";

// TypeScript interfaces for type safety
interface RedditConversation {
  id: string;
  subreddit: string;
  postTitle: string;
  postExcerpt: string;
  author: string;
  upvotes: number;
  timestamp: Date;
  matchScore: number;
  postUrl: string;
}

export default function FindRedditCustomersClientPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<RedditConversation[]>([]);
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
      const response = await fetch("/api/free-tools/find-reddit-customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to analyze website");
        setResults([]);
        return;
      }

      // Map API response to RedditConversation interface
      const mappedResults: RedditConversation[] = (data.redditPosts || []).map(
        (post: {
          id: string;
          title: string;
          content: string;
          author: string;
          ups: number;
          reddit_created_at: string;
          reddit_url: string;
          subreddit_name: string;
          similarity: number;
        }) => ({
          id: post.id,
          subreddit: post.subreddit_name,
          postTitle: post.title || "Untitled Post",
          postExcerpt: post.content.slice(0, 300) + "...",
          author: post.author,
          upvotes: post.ups || 0,
          timestamp: new Date(post.reddit_created_at),
          matchScore: Math.round(post.similarity * 100),
          postUrl: post.reddit_url || "#",
        })
      );

      setResults(mappedResults);
    } catch (err) {
      console.error("Error analyzing website:", err);
      setError("Failed to connect to the server. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get match score color
  const getMatchScoreColor = (score: number): string => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
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

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-heading leading-tight max-w-3xl mx-auto">
              Find Your Next Customer On{" "}
              <Highlighter action="underline" color="#ff5700">
                <span className="text-primary">Reddit</span>
                <IconBrandRedditNew className="size-12 -rotate-6 text-primary inline-block ml-2" />
              </Highlighter>
            </h1>

            <h2 className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
              Discover relevant posts where your <b>target customers</b> are
              actively looking for solutions!
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
                      Analyze
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
              We&apos;ll analyze your website and find relevant Reddit
              discussions where you can provide value
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
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
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
                  Most Recent & Relevant Posts Found
                </h2>
                <p className="text-muted-foreground">
                  These Reddit posts match your product and show buying intent.
                </p>
              </div>

              {/* Conversation Cards */}
              <div className="grid grid-cols-1 gap-6">
                {results.map((conversation, index) => (
                  <article
                    key={conversation.id}
                    className="group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:scale-[1.01]">
                      <CardHeader className="space-y-4">
                        {/* Header: Subreddit & Match Score */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold text-sm">
                                r/
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">
                                {conversation.subreddit}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(conversation.timestamp, {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>

                          <Badge
                            className={cn(
                              "font-semibold border",
                              getMatchScoreColor(conversation.matchScore)
                            )}
                          >
                            {conversation.matchScore}% Match
                          </Badge>
                        </div>

                        {/* Post Title */}
                        <div>
                          <CardTitle className="text-xl md:text-2xl font-heading leading-tight mb-2 group-hover:text-primary transition-colors">
                            {conversation.postTitle}
                          </CardTitle>

                          {/* Author */}
                          <div className="mb-3">
                            <span className="text-sm text-muted-foreground">
                              Posted by{" "}
                              <span className="font-medium text-foreground">
                                u/{conversation.author}
                              </span>
                            </span>
                          </div>

                          {/* Post Excerpt */}
                          <CardDescription className="text-base leading-relaxed">
                            {conversation.postExcerpt}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          {/* Engagement Metrics */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <IconArrowUp
                                className="size-4 text-orange-500"
                                aria-hidden="true"
                              />
                              <span className="font-medium">
                                {conversation.upvotes.toLocaleString()} upvotes
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                              asChild
                              size="sm"
                              className="flex-1 sm:flex-initial"
                            >
                              <a
                                href={conversation.postUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2"
                              >
                                View on Reddit
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
                No Conversations Found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn&apos;t find any relevant Reddit conversations for this
                website right now. Try again later or upgrade to set up
                automated monitoring.
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
                Ready to Find Your Customers?
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Enter your website URL above and we&apos;ll analyze it to find
                relevant Reddit conversations where you can authentically engage
                with potential customers.
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
                    Our AI finds relevant conversations
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Start Engaging</h4>
                  <p className="text-xs text-muted-foreground">
                    Join discussions and build relationships
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
                Want Automated Lead Discovery?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Upgrade to Reddinbox Pro for real-time monitoring, unlimited
                searches, unlimited replies, and lead tracking. Never miss a
                potential customer again.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  Real-time Monitoring
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  Unlimited Searches
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  Unlimited Replies
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  Lead Tracking
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
