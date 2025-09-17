"use client";

import { useRedditAccounts } from "@/stores/reddit-accounts";
import { useRedditLeads } from "@/stores/reddit-leads";
import { useUserInfo } from "@/stores/user-info";
import { useUserWebsites } from "@/stores/user-wesbites";
import {
  RedditAccount,
  RedditLead,
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
  redditLeads,
  websites,
}: {
  children: React.ReactNode;
  userInfo: UserInfo;
  redditAccounts: RedditAccount[];
  redditLeads: RedditLead[];
  websites: Website[];
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
  const { setRedditLeads, setIsLoadingRedditLeads } = useRedditLeads();

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

    // REDDIT LEADS
    setRedditLeads(redditLeads);
    setIsLoadingRedditLeads(false);

    // WEBSITES
    setUserWebsites(websites);
    setUserActiveWebsite(websites.find((website) => website.is_active)!);
    setIsLoadingUserWebsites(false);
  }, [userInfo, redditAccounts, websites, redditLeads]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
