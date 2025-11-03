import { cn } from "@/lib/utils";
import {
  IconBulb,
  IconCheck,
  IconPencil,
  IconSparkles,
} from "@tabler/icons-react";

interface Step {
  name: string;
  description: string;
  icon: typeof IconPencil;
}

const STEPS: Step[] = [
  {
    name: "Configure",
    description: "Set up your post details",
    icon: IconPencil,
  },
  {
    name: "Select Idea",
    description: "Choose your favorite",
    icon: IconBulb,
  },
  {
    name: "Edit Post",
    description: "Refine and finalize",
    icon: IconSparkles,
  },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav className="h-full">
      <div className="flex flex-col justify-between gap-6">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const Icon = step.icon;

          return (
            <div key={stepNumber}>
              {/* Step Item */}
              <div
                key={stepNumber}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-lg transition-all cursor-default min-w-[200px]",
                  isActive &&
                    "bg-primary/10 border-t-4 border-primary shadow-sm",
                  isCompleted && "bg-muted/50",
                  !isActive && !isCompleted && "opacity-40"
                )}
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center shrink-0 transition-all",
                    isCompleted && "bg-primary text-primary-foreground",
                    isActive && "bg-primary text-primary-foreground shadow-md",
                    !isCompleted &&
                      !isActive &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <IconCheck className="size-5" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>

                {/* Step Info */}
                <div className="text-center">
                  <h3
                    className={cn(
                      "font-semibold text-sm mb-1",
                      isActive && "text-primary",
                      !isActive && "text-foreground"
                    )}
                  >
                    {step.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {stepNumber < STEPS.length && (
                <div
                  key={`connector-${stepNumber}`}
                  className="flex-1 flex justify-center w-full"
                >
                  <div
                    className={cn(
                      "w-0.5 h-full transition-colors",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
