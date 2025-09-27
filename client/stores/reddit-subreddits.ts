import { RedditSubreddit } from "@/types/db-schema";
import { create } from "zustand";

interface RedditSubredditsStore {
  subreddits: RedditSubreddit[];
  isLoadingSubreddits: boolean;

  setSubreddits: (subreddits: RedditSubreddit[]) => void;
  setIsLoadingSubreddits: (isLoadingSubreddits: boolean) => void;
}

const initialState = {
  subreddits: [],
  isLoadingSubreddits: true,
};

export const useRedditSubreddits = create<RedditSubredditsStore>((set) => ({
  ...initialState,
  setSubreddits: (subreddits) => set({ subreddits }),
  setIsLoadingSubreddits: (isLoadingSubreddits) => set({ isLoadingSubreddits }),
}));
