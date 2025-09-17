"use client";

import { useUserInfo } from "@/stores/user-info";
import { UserInfo } from "@/types/db-schema";
import { useEffect } from "react";

export default function OnboardingLayoutClientPage({
  children,
  userInfo,
}: {
  children: React.ReactNode;
  userInfo: UserInfo;
}) {
  const { setUserInfo, setIsLoadingUserInfo } = useUserInfo();

  useEffect(() => {
    console.log("userInfo", userInfo);

    setUserInfo(userInfo);
    setIsLoadingUserInfo(false);
  }, [userInfo]);

  return <>{children}</>;
}
