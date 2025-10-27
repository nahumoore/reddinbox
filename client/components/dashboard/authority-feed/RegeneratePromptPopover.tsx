"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { RedditUserInteraction } from "@/types/db-schema";
import { IconSparkles } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface GenerationHistory {
  comment: string;
  instructions?: string;
  timestamp: string;
}

interface RegeneratePromptPopoverProps {
  interaction: RedditUserInteraction;
  onCommentGenerated: (comment: string) => void;
  onRegeneratingChange?: (isRegenerating: boolean) => void;
  disabled?: boolean;
}

export function RegeneratePromptPopover({
  interaction,
  onCommentGenerated,
  onRegeneratingChange,
  disabled,
}: RegeneratePromptPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<
    GenerationHistory[]
  >([]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    onRegeneratingChange?.(true);
    setIsOpen(false);
    const response = await fetchGenerateComment({
      interaction_id: interaction.id,
      user_name: interaction.interacted_with_reddit_username,
      custom_instructions: customInstructions || undefined,
      generation_history: generationHistory,
    });
    setIsGenerating(false);
    onRegeneratingChange?.(false);

    if (response.error) {
      console.error("Error generating comment:", response.error);
      toast.error("Failed to generate comment", {
        description: response.error,
      });
      return;
    }

    // ADD NEW GENERATION TO HISTORY
    const newGeneration: GenerationHistory = {
      comment: response.comment,
      instructions: customInstructions || undefined,
      timestamp: new Date().toISOString(),
    };
    setGenerationHistory([...generationHistory, newGeneration]);

    onCommentGenerated(response.comment);
    setIsOpen(false);
    setCustomInstructions("");
  };

  const exampleInstructions =
    "Make it more casual and friendly, use emojis if appropriate";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isGenerating}
          className="rounded-l-none border border-muted border-l-0 px-8 h-auto self-stretch bg-zinc-50"
        >
          <IconSparkles className="size-5 text-primary fill-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Regenerate Response</h4>
            <p className="text-xs text-muted-foreground">
              Add custom instructions to refine the AI-generated response
              (optional)
            </p>
          </div>

          <div className="space-y-2">
            <Textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder={exampleInstructions}
              className="min-h-24 resize-none text-sm"
              disabled={isGenerating}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRegenerate}
              className="flex-1 gap-2"
              size="sm"
              disabled={isGenerating}
            >
              <IconSparkles className="size-4" />
              {isGenerating ? "Generating..." : "Regenerate"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const fetchGenerateComment = async ({
  interaction_id,
  user_name,
  custom_instructions,
  generation_history,
}: {
  interaction_id: string;
  user_name: string;
  custom_instructions?: string;
  generation_history: GenerationHistory[];
}) => {
  try {
    const response = await fetch("/api/ai/generate-comment", {
      method: "POST",
      body: JSON.stringify({
        interactionId: interaction_id,
        userName: user_name,
        customInstructions: custom_instructions,
        generationHistory: generation_history,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error generating comment:", error);
    return {
      error: "Failed to generate comment",
    };
  }
};
