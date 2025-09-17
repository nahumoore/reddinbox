"use client";

import { useOnboardingForm } from "@/stores/onboarding-form";
import {
  IconBrandReddit,
  IconCheck,
  IconPackage,
  IconVs,
  IconWorld,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Website Analysis",
    description: "Give us your website URL for a quick analysis",
    icon: IconWorld,
  },
  {
    id: 2,
    title: "Product Information",
    description: "What is your product and who is your ideal customer?",
    icon: IconPackage,
  },
  {
    id: 3,
    title: "Competitors",
    description: "Who are your competitors?",
    icon: IconVs,
  },
  {
    id: 4,
    title: "Connect Reddit",
    description: "Authorize your account",
    icon: IconBrandReddit,
  },
];

export default function OnboardingProgress() {
  const { step } = useOnboardingForm();

  return (
    <div className="bg-primary text-primary-foreground p-6 space-y-6 min-h-full">
      <div className="space-y-2">
        <h2 className="text-xl font-heading font-bold">Setup Progress</h2>
        <p className="text-primary-foreground/80 text-sm">
          Complete your onboarding
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((stepItem) => {
          const isCompleted = step > stepItem.id;
          const isCurrent = step === stepItem.id;

          return (
            <motion.div
              key={stepItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stepItem.id * 0.1, duration: 0.3 }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isCurrent
                  ? "bg-primary-foreground/20 backdrop-blur-sm"
                  : isCompleted
                  ? "bg-primary-foreground/10"
                  : "opacity-60"
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isCompleted
                    ? "bg-primary-foreground text-primary"
                    : isCurrent
                    ? "bg-primary-foreground/30 text-primary-foreground border-2 border-primary-foreground/50"
                    : "bg-primary-foreground/20 text-primary-foreground/60"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      <IconCheck className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <stepItem.icon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="flex-1">
                <motion.h3
                  className={`font-medium transition-colors ${
                    isCurrent || isCompleted
                      ? "text-primary-foreground"
                      : "text-primary-foreground/60"
                  }`}
                  animate={isCurrent ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: isCurrent ? Infinity : 0 }}
                >
                  {stepItem.title}
                </motion.h3>
                <p
                  className={`text-sm transition-colors ${
                    isCurrent || isCompleted
                      ? "text-primary-foreground/80"
                      : "text-primary-foreground/50"
                  }`}
                >
                  {stepItem.description}
                </p>
              </div>

              <AnimatePresence>
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-2 h-2 bg-primary-foreground rounded-full"
                  >
                    <motion.div
                      className="w-full h-full bg-primary-foreground rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
