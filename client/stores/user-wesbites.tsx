import { Website } from "@/types/db-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserWebsitesState {
  userWebsites: Website[];
  userActiveWebsite: Website | null;
  isLoadingUserWebsites: boolean;

  setUserWebsites: (userWebsites: Website[]) => void;
  setUserActiveWebsite: (userActiveWebsite: Website) => void;
  setIsLoadingUserWebsites: (isLoadingUserWebsites: boolean) => void;
}

const initialState = {
  userWebsites: [],
  userActiveWebsite: null,
  isLoadingUserWebsites: true,
};

export const useUserWebsites = create<UserWebsitesState>()(
  persist(
    (set) => ({
      ...initialState,
      setUserWebsites: (userWebsites: Website[]) => set({ userWebsites }),
      setUserActiveWebsite: (userActiveWebsite: Website) =>
        set({ userActiveWebsite }),
      setIsLoadingUserWebsites: (isLoadingUserWebsites: boolean) =>
        set({ isLoadingUserWebsites }),
    }),
    { name: "user-websites" }
  )
);
