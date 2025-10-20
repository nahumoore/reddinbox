"use client";

import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconChartBar,
  IconSearch,
  IconSparkles,
  IconTarget,
} from "@tabler/icons-react";
import Link from "next/link";

// Free tools configuration - easy to add more tools here
const FREE_TOOLS = [
  {
    id: "find-reddit-customers",
    title: "Find Reddit Customers",
    description:
      "Discover potential customers on Reddit by identifying buying intent in discussions. Connect with your target audience authentically and generate qualified leads.",
    icon: IconSearch,
    href: "/free-tools/find-reddit-customers",
    badge: "Most Popular",
    features: [
      "Search by keywords and intent",
      "Identify buying signals",
      "Export leads for outreach",
    ],
  },
  {
    id: "subreddit-finder",
    title: "Subreddit Finder",
    description:
      "Find the best subreddits for your niche. Analyze community size, engagement rates, and relevance to target the right audiences for your business.",
    icon: IconTarget,
    href: "/free-tools/reddit-subreddit-finder",
    features: [
      "Niche-based recommendations",
      "Engagement metrics",
      "Community activity levels",
    ],
  },
  {
    id: "reddit-profile-optimizer",
    title: "Reddit Profile Optimizer",
    description:
      "Get AI-powered suggestions to optimize your Reddit profile. Build credibility, showcase expertise, and make a strong first impression on potential customers.",
    icon: IconSparkles,
    href: "#",
    badge: "Coming Soon",
    features: [
      "Profile audit & scoring",
      "Bio optimization tips",
      "Authority-building recommendations",
    ],
  },
  {
    id: "engagement-analyzer",
    title: "Engagement Analyzer",
    description:
      "Analyze your Reddit engagement patterns. Track karma growth, comment performance, and identify your most successful contribution strategies.",
    icon: IconChartBar,
    href: "#",
    badge: "Coming Soon",
    features: [
      "Karma tracking over time",
      "Best performing content",
      "Optimal posting times",
    ],
  },
];

export default function FreeToolsPageClient() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-heading leading-tight">
              Free Reddit Marketing <span className="text-primary">Tools</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Powerful, free tools to help you find customers, build authority,
              and grow your presence on Reddit. No signup required to get
              started.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {FREE_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isComingSoon = tool.badge === "Coming Soon";

              return (
                <article key={tool.id} id={tool.id} className="scroll-mt-24">
                  <Card
                    className={cn(
                      "h-full transition-all duration-300",
                      !isComingSoon &&
                        "hover:shadow-lg hover:border-primary/20 hover:scale-[1.02]"
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={cn(
                            "p-3 rounded-lg",
                            isComingSoon ? "bg-muted" : "bg-primary/10"
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-6",
                              isComingSoon
                                ? "text-muted-foreground"
                                : "text-primary"
                            )}
                          />
                        </div>
                        {tool.badge && (
                          <span
                            className={cn(
                              "text-xs font-semibold px-3 py-1 rounded-full",
                              tool.badge === "Most Popular"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : tool.badge === "New"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-heading">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Features List */}
                      <ul className="space-y-2" role="list">
                        {tool.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <svg
                              className="size-5 text-primary flex-shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      {isComingSoon ? (
                        <div className="flex items-center justify-center px-4 py-3 bg-muted text-muted-foreground rounded-lg font-semibold cursor-not-allowed">
                          Coming Soon
                        </div>
                      ) : (
                        <Link
                          href={tool.href}
                          className={cn(
                            "flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold transition-all",
                            "hover:opacity-90 hover:shadow-lg hover:shadow-primary/20",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          )}
                        >
                          Try {tool.title}
                          <IconArrowRight
                            className="size-5"
                            aria-hidden="true"
                          />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
            Want More Advanced Features?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Unlock the full power of Reddit marketing with Reddinbox. Get
            AI-powered replies, automated workflows, CRM integration, and
            advanced analytics.
          </p>
          <Link
            href="/auth/register"
            className={cn(
              "inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all",
              "hover:opacity-90 hover:scale-105 hover:shadow-xl hover:shadow-primary/20",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Start Free Trial
            <IconArrowRight className="size-6" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
