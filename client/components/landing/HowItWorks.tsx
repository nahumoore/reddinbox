"use client";

import { cn } from "@/lib/utils";
import {
  IconMessages,
  IconRadar,
  IconTrendingUp,
  IconUserCheck,
} from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { Highlighter } from "../ui/highlighter";
import {
  Step1Illustration,
  Step2Illustration,
  Step3Illustration,
  Step4Illustration,
} from "./HowItWorksIllustrationts";

const steps = [
  {
    step: 1,
    icon: IconUserCheck,
    title: "Analyze Your Business",
    description:
      "We analyze your product and target audience to discover and track the perfect conversations for your niche.",
    benefit: "Build instant credibility",
    illustration: Step1Illustration,
  },
  {
    step: 2,
    icon: IconRadar,
    title: "Find The Right Conversations",
    description:
      "We all your favourite subreddits EVERY HOUR. When someone asks for help, advice, or recommendations in your niche, we instantly capture it for you.",
    benefit: "Never miss an opportunity",
    illustration: Step2Illustration,
  },
  {
    step: 3,
    icon: IconMessages,
    title: "Reply with Authentic & Human Comments",
    description:
      "Create authentic, helpful responses with the main purpose of helping users and build your reputation while mentioning your product naturally.",
    benefit: "Never sound like a spam bot",
    illustration: Step3Illustration,
  },
  {
    step: 4,
    icon: IconTrendingUp,
    title: "Track Authority Growth",
    description:
      "Track each conversation and follow ups to build a relationship and convert them into a lead.",
    benefit: "See your reputation compound",
    illustration: Step4Illustration,
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-24 bg-gradient-to-br from-background to-secondary/20"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-sm">
              How It Works
            </Badge>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-heading max-w-4xl mx-auto">
            Build <span className="text-primary">Recognition</span> That{" "}
            <Highlighter action="underline" color="#ff5700">
              Converts Into Revenue
            </Highlighter>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform industry expertise into systematic lead generation through
            trusted relationships. The <b>anti-spam approach</b> that gets
            better over time.
          </p>
        </div>

        {/* Steps with Split Layout */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Content Side */}
                <div
                  className={`space-y-6 ${
                    index % 2 === 1 ? "lg:col-start-2" : ""
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold">
                      {step.step}
                    </div>
                    <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                      <step.icon className="size-6 text-primary" />
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="text-2xl lg:text-4xl font-bold text-foreground mb-4 font-heading leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                        {step.benefit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual/Image Side */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <div className="relative">
                    {/* Placeholder for Image/Visual */}
                    <div
                      className={cn(
                        "aspect-[4/3] from-primary/5 to-secondary/10 rounded-2xl flex items-center justify-center relative overflow-hidden",
                        index % 2 === 1
                          ? "bg-gradient-to-br"
                          : "bg-gradient-to-tl"
                      )}
                    >
                      {step.illustration && <step.illustration />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Video Section */}
          <div className="mt-32">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-sm">
                  See It In Action
                </Badge>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-4 font-heading">
                Watch How Reddinbox Works
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get a complete walkthrough of how Reddinbox helps you build
                authority and generate leads on Reddit
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-secondary/50 border border-primary/10 transform transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/zfOFv0NiAkI"
                      title="Reddinbox Demo Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
