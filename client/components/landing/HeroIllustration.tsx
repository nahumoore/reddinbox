"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import RedditCommentAward from "@/public/landing/reddit-comment-award.png";
import SubredditImageIllustration from "@/public/landing/subreddit-icon-illustration.webp";
import {
  IconArrowDown,
  IconArrowUp,
  IconBookmark,
  IconDots,
  IconInbox,
  IconMessage,
  IconShare,
  IconTrendingUp,
} from "@tabler/icons-react";
import Image from "next/image";
import { IconCurvedArrow } from "../icons/IconCurvedArrow";
import { Badge } from "../ui/badge";
import { Highlighter } from "../ui/highlighter";
import { Separator } from "../ui/separator";
import { SparklesText } from "../ui/sparkles-text";

export default function HeroIllustration() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-12">
        {/* COMMENT REDDIT CARD */}
        <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300 max-w-2xl w-full lg:w-auto">
          {/* Main Post */}
          <div className="px-4 sm:px-6 space-y-3">
            {/* Post Header */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
              <Image
                src={SubredditImageIllustration}
                alt="Subreddit Image Illustration"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">r/Entrepreneur</span>
                  <span>•</span>
                  <span>4h ago</span>
                </div>
                <span className="text-xs text-foreground">
                  u/startupfounder23
                </span>
              </div>
            </div>

            {/* Post Title */}
            <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
              How can I get my first 1000 customers without paid ads?
            </h3>

            {/* Post Content */}
            <p className="text-foreground text-sm leading-relaxed">
              I&apos;ve been building a SaaS for productivity teams for 7
              months. Great product, solid retention, but I&apos;m stuck at 200
              users. Every &quot;growth hack&quot; feels spammy. How did you
              authentically reach your first 1000 customers?
            </p>

            {/* Post Actions */}
            <div className="flex items-center flex-wrap gap-3 sm:gap-4 pt-2">
              <div className="flex items-center space-x-1 group">
                <IconArrowUp className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  17
                </span>
                <IconArrowDown className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <IconMessage className="w-5 h-5" />
                <span className="text-sm font-medium">37</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <IconShare className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">
                  Share
                </span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <IconBookmark className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <IconDots className="w-5 h-5" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Comment Section */}
          <div className="px-4 sm:px-6">
            <div className="flex gap-3 bg-yellow-300/30 border border-yellow-300/50 rounded-lg p-2 relative">
              {/* Comment Content */}
              <div className="flex-1 space-y-2">
                {/* Comment Header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                    <AvatarImage src="/founder.webp" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Strong_Teacher78</span>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>

                {/* Comment Text */}
                <p className="text-sm text-foreground leading-relaxed ml-[40px]">
                  tbh I hit my first 1k by doubling down on 3 repeatable plays:
                  niche communities, targeted 1:1 outreach, and turning customer
                  wins into content and referrals! I&apos;ve been working on
                  this exact problem building{" "}
                  <Highlighter color="#ff5700" action="underline">
                    Reddinbox
                  </Highlighter>
                </p>
                <p className="text-sm text-foreground leading-relaxed ml-[40px]">
                  Start by listing 50 ideal accounts, find the 5–10
                  subreddits/slack channels they hang in, and spend 2 weeks
                  adding value (no pitching) then invite the warmest 5–10 for a
                  short demo. Convert with a small incentive (extended trial or
                  playbook), publish 3 quick case studies + 10 micro-posts from
                  those wins, and ask every happy user for one intro, most of
                  our +800 organic signups came from referrals and community
                  mentions :)
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 pt-1 ml-[40px]">
                  <div className="flex items-center space-x-1 group">
                    <IconArrowUp className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      67
                    </span>
                    <IconArrowDown className="size-4 text-muted-foreground" />
                  </div>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                    Reply
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">2</span>
                    <Image
                      src={RedditCommentAward}
                      alt="Reddit Comment Award"
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
              </div>

              {/* ARROW ICON - Hidden on mobile */}
              <IconCurvedArrow className="hidden lg:block size-24 text-primary/80 absolute bottom-14 -right-30 -rotate-[60deg]" />
            </div>
          </div>
        </Card>

        {/* PROFILE OVERVIEW CARD */}
        <div className="flex items-center justify-center lg:justify-start">
          <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300 overflow-hidden lg:-rotate-1 w-full max-w-md lg:max-w-none">
            <div className="px-6 space-y-4">
              {/* Profile Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/founder.webp" />
                    <AvatarFallback>AF</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Strong_Teacher78
                    </h3>
                    <p className="text-sm text-muted-foreground">Nico More</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 relative">
                  <IconInbox className="w-5 h-5 text-muted-foreground" />
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    7
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground leading-relaxed">
                The best marketing doesn&apos;t feel like marketing ✨
              </p>

              {/* Product Link */}
              <div className="flex justify-between">
                <SparklesText
                  className="flex items-center"
                  sparklesCount={5}
                  colors={{ first: "#ff5700", second: "#ff5700" }}
                >
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-primary text-sm">
                          Reddinbox
                        </h4>
                        <p className="text-xs text-primary">
                          https://reddinbox.com
                        </p>
                      </div>
                    </div>
                  </div>
                </SparklesText>

                {/* Stats */}
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Website views
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium text-foreground">
                      5.7k this week
                    </span>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-green-600 text-green-50 border-none"
                    >
                      <span className="text-xs font-medium">+2.3</span>
                      <IconTrendingUp className="w-3 h-3" />
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
