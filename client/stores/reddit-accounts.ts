import { RedditAccount } from "@/types/db-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RedditAccountsState {
  redditAccounts: RedditAccount[];
  activeRedditAccount: RedditAccount | null;
  isLoadingRedditAccounts: boolean;

  setRedditAccounts: (redditAccounts: RedditAccount[]) => void;
  setActiveRedditAccount: (activeRedditAccount: RedditAccount) => void;
  setIsLoadingRedditAccounts: (isLoadingRedditAccounts: boolean) => void;
}

const initialState = {
  redditAccounts: [],
  activeRedditAccount: null,
  isLoadingRedditAccounts: true,
};

export const useRedditAccounts = create<RedditAccountsState>()(
  persist(
    (set) => ({
      ...initialState,
      setRedditAccounts: (redditAccounts: RedditAccount[]) =>
        set({ redditAccounts }),
      setActiveRedditAccount: (activeRedditAccount: RedditAccount) =>
        set({ activeRedditAccount }),
      setIsLoadingRedditAccounts: (isLoadingRedditAccounts: boolean) =>
        set({ isLoadingRedditAccounts }),
    }),
    { name: "reddit-accounts" }
  )
);
