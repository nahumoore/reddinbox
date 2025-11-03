import { create } from "zustand";

export interface PostBuilderConfig {
  subreddit: string;
  story?: string;
}

export interface PostIdeas {
  emotion: string;
  engagementScore: number;
  topic: string;
  coreMessage: string;
  isSelected: boolean;
}

interface GeneratedPost {
  title: string;
  content: string;
}

interface PostBuilderGenerationState {
  config: PostBuilderConfig;
  ideas: PostIdeas[];
  post: GeneratedPost;
  step: 1 | 2 | 3;
  isLoadingIdeas: boolean;
  isLoadingPostGeneration: boolean;

  setConfig: (config: PostBuilderConfig) => void;
  setIdeas: (ideas: PostIdeas[]) => void;
  setPost: (post: GeneratedPost) => void;
  setStep: (step: 1 | 2 | 3) => void;
  setIsLoadingIdeas: (isLoadingIdeas: boolean) => void;
  setIsLoadingPostGeneration: (isLoadingPostGeneration: boolean) => void;
  reset: () => void;
}

export const postBuilderGenerationStore = create<PostBuilderGenerationState>(
  (set) => ({
    config: {
      subreddit: "",
      story: "",
    },
    ideas: [],
    post: {
      title: "",
      content: "",
    },
    step: 1,
    isLoadingIdeas: false,
    isLoadingPostGeneration: false,
    setConfig: (config) => set({ config }),
    setIdeas: (ideas) => set({ ideas }),
    setPost: (post) => set({ post }),
    setStep: (step) => set({ step }),
    setIsLoadingIdeas: (isLoadingIdeas) => set({ isLoadingIdeas }),
    setIsLoadingPostGeneration: (isLoadingPostGeneration) =>
      set({ isLoadingPostGeneration }),
    reset: () =>
      set({
        config: { subreddit: "", story: "" },
        ideas: [],
        post: { title: "", content: "" },
        step: 1,
        isLoadingIdeas: false,
        isLoadingPostGeneration: false,
      }),
  })
);
