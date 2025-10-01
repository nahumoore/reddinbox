"use client";

import { stripeBuyPlanRedirect } from "@/actions/stripe-buy-plan-redirect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";

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

        <div className="rounded-xl border-2 border-primary/20 bg-white/80 backdrop-blur-sm p-6 my-4 shadow-lg">
          <div className="text-center mb-6">
            <div className="mb-4">
              <span className="text-5xl font-bold text-foreground">$39</span>
              <span className="text-muted-foreground text-lg">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cancel anytime. No questions asked!
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">
              What's included:
            </h4>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-start gap-3">
                <Check className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">Profile Optimization</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - Get personalized Reddit profile improvement suggestions
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">Smart Response Generation</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - Create authentic, helpful responses that build authority
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">Subreddit Strategy</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - Discover and prioritize the best communities for your
                    niche
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">Authority Tracking</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - Monitor your reputation and influence growth
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">Lead Discovery & CRM</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - Identify and track potential customers from interactions
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">And much more!</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - We're constantly adding new features
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3">
          <Button
            size="lg"
            className="w-full group font-semibold"
            onClick={handleUpgrade}
            disabled={isLoadingUpgrade}
          >
            Upgrade Now
            <ArrowRight
              className={cn(
                "ml-2 size-4 transition-transform group-hover:translate-x-1",
                isLoadingUpgrade && "animate-spin"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Maybe in another time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
