"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroIllustration() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: MessageSquare,
      title: "Monitor Reddit",
      description:
        "Track posts and comments for users that potentially are interested in your product",
      badge: "AI-Powered",
      gradient: "from-primary to-accent",
      delay: 0,
      metrics: "10K+ posts tracked daily",
    },
    {
      icon: Users,
      title: "Engage with Leads",
      description:
        "Start warming up users by receiving notifications of their activity, answering their posts and comments",
      badge: "CRM Integration",
      gradient: "from-emerald-500 to-teal-500",
      delay: 0.2,
      metrics: "95% response rate",
    },
    {
      icon: TrendingUp,
      title: "Send Messages",
      description:
        "Once the user knows you, it's warmed up and see you as a potential solution, send them a message",
      badge: "Sales Ready",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.4,
      metrics: "3x conversion boost",
    },
  ];

  // Auto-cycle through steps for visual appeal
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto md:max-w-6xl relative"
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl"
        />
      </div>

      {/* Process Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 mb-12 relative">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: step.delay,
                duration: 0.6,
                ease: "easeOut",
              }}
              className={`relative bg-card/80 backdrop-blur-sm border transition-all duration-500 group h-full ${
                activeStep === index
                  ? "border-primary/50 shadow-xl shadow-primary/10 scale-105"
                  : "border-border"
              } rounded-2xl p-6 overflow-hidden`}
            >
              {/* Animated Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Active Step Glow */}
              <AnimatePresence>
                {activeStep === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl"
                  />
                )}
              </AnimatePresence>

              {/* Icon with enhanced animations */}
              <motion.div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} p-3 mb-4 relative overflow-hidden mx-auto`}
                animate={activeStep === index ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <step.icon className="w-full h-full text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: [-100, 100] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                />
              </motion.div>

              {/* Content with improved typography */}
              <h3 className="font-heading font-bold text-xl mb-3 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Metrics Badge */}
              {/* <motion.div
                className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.delay + 0.3 }}
              >
                <Zap className="w-3 h-3" />
                {step.metrics}
              </motion.div> */}

              {/* Enhanced Arrow Indicator */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-10 top-1/2 transform -translate-y-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: step.delay + 0.6,
                      duration: 0.5,
                    }}
                    className="text-primary/60"
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="w-8 h-8" />
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Enhanced Flow Visualization for Mobile */}
      <div className="lg:hidden flex justify-center items-center mb-10">
        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <motion.div key={index} className="flex items-center">
              <motion.div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index ? "bg-primary scale-125" : "bg-muted"
                }`}
              />
              {index < steps.length - 1 && (
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="text-primary/60 mx-3"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="text-center mt-8 px-4 md:mt-12 md:px-0"
      >
        <p className="text-muted-foreground text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Let&apos;s be honest, no one likes cold DMs. We&apos;ll track your
          leads so you can engage with them before starting a conversation.
        </p>
      </motion.div>
    </motion.div>
  );
}
