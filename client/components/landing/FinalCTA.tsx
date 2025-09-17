"use client";

import {
  IconBrandReddit,
  IconClock,
  IconTrendingUp,
} from "@tabler/icons-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Urgency Header */}
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
            <IconClock className="w-4 h-4 mr-2" />
            Limited Early Access
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-heading leading-tight max-w-3xl mx-auto">
          Join the Waitlist and Be{" "}
          <span className="text-primary">First to Access</span> Reddinbox
        </h2>

        {/* Problem/Solution Statement */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed font-body">
          Get early access to the CRM built specifically for Reddit marketing.
          Turn conversations into customers with our powerful lead management tools.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2 font-heading">
              97%
            </div>
            <div className="text-sm text-muted-foreground font-body">
              Cold DMs ignored
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2 font-heading">
              73%
            </div>
            <div className="text-sm text-muted-foreground font-body">
              Warm outreach response rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2 font-heading">
              5x
            </div>
            <div className="text-sm text-muted-foreground font-body">
              Higher conversion rate
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-8">
          <p className="text-lg text-muted-foreground mb-4 font-body">
            Join 127+ SaaS founders already on the waitlist
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
            <IconTrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-body">
              15 new signups in the last 24 hours
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col gap-4 justify-center items-center mb-8">
          <Link
            href="/whitelist"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-5 rounded-lg text-xl font-semibold hover:opacity-90 shadow-lg hover:scale-105 hover:shadow-lg transition-all hover:shadow-primary/20 cursor-pointer flex items-center gap-3 justify-center group"
          >
            <IconBrandReddit className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Join Waitlist
          </Link>
          <p className="text-sm text-muted-foreground font-body">
            No credit card required • Launch notification priority
          </p>
        </div>

        {/* Waitlist Benefits */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
          <p className="text-primary font-medium mb-4 font-body">
            <strong>Waitlist Benefits:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3" />
              <span className="font-body">50% off first 3 months</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3" />
              <span className="font-body">
                First access when we launch
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3" />
              <span className="font-body">Free onboarding session</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3" />
              <span className="font-body">
                Exclusive founder community
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
