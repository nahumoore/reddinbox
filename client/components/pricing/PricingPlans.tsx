"use client";
import { IconArrowRight, IconCheck, IconStar } from "@tabler/icons-react";
import { AvatarCircles } from "../ui/avatar-circles";
import { Button } from "../ui/button";

const avatars = [
  {
    imageUrl: "/landing/user_1.webp",
  },
  {
    imageUrl: "/landing/user_3.webp",
  },
  {
    imageUrl: "/landing/user_7.jpg",
  },
  {
    imageUrl: "/landing/user_8.jpg",
  },
];

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

export default function PricingPlans({
  ctaLabel,
  onCtaClick,
  ctaLoading,
}: {
  ctaLabel: string;
  ctaLoading?: boolean;
  onCtaClick: () => void;
}) {
  return (
    <div className="relative">
      {/* Background card with glassmorphism effect */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-2xl shadow-primary/10">
        {/* Plan header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              For Reddit growth enthusiasts
            </span>
          </div>

          <div className="mb-6">
            <span className="text-6xl font-bold text-gray-900">$39</span>
            <span className="text-gray-500 ml-2">/monthly</span>
          </div>

          <Button
            disabled={ctaLoading}
            onClick={onCtaClick}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold p-6 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 w-fit mx-auto"
          >
            {ctaLabel}
            <IconArrowRight className="size-4" />
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            Cancel anytime. No questions asked!
          </p>
        </div>

        {/* Features section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-6 text-center">
            What's included:
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
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
        </div>

        {/* Bottom testimonial section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4">
            <AvatarCircles className="w-full sm:w-auto" avatars={avatars} />
            <div className="text-center space-y-1">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((item, index) => (
                  <IconStar
                    key={index}
                    className="size-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                99+ Reddit marketers growing daily
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
