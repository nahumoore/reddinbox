"use client";

import { useOnboardingForm } from "@/stores/onboarding-form";
import { useUserInfo } from "@/stores/user-info";
import { useEffect, useState } from "react";
import { BrandReddinbox } from "../icons/BrandReddinbox";
import { MagicCard } from "../magicui/magic-card";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";

export default function WelcomeStep() {
  const { setStep, setUserName } = useOnboardingForm();
  const { userInfo } = useUserInfo();

  const [localName, setLocalName] = useState(
    userInfo?.name?.split(" ")[0] || ""
  );

  useEffect(() => {
    setLocalName(userInfo?.name?.split(" ")[0] || "");
  }, [userInfo]);

  const handleContinue = () => {
    setUserName(localName);
    setStep(1);
  };

  return (
    <MagicCard
      gradientColor="oklch(0.65 0.25 35 / 0.15)"
      gradientFrom="oklch(0.65 0.25 35 / 0.8)"
      gradientTo="oklch(0.75 0.15 35 / 0.6)"
      className="p-6 shadow-lg max-w-2xl mx-auto rounded-xl"
    >
      <CardContent className="text-center space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground font-heading leading-tight max-w-md mx-auto">
              Welcome to{" "}
              <span className="text-primary flex items-center gap-2 justify-center">
                <BrandReddinbox className="text-primary w-10 h-10" />
                Reddinbox
              </span>
            </h3>
          </div>

          <div className="space-y-4 max-w-lg mx-auto">
            <p className="text-lg text-muted-foreground">
              Turn conversations into customers, track leads, and scale your
              Reddit marketing!
            </p>

            <div className="space-y-3 pt-2">
              <label
                htmlFor="name-input"
                className="block text-sm font-medium text-muted-foreground text-left"
              >
                Before start, how should we call you?
              </label>
              <Input
                id="name-input"
                type="text"
                placeholder="Enter your name"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="text-center text-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <Button
            size="lg"
            className="w-full sm:w-auto px-10 py-4 text-lg font-semibold shadow-lg"
            onClick={handleContinue}
            disabled={!localName.trim()}
          >
            Get Started
          </Button>
        </div>
      </CardContent>
    </MagicCard>
  );
}
