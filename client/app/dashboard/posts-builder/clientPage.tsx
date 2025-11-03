"use client";

import IdeaSelectionStep from "@/components/dashboard/posts-builder/IdeaSelectionStep";
import PostConfigurationStep from "@/components/dashboard/posts-builder/PostConfigurationStep";
import PostEditorStep from "@/components/dashboard/posts-builder/PostEditorStep";
import StepIndicator from "@/components/dashboard/posts-builder/StepIndicator";
import {
  PostBuilderConfig,
  postBuilderGenerationStore,
} from "@/stores/post-builder-generation";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconNews } from "@tabler/icons-react";
import { toast } from "sonner";

export default function PostBuilderClientPage() {
  const { userActiveWebsite } = useUserWebsites();
  const {
    step,
    config,
    ideas,
    setStep,
    setIsLoadingIdeas,
    setIsLoadingPostGeneration,
    setIdeas,
    setPost,
  } = postBuilderGenerationStore();

  const handleNext = async () => {
    switch (step) {
      case 1: // Move to step 2 and fetch ideas
        setStep(2);
        setIsLoadingIdeas(true);
        const { ideas: generatedIdeas, error: ideasError } =
          await fetchGenerateIdeas({
            config,
          });
        setIsLoadingIdeas(false);

        if (ideasError) {
          toast.error(ideasError);
          return;
        }

        setIdeas(generatedIdeas);
        break;

      case 2: // Move to step 3 and generate the post
        setStep(3);
        const selectedIdea = ideas.find((idea) => idea.isSelected);
        if (!selectedIdea) {
          toast.error("Please select an idea");
          return;
        }
        setIsLoadingPostGeneration(true);
        const postResponse = await fetchGeneratePost({
          emotion: selectedIdea.emotion,
          topic: selectedIdea.topic,
          coreMessage: selectedIdea.coreMessage,
          userStory: config.story,
        });
        setIsLoadingPostGeneration(false);

        if (postResponse.error) {
          toast.error(postResponse.error);
          return;
        }

        setPost(postResponse);
        break;

      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="py-3">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2 bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-sm">
            <IconNews className="size-6 md:size-7" />
            Posts Builder
          </h1>
        </div>
        <p className="text-muted-foreground font-medium">
          Build and schedule posts to get leads & visibility to{" "}
          <b className="text-primary italic">{userActiveWebsite?.name}</b>
        </p>
      </div>

      <section className="grid grid-cols-4 gap-6">
        {/* Steps */}
        <div className="col-span-1">
          <StepIndicator currentStep={step} />
        </div>

        {/* Content */}
        <main className="col-span-3 min-w-0">
          {step === 1 && <PostConfigurationStep onNext={handleNext} />}
          {step === 2 && <IdeaSelectionStep onNext={handleNext} />}
          {step === 3 && <PostEditorStep onNext={handleNext} />}
        </main>
      </section>
    </div>
  );
}

const fetchGenerateIdeas = async ({
  config,
}: {
  config: PostBuilderConfig;
}) => {
  try {
    const response = await fetch("/api/post-builder/generate-ideas", {
      method: "POST",
      body: JSON.stringify({
        subreddit: config.subreddit,
        story: config.story,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate ideas");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error generating ideas:", error);

    return {
      error:
        error instanceof Error ? error.message : "Failed to generate ideas",
    };
  }
};

const fetchGeneratePost = async ({
  emotion,
  topic,
  coreMessage,
  userStory,
}: {
  emotion: string;
  topic: string;
  coreMessage: string;
  userStory?: string;
}) => {
  try {
    const response = await fetch("/api/post-builder/generate-post", {
      method: "POST",
      body: JSON.stringify({
        emotion,
        topic,
        coreMessage,
        userStory,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate post");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error generating post:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to generate post",
    };
  }
};
