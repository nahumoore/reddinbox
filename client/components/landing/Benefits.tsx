"use client";
import {
  IconArrowRight,
  IconBrain,
  IconCheck,
  IconMessageCircle,
  IconRocket,
  IconSearch,
  IconShieldCheck,
  IconTarget,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { BrandReddinbox } from "../icons/BrandReddinbox";
import { IconBrandRedditNew } from "../icons/BrandRedditNew";
import { Badge } from "../ui/badge";
import { Highlighter } from "../ui/highlighter";

const comparisons = [
  {
    category: "Content Discovery",
    reddit: {
      icon: IconSearch,
      title: "Manual Scrolling",
      description: "Endless scrolling and broken search to find relevant posts",
      pain: "Hours wasted daily",
    },
    reddinbox: {
      icon: IconBrain,
      title: "AI-Powered Discovery",
      description:
        "Automatically finds and surfaces relevant posts across target subreddits",
      benefit: "10x faster discovery",
    },
  },
  {
    category: "Response Creation",
    reddit: {
      icon: IconMessageCircle,
      title: "Manual Comments",
      description: "Craft each comment from scratch, risk sounding promotional",
      pain: "Time-consuming + risky",
    },
    reddinbox: {
      icon: IconMessageCircle,
      title: "Smart Response Generator",
      description:
        "We generate authentic, helpful responses that build authority naturally and then you approve or reject",
      benefit: "Authority-building in auto-pilot",
    },
  },
  {
    category: "Lead Tracking",
    reddit: {
      icon: IconUsers,
      title: "No System",
      description:
        "Forget who you replied to, miss follow-ups, duplicate efforts",
      pain: "Leads slip through cracks",
    },
    reddinbox: {
      icon: IconUsers,
      title: "Built-in CRM",
      description:
        "Automatically tracks interactions and reminds you when to follow up",
      benefit: "Zero leads lost",
    },
  },
  {
    category: "Lead Quality",
    reddit: {
      icon: IconTarget,
      title: "Noise & Spam",
      description: "Waste time on low-quality posts and irrelevant threads",
      pain: "90% time waste",
    },
    reddinbox: {
      icon: IconTarget,
      title: "AI Lead Qualification",
      description:
        "A feed created specifically for your product and target audience",
      benefit: "Focus only on quality",
    },
  },
  {
    category: "Safety",
    reddit: {
      icon: IconShieldCheck,
      title: "Ban Risk",
      description: "Fear of being banned blocks experimentation and growth",
      pain: "Limited growth potential",
    },
    reddinbox: {
      icon: IconShieldCheck,
      title: "Compliance Guardian",
      description:
        "Built-in safety features ensure you stay within Reddit's rules",
      benefit: "Grow without fear",
    },
  },
];

export default function Benefits() {
  return (
    <section
      className="py-24 bg-gradient-to-br from-secondary/30 to-secondary/10"
      id="benefits"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 uppercase">
            Benefits
          </Badge>
        </div>
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-heading max-w-3xl mx-auto">
            Your{" "}
            <span className="text-primary relative">
              Most Profitable
              <IconBrandRedditNew className="size-12 absolute -top-8 -right-6 rotate-6" />
            </span>{" "}
            Growth Channel...{" "}
            <Highlighter action="underline" color="#ff5700">
              Enhanced
            </Highlighter>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Reddit on their own is a great <b>growth channel</b>, but you can
            take it to the next level{" "}
            <IconRocket className="size-5 inline-block -mt-1" />
          </p>
        </div>

        <div className="space-y-16">
          {comparisons.map((comparison, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16`}
            >
              {/* Problem Side (Reddit) */}
              <div className="flex-1 w-full">
                <div className="bg-card/50 backdrop-blur-sm border border-destructive/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="size-14 bg-destructive/10 rounded-xl flex items-center justify-center">
                        <comparison.reddit.icon className="size-7 text-destructive" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <IconBrandRedditNew className="size-6 text-destructive/70" />
                        <span className="text-sm font-medium text-destructive/70 uppercase tracking-wide">
                          Standard Reddit
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">
                        {comparison.reddit.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {comparison.reddit.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <IconX className="size-5 text-destructive" />
                    <span className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-semibold">
                      {comparison.reddit.pain}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow/Connector */}
              <div className="flex-shrink-0 hidden lg:block">
                <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconArrowRight className="size-6 text-primary" />
                </div>
              </div>

              {/* Solution Side (Reddinbox) */}
              <div className="flex-1 w-full">
                <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>

                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center">
                          <comparison.reddinbox.icon className="size-7 text-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <BrandReddinbox className="size-6 text-primary/70" />
                          <span className="text-sm font-medium text-primary/70 uppercase tracking-wide">
                            Reddinbox
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">
                          {comparison.reddinbox.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {comparison.reddinbox.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <IconCheck className="size-5 text-primary" />
                      <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                        {comparison.reddinbox.benefit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2">
              <IconBrandRedditNew className="size-8 text-destructive/50" />
              <span className="text-lg font-medium text-muted-foreground">
                Manual chaos
              </span>
            </div>
            <IconArrowRight className="size-8 text-primary" />
            <div className="flex items-center gap-2">
              <BrandReddinbox className="size-8 text-primary" />
              <span className="text-lg font-bold text-primary">
                Automated growth
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
