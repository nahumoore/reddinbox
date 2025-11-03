import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { postBuilderGenerationStore } from "@/stores/post-builder-generation";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";

interface IdeaSelectionStepProps {
  onNext: () => void;
}

// Emotion to emoji mapping
const emotionEmojis: Record<string, string> = {
  joy: "😊",
  excitement: "🎉",
  surprise: "😮",
  anger: "😠",
  frustration: "😤",
  sadness: "😢",
  fear: "😨",
  curiosity: "🤔",
  inspiration: "💡",
  determination: "💪",
  pride: "🏆",
  relief: "😌",
  nostalgia: "🥹",
  empathy: "🤝",
  confidence: "😎",
  hope: "🌟",
};

// Helper to get emoji for emotion
const getEmotionEmoji = (emotion: string): string => {
  const normalized = emotion.toLowerCase().trim();
  return emotionEmojis[normalized] || "💭";
};

// Helper to get color classes based on engagement score
const getEngagementScoreColor = (score: number): string => {
  if (score >= 9) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 7) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 5) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-orange-600 bg-orange-50 border-orange-200";
};

export default function IdeaSelectionStep({ onNext }: IdeaSelectionStepProps) {
  const { ideas, isLoadingIdeas, setStep, setIdeas } = postBuilderGenerationStore();
  const ideaSelected = ideas.find((idea) => idea.isSelected);

  const handleIdeaSelect = (index: number) => {
    const updatedIdeas = ideas.map((idea, i) => ({
      ...idea,
      isSelected: i === index,
    }));
    setIdeas(updatedIdeas);
  };

  const handleNext = () => {
    if (ideaSelected) {
      onNext();
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          Choose Your Angle
        </CardTitle>
        <CardDescription className="text-base">
          Select the approach that resonates most with your story
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Ideas List */}
          <div className="space-y-3">
            {ideas.map((idea, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleIdeaSelect(index)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                    idea.isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Indicator */}
                    <div
                      className={cn(
                        "mt-1 size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                        idea.isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {idea.isSelected && (
                        <IconCheck className="size-3 text-primary-foreground" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header with Topic and Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-lg font-semibold leading-snug flex-1">
                          {idea.topic}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Emotion Badge */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border">
                            <span className="text-base leading-none">
                              {getEmotionEmoji(idea.emotion)}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground capitalize">
                              {idea.emotion}
                            </span>
                          </div>
                          {/* Engagement Score Badge */}
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-full border font-semibold text-xs",
                              getEngagementScoreColor(idea.engagementScore)
                            )}
                          >
                            {idea.engagementScore}/10
                          </div>
                        </div>
                      </div>

                      {/* Core Message */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {idea.coreMessage}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading States */}
            {isLoadingIdeas && (
              <>
                {ideas.length === 0 ? (
                  // Full skeleton when no ideas yet
                  <>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="p-4 rounded-lg border-2 border-border"
                      >
                        <div className="flex items-start gap-4">
                          <Skeleton className="size-5 rounded-full shrink-0 mt-1" />
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <Skeleton className="h-6 w-2/3" />
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-7 w-20 rounded-full" />
                                <Skeleton className="h-7 w-12 rounded-full" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-4/5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  // Loading indicator at the end when ideas exist
                  <div className="p-4 rounded-lg border-2 border-dashed border-border bg-muted/20">
                    <div className="flex items-center justify-center gap-3 py-2">
                      <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Generating more ideas...
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={handleBack} size="lg">
              <IconArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!ideaSelected}
              size="lg"
            >
              Generate Post
              <IconArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
