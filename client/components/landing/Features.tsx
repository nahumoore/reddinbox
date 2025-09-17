"use client";

import {
  IconBrain,
  IconBrandReddit,
  IconChartBar,
  IconMessage,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconSearch,
    title: "Smart Lead Discovery",
    description:
      "Find your ideal customers across Reddit with AI-powered discovery.",
    features: [
      "Monitor 100+ communities automatically",
      "Detect real buying intent signals",
      "Track competitor mentions",
      "Understand keyword context",
    ],
  },
  {
    icon: IconBrain,
    title: "Behavioral Insights",
    description: "Understand prospects with AI-powered behavioral analysis.",
    features: [
      "Complete engagement history",
      "AI-powered lead scoring",
      "Communication style analysis",
      "Optimal timing predictions",
    ],
  },
  {
    icon: IconUsers,
    title: "Relationship Building",
    description: "Build authentic connections before you pitch.",
    features: [
      "Smart engagement recommendations",
      "Value-first response templates",
      "Relationship tracking dashboard",
      "Lead warming indicators",
    ],
  },
  {
    icon: IconMessage,
    title: "Intelligent Outreach",
    description: "Convert warm relationships with personalized messaging.",
    features: [
      "Context-aware DM templates",
      "Optimal send-time suggestions",
      "Automated follow-up sequences",
      "Response rate analytics",
    ],
  },
  {
    icon: IconChartBar,
    title: "Reddit CRM",
    description: "Manage your entire Reddit sales pipeline in one place.",
    features: [
      "End-to-end lead tracking",
      "Unified conversation history",
      "ROI and revenue analytics",
      "Team collaboration tools",
    ],
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-heading max-w-2xl mx-auto leading-relaxed">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 rounded-md px-2 shadow-md text-white flex items-center gap-2 w-fit mx-auto">
              Succeed on Reddit
              <IconBrandReddit className="size-12 -rotate-2" />
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From discovery to conversion, Reddinbox provides a complete toolkit
            for turning Reddit interactions into revenue.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            const IconComponent = feature.icon;

            return (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content Side */}
                <div className="flex-1 max-w-xl">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {feature.features.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start gap-4 group"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                          <span className="text-muted-foreground leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Icon Side */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl flex items-center justify-center group hover:scale-105 transition-all duration-500">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500">
                        <IconComponent className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                    <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-primary/10 rounded-full animate-pulse delay-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
