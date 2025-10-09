"use client";

import { stripeBuyPlanRedirect } from "@/actions/stripe-buy-plan-redirect";
import PricingPlans from "@/components/pricing/PricingPlans";
import { Badge } from "@/components/ui/badge";
import { supabaseClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function SubscriptionEndedPageClient() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    const url = await stripeBuyPlanRedirect();
    if (url) {
      window.location.href = url;
    } else {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const supabase = supabaseClient();
    supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <div className="bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-sm">
              Subscription Paused
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Your Reddit Authority Is{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              On Hold
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            While you&apos;re paused, your competitors are building
            relationships in the communities where your prospects need solutions
          </p>
        </div>

        {/* Pricing Card */}
        <PricingPlans
          ctaLabel="Become a Premium Member"
          onCtaClick={handleUpgrade}
          ctaLoading={isLoading}
        />

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Questions?{" "}
          <button
            onClick={handleLogout}
            className="text-primary hover:underline"
          >
            Sign out
          </button>{" "}
          or reach out for help
        </p>
      </div>
    </div>
  );
}
