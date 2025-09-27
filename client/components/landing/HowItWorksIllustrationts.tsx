"use client";

import SubredditImageIllustration from "@/public/landing/subreddit-icon-illustration.webp";
import {
  IconArrowRight,
  IconCheck,
  IconEye,
  IconMail,
  IconMessage,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card } from "../ui/card";

export const Step1Illustration = () => {
  return (
    <div className="relative w-full h-full rounded-2xl p-8 overflow-hidden">
      <div className="h-full flex flex-col justify-center">
        {/* Input Section */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-card/80 border border-border/30 rounded-lg px-4 py-3">
              <div className="w-8 h-8 bg-primary/10 rounded border border-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm">🏢</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">
                  Your Product
                </div>
                <div className="text-xs text-muted-foreground">
                  SaaS Platform
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Processing Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-primary rounded-full animate-pulse"></div>
              <div className="w-1 h-6 bg-primary/70 rounded-full animate-pulse delay-150"></div>
              <div className="w-1 h-10 bg-primary/90 rounded-full animate-pulse delay-300"></div>
              <div className="w-1 h-4 bg-primary/50 rounded-full animate-pulse delay-450"></div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🎯", label: "Target Subs", value: "6 found" },
              { icon: "👥", label: "Audience", value: "7.9k users" },
              { icon: "💬", label: "Conversations", value: "847 active" },
              { icon: "📊", label: "Match Score", value: "98%" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card/80 border border-border/30 rounded-lg p-3 transform transition-all duration-500 hover:scale-105"
                style={{
                  animationDelay: `${i * 200}ms`,
                  animation: "slideInUp 0.6s ease-out forwards",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-primary/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-secondary/40 rounded-full animate-bounce delay-500"></div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export const Step2Illustration = () => {
  const [currentExample, setCurrentExample] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const examples = [
    {
      subreddit: "r/SaaS",
      author: "u/techfounder",
      timeAgo: "2h ago",
      title: "How do you track your Reddit marketing performance?",
      response: [
        "I track Reddit the same way I track any channel: unique UTMs per campaign + a landing page or promo code, capture post_id/subreddit on the landing form, push that into GA4 and our CRM so every lead is tagged reddit_subreddit_postid.",
        "I've been solving this while building Reddinbox so we automated post-level attribution and it cut misattribution a ton, tbh :)",
      ],
    },
    {
      subreddit: "r/Entrepreneur",
      author: "u/startupgrind",
      timeAgo: "1h ago",
      title: "Best way to find ideal customers on social media?",
      response: [
        "Start by nailing your ICP: job titles, company size and the outcome they pay for. Map 2–3 platforms where they actually hang out, then use platform tools to find them: LinkedIn, Twitter/X, and targeted subreddit/new community searches",
        "I'm heads-down building Reddinbox to solve this exact problem and ngl the biggest wins came from community-first engagement plus short, useful follow-ups :)",
      ],
    },
    {
      subreddit: "r/Marketing",
      author: "u/digitalmarketer",
      timeAgo: "3h ago",
      title: "Anyone having success with community-based marketing strategies?",
      response: [
        "yep, been doubling down on community channels while building Reddinbox, and it’s working but slow and steady. main play: show up with helpful, specific answers (case studies, screenshots, failure postmortems), repurpose threads into blog/email, and follow up in comments with soft CTAs.",
        "Track everything with UTMs + a simple CRM so you can tie conversations to demos.",
      ],
    },
  ];

  const handleIgnore = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Wait for animation to complete before switching examples
    setTimeout(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length);
      setIsAnimating(false);
    }, 300);
  };

  const currentData = examples[currentExample];

  return (
    <div className="relative w-full h-full rounded-2xl p-6 overflow-hidden">
      <div className="h-full flex flex-col justify-center space-y-6">
        {/* REDDIT POST CARD */}
        <Card
          className={`bg-card border border-border hover:shadow-lg transition-all duration-300 ${
            isAnimating
              ? "transform scale-95 opacity-50"
              : "transform scale-100 opacity-100"
          }`}
        >
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
                  <span className="font-medium">{currentData.subreddit}</span>
                  <span>•</span>
                  <span>{currentData.timeAgo}</span>
                </div>
                <span className="text-xs text-foreground">
                  {currentData.author}
                </span>
              </div>
            </div>

            {/* Post Title */}
            <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight mb-4">
              {currentData.title}
            </h3>

            <p className="mb-2 text-sm text-muted-foreground">
              Answering as{" "}
              <span className="font-bold italic">u/Strong_Teacher78</span>:
            </p>

            {/* Text Area */}
            <div className="border border-border/50 rounded-lg p-2">
              {currentData.response.map((paragraph, index) => (
                <p key={index} className={`text-sm ${index > 0 ? "mt-2" : ""}`}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-3">
              <button
                onClick={handleIgnore}
                disabled={isAnimating}
                className="bg-red-500 hover:bg-red-600 border border-border/30 rounded-lg py-3 px-4 text-sm font-medium text-white flex items-center justify-center gap-2 w-fit transition-colors duration-200 disabled:opacity-50"
              >
                Ignore <IconX className="size-4" />
              </button>
              <Link
                href="/auth/register"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 px-8 font-medium shadow-lg flex items-center justify-center gap-2 w-fit uppercase transition-all duration-200 hover:scale-105"
              >
                Post <IconArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const Step3Illustration = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const journeySteps = [
    {
      stage: "startupfounder23 found your reply helpful",
      time: "Day 1",
      action: "Posted a helpful response in r/SaaS",
      result: "15 upvotes, 3 replies",
      status: "completed",
      icon: IconMessage,
    },
    {
      stage: "You're getting noticed",
      time: "Day 5",
      action: "startupfounder23 replied again in another thread",
      result: "Shows continued attention",
      status: "completed",
      icon: IconEye,
    },
    {
      stage: "Ready for Outreach",
      time: "Day 8",
      action: "Multiple interactions with this user in different threads",
      result: "Lead warmed for outreach",
      status: "in-progress",
      icon: IconMail,
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % journeySteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-6 overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Timeline */}
        <div className="relative">
          <div className="space-y-8">
            {journeySteps.map((step, i) => (
              <div key={i} className="relative">
                <div
                  className={`
                  flex items-start gap-4 transition-all duration-500
                  ${i <= activeStep ? "opacity-100" : "opacity-40"}
                `}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`
                    relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm shrink-0
                    ${
                      i <= activeStep
                        ? step.status === "completed"
                          ? "bg-green-500 border-green-500 text-white"
                          : step.status === "in-progress"
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-yellow-500 border-yellow-500 text-white"
                        : "bg-muted border-border text-muted-foreground"
                    }
                  `}
                  >
                    {i <= activeStep ? (
                      step.status === "completed" ? (
                        <IconCheck className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )
                    ) : (
                      i + 1
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-card/80 border border-border/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">
                          {step.stage}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {step.action}
                      </p>
                      <div
                        className={`
                        text-xs font-medium
                        ${
                          step.status === "completed"
                            ? "text-green-600"
                            : step.status === "in-progress"
                            ? "text-primary"
                            : "text-yellow-600"
                        }
                      `}
                      >
                        {step.result}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connecting line between steps (except for last step) */}
                {i < journeySteps.length - 1 && (
                  <div
                    className={`
                      absolute left-4 top-8 w-0.5 bg-border transform -translate-x-0.5 transition-all duration-500
                      ${i < activeStep ? "bg-primary/60" : "bg-border"}
                    `}
                    style={{ height: "calc(100% + 0.5rem)" }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
