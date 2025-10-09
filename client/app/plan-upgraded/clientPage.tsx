"use client";

import { Confetti } from "@/components/ui/confetti";
import { IconArrowRight, IconCheck, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Profile Optimization",
    description: "Get personalized Reddit profile improvement suggestions",
  },
  {
    title: "Smart Response Generation",
    description: "Create authentic, helpful responses that build authority",
  },
  {
    title: "Subreddit Strategy",
    description: "Discover and prioritize the best communities for your niche",
  },
  {
    title: "Authority Tracking",
    description: "Monitor your reputation and influence growth",
  },
  {
    title: "Lead Discovery & CRM",
    description: "Identify and track potential customers from interactions",
  },
  {
    title: "Automated Scheduling",
    description: "Queue responses and content for optimal timing",
  },
  {
    title: "24/7 Customer Support",
    description: "Get help whenever you need it",
  },
  {
    title: "And much more coming soon!",
    description: "We're constantly adding new features to help you grow",
  },
];

export default function PlanUpgradedPageClient() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center p-4">
      {/* Confetti Effect */}
      <Confetti
        className="absolute inset-0 w-full h-full pointer-events-none z-50"
        options={{
          particleCount: 150,
          spread: 180,
          origin: { y: 0.6 },
          colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
        }}
      />

      <div className="max-w-4xl w-full z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <IconSparkles className="size-5" />
              <span className="font-semibold uppercase text-sm tracking-wide">
                Welcome to Premium
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-xl mx-auto">
            You&apos;re All Set to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Build Authority
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your Reddit growth engine is now active. Start building authentic
            relationships that convert into qualified leads.
          </p>
        </div>

        {/* Features Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-2xl shadow-primary/10 mb-8">
          <h2 className="font-semibold text-gray-900 mb-6 text-center text-2xl">
            You Now Have Access To:
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{feature.title}</span>
                  <span className="text-gray-600">
                    {" "}
                    - {feature.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-8 py-6 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 mx-auto w-fit"
            >
              Start Building Authority
              <IconArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
