"use client";

import { useRouter } from "next/navigation";
import PricingPlans from "../pricing/PricingPlans";
import { Badge } from "../ui/badge";

export default function Pricing() {
  const router = useRouter();

  const handleUpgrade = async () => {
    router.push("/auth/register");
  };

  return (
    <section
      className="py-24 bg-gradient-to-br from-background to-secondary/20"
      id="pricing"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-sm">
              Pricing
            </Badge>
          </div>

          <h2 className="text-4xl font-bold text-foreground mb-4">
            Build Reddit Authority on
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {" "}
              Auto-Pilot
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reddinbox helps you build genuine authority and generate quality
            leads through authentic Reddit community engagement.
          </p>
        </div>

        <PricingPlans
          ctaLabel="Get Started for Free"
          onCtaClick={handleUpgrade}
        />
      </div>
    </section>
  );
}
