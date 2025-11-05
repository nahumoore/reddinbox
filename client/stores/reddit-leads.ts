import { RedditLeads, RedditUserInteraction } from "@/types/db-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type OpenRedditLead = RedditLeads & {
  interactions: RedditUserInteraction[];
  isLoadingInteractions: boolean;
};

interface RedditLeadsState {
  leads: Partial<RedditLeads>[];
  isLoadingRedditLeads: boolean;
  openLead: OpenRedditLead | null;

  setLeads: (leads: Partial<RedditLeads>[]) => void;
  setIsLoadingRedditLeads: (isLoadingRedditLeads: boolean) => void;
  updateLead: (leadId: string, updates: Partial<RedditLeads>) => void;
  setOpenLead: (openLead: OpenRedditLead | null) => void;
}

const initialState = {
  leads: [],
  isLoadingRedditLeads: true,
  openLead: null,
};

export const useRedditLeads = create<RedditLeadsState>()(
  persist(
    (set) => ({
      ...initialState,
      setLeads: (leads: Partial<RedditLeads>[]) => set({ leads }),
      setIsLoadingRedditLeads: (isLoadingRedditLeads: boolean) =>
        set({ isLoadingRedditLeads }),
      updateLead: (leadId: string, updates: Partial<RedditLeads>) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === leadId ? { ...lead, ...updates } : lead
          ),
        })),
      setOpenLead: (openLead: OpenRedditLead | null) => set({ openLead }),
    }),
    {
      name: "reddit-leads",
    }
  )
);
