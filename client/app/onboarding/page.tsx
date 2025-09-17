"use client";

import CompetitorsList from "@/components/onboarding/CompetitorsList";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import RedditAuthStep from "@/components/onboarding/RedditAuthStep";
import WebsiteAnalysisStep from "@/components/onboarding/WebsiteAnalysisStep";
import WebsiteInformation from "@/components/onboarding/WebsiteInformation";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabase/client";
import { useOnboardingForm } from "@/stores/onboarding-form";
import { IconArrowLeft } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const stepTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
} as const;

export default function Onboarding() {
  const { step } = useOnboardingForm();

  const [direction, setDirection] = useState(0);
  const [prevStep, setPrevStep] = useState(step);

  if (step !== prevStep) {
    setDirection(step > prevStep ? 1 : -1);
    setPrevStep(step);
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <WebsiteAnalysisStep />;
      case 2:
        return <WebsiteInformation />;
      case 3:
        return <CompetitorsList />;
      case 4:
        return <RedditAuthStep />;
      default:
        return <WelcomeStep />;
    }
  };

  const handleLogout = () => {
    const supabase = supabaseClient();
    supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <main className="relative max-h-screen bg-gradient-to-br from-white to-zinc-200">
      <div className="fixed top-2 left-2">
        <Button variant="outline" onClick={handleLogout}>
          <IconArrowLeft />
          Logout
        </Button>
      </div>

      {step === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-6xl shadow-xl overflow-hidden py-0 max-h-[600px] h-full">
              <div className="flex h-[600px]">
                <div className="w-80 flex-shrink-0">
                  <OnboardingProgress />
                </div>

                <div className="flex-1 bg-white overflow-y-auto relative">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={stepTransition}
                      className="p-8 h-full"
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </main>
  );
}
