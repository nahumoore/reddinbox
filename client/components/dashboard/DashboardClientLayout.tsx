"use client";

import { useRedditAccounts } from "@/stores/reddit-accounts";
import { useRedditSubreddits } from "@/stores/reddit-subreddits";
import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { useUserInfo } from "@/stores/user-info";
import { useUserWebsites } from "@/stores/user-wesbites";
import {
  RedditAccount,
  RedditSubreddit,
  RedditUserInteraction,
  UserInfo,
  Website,
} from "@/types/db-schema";
import { useEffect } from "react";
import { AppSidebar } from "../sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

export default function DashboardClientLayout({
  children,
  userInfo,
  redditAccounts,
  redditUserInteractions,
  websites,
  subreddits,
}: {
  children: React.ReactNode;
  userInfo: UserInfo;
  redditAccounts: RedditAccount[];
  redditUserInteractions: RedditUserInteraction[];
  websites: Website[];
  subreddits: RedditSubreddit[];
}) {
  // STORES
  const { setUserInfo, setIsLoadingUserInfo } = useUserInfo();
  const {
    setRedditAccounts,
    setActiveRedditAccount,
    setIsLoadingRedditAccounts,
  } = useRedditAccounts();
  const { setUserWebsites, setUserActiveWebsite, setIsLoadingUserWebsites } =
    useUserWebsites();
  const { setRedditUserInteractions, setIsLoadingRedditUserInteractions } =
    useRedditUserInteractions();
  const { setSubreddits, setIsLoadingSubreddits } = useRedditSubreddits();

  // LOAD DATA
  useEffect(() => {
    // USER INFO
    setUserInfo(userInfo);
    setIsLoadingUserInfo(false);

    // REDDIT ACCOUNTS
    setRedditAccounts(redditAccounts);
    setActiveRedditAccount(
      redditAccounts.find((account) => account.is_active)!
    );
    setIsLoadingRedditAccounts(false);

    // REDDIT USER INTERACTIONS
    setRedditUserInteractions(redditUserInteractions);
    setIsLoadingRedditUserInteractions(false);

    // WEBSITES
    setUserWebsites(websites);
    setUserActiveWebsite(websites.find((website) => website.is_active)!);
    setIsLoadingUserWebsites(false);

    // SUBREDDITS
    setSubreddits(subreddits);
    setIsLoadingSubreddits(false);
  }, [userInfo, redditAccounts, websites, redditUserInteractions]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
