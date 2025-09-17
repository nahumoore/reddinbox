import { create } from "zustand";

export interface WebsiteAnalysis {
  websiteName: string;
  companyDescription: string;
  keywordsToMonitor: string[];
  idealCustomerProfile: string;
  competitors: string[];
}

export interface SubredditData {
  display_name: string;
  display_name_prefixed: string;
  title: string;
  header_title: string;
  primary_color: string;
  subscribers: number;
  public_description: string;
  community_icon: string;
  url: string;
}

interface OnboardingFormState {
  step: number;
  isLoading: boolean;

  // Step 1: Website Analysis
  userName: string;
  websiteUrl: string;
  websiteAnalysis: WebsiteAnalysis | null;

  // Step 3: Competitors
  competitors: string[];

  // Actions
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;

  // Step 1 Actions
  setUserName: (name: string) => void;
  setWebsiteUrl: (url: string) => void;
  setWebsiteAnalysis: (analysis: WebsiteAnalysis) => void;

  // Step 3 Actions
  setCompetitors: (competitors: string[]) => void;

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

  setCompetitors: (competitors) => set({ competitors }),

  resetForm: () => set(initialState),
}));
