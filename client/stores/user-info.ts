import { UserInfo } from "@/types/db-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfoState {
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  setUserInfo: (userInfo: UserInfo) => void;
  setIsLoadingUserInfo: (isLoadingUserInfo: boolean) => void;
}

const initialState = {
  userInfo: null,
  isLoadingUserInfo: true,
};

export const useUserInfo = create<UserInfoState>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
      setIsLoadingUserInfo: (isLoadingUserInfo: boolean) =>
        set({ isLoadingUserInfo }),
    }),
    {
      name: "user-info",
    }
  )
);
