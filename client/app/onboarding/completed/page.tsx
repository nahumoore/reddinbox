"use client";

import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useUserInfo } from "@/stores/user-info";
import { IconArrowRight, IconRocket } from "@tabler/icons-react";

export default function OnboardingCompleted() {
  const { userInfo } = useUserInfo();

  const handleContinueToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <main className="relative max-h-screen bg-gradient-to-br from-white to-zinc-200">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <MagicCard
          gradientColor="oklch(0.65 0.25 35 / 0.15)"
          gradientFrom="oklch(0.65 0.25 35 / 0.8)"
          gradientTo="oklch(0.75 0.15 35 / 0.6)"
          className="p-6 shadow-lg max-w-2xl mx-auto rounded-xl"
        >
          <CardContent className="text-center space-y-8">
            <div className="space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <IconRocket className="size-10 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-bold text-foreground font-heading leading-tight max-w-md mx-auto">
                  You&apos;re all set, {userInfo?.name?.split(" ")[0]}!
                </h3>
              </div>

              <div className="space-y-3 max-w-lg mx-auto">
                <p className="text-lg text-muted-foreground">
                  You can start managing your Reddit outreach like a pro
                </p>
              </div>
            </div>

            <div>
              <Button
                size="lg"
                className="w-full sm:w-auto px-10 py-4 text-lg font-semibold shadow-lg"
                onClick={handleContinueToDashboard}
              >
                Continue to Dashboard
                <IconArrowRight className="size-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </MagicCard>
      </div>
    </main>
  );
}
