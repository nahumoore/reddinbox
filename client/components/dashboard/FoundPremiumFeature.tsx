"use client";

import { stripeBuyPlanRedirect } from "@/actions/stripe-buy-plan-redirect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import PricingPlans from "../pricing/PricingPlans";

interface FoundPremiumFeatureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

export default function FoundPremiumFeature({
  open,
  onOpenChange,
  title,
  description,
}: FoundPremiumFeatureProps) {
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);

  const handleUpgrade = async () => {
    setIsLoadingUpgrade(true);
    const url = await stripeBuyPlanRedirect();

    if (url) {
      window.location.href = url;
    } else {
      setIsLoadingUpgrade(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl w-full mx-auto">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
            <Sparkles className="size-7 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center pt-3 text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <PricingPlans
          ctaLabel="Upgrade Now"
          onCtaClick={handleUpgrade}
          ctaLoading={isLoadingUpgrade}
          className="overflow-y-scroll max-h-[60vh]"
        />
      </DialogContent>
    </Dialog>
  );
}
