import { RedditLead } from "@/types/db-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RedditLeadsState {
  redditLeads: RedditLead[];
  focusRedditLead: RedditLead | null;
  isLoadingRedditLeads: boolean;

  setRedditLeads: (redditLeads: RedditLead[]) => void;
  setFocusRedditLead: (focusRedditLead: RedditLead) => void;
  setIsLoadingRedditLeads: (isLoadingRedditLeads: boolean) => void;

  removeLead: (leadId: string) => void;
  updateLead: (leadId: string, leadToUpdate: RedditLead) => void;
}

const initialState = {
  redditLeads: [],
  focusRedditLead: null,
  isLoadingRedditLeads: true,
};

export const useRedditLeads = create<RedditLeadsState>()(
  persist(
    (set) => ({
      ...initialState,
      setRedditLeads: (redditLeads: RedditLead[]) => set({ redditLeads }),
      removeLead: (leadId: string) =>
        set((state) => ({
          redditLeads: state.redditLeads.filter((lead) => lead.id !== leadId),
        })),
      updateLead: (leadId: string, leadToUpdate: RedditLead) =>
        set((state) => ({
          redditLeads: state.redditLeads.map((lead) =>
            lead.id === leadId ? leadToUpdate : lead
          ),
        })),
      setFocusRedditLead: (focusRedditLead: RedditLead) =>
        set({ focusRedditLead }),
      setIsLoadingRedditLeads: (isLoadingRedditLeads: boolean) =>
        set({ isLoadingRedditLeads }),
    }),
    { name: "reddit-leads" }
  )
);
