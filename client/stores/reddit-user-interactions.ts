import { RedditUserInteraction } from "@/types/db-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RedditUserInteractionsState {
  redditUserInteractions: RedditUserInteraction[];
  isLoadingRedditUserInteractions: boolean;

  setRedditUserInteractions: (
    redditUserInteractions: RedditUserInteraction[]
  ) => void;
  setIsLoadingRedditUserInteractions: (
    isLoadingRedditUserInteractions: boolean
  ) => void;
}

const initialState = {
  redditUserInteractions: [],
  isLoadingRedditUserInteractions: true,
};

export const useRedditUserInteractions = create<RedditUserInteractionsState>()(
  persist(
    (set) => ({
      ...initialState,
      setRedditUserInteractions: (
        redditUserInteractions: RedditUserInteraction[]
      ) => set({ redditUserInteractions }),
      setIsLoadingRedditUserInteractions: (
        isLoadingRedditUserInteractions: boolean
      ) => set({ isLoadingRedditUserInteractions }),
    }),
    { name: "reddit-user-interactions" }
  )
);
