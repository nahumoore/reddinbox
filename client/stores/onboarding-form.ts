import { SubredditData } from "@/types/reddit";
import { create } from "zustand";
export interface WebsiteAnalysis {
  websiteName: string;
  companyDescription: string;
  targetAudience: string;
  keywordsToMonitor: string[];
}

interface OnboardingFormState {
  step: number;
  isLoading: boolean;

  // Step 1: Website Analysis
  userName: string;
  websiteUrl: string;
  websiteAnalysis: WebsiteAnalysis | null;

  // Step 3: Competitors
  targetSubreddits: SubredditData[];

  // Actions
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;

  // Step 1 Actions
  setUserName: (name: string) => void;
  setWebsiteUrl: (url: string) => void;
  setWebsiteAnalysis: (analysis: WebsiteAnalysis) => void;

  // Step 3 Actions
  setTargetSubreddits: (subreddits: SubredditData[]) => void;

  // Reset
  resetForm: () => void;
}

const initialState = {
  step: 0,
  isLoading: false,
  userName: "",
  websiteUrl: "",
  targetSubreddits: [],
  websiteAnalysis: null,
  competitors: [],
};

export const useOnboardingForm = create<OnboardingFormState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setLoading: (isLoading) => set({ isLoading }),

  setUserName: (userName) => set({ userName }),
  setWebsiteUrl: (websiteUrl) => set({ websiteUrl }),
  setWebsiteAnalysis: (websiteAnalysis) => set({ websiteAnalysis }),

  setTargetSubreddits: (targetSubreddits) => set({ targetSubreddits }),

  resetForm: () => set(initialState),
}));
