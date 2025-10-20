"use client";

import ActivityRedditProfile from "@/components/dashboard/reddit-profile/ActivityRedditProfile";
import NoRedditProfile from "@/components/dashboard/reddit-profile/NoRedditProfile";
import SettingsRedditProfile from "@/components/dashboard/reddit-profile/SettingsRedditProfile";
import { IconBrandRedditNew } from "@/components/icons/BrandRedditNew";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { generateRedditAuthUrl } from "@/utils/reddit/generate-auth-url";
import {
  IconActivity,
  IconCalendar,
  IconCoins,
  IconRefresh,
  IconSettings,
  IconTrophy,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

type TabValue = "activity" | "settings";

interface Tab {
  value: TabValue;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  {
    value: "activity",
    label: "Latest Activity",
    icon: IconActivity,
  },
  {
    value: "settings",
    label: "Settings",
    icon: IconSettings,
  },
];

export default function RedditProfilePage() {
  const {
    activeRedditAccount,
    isLoadingRedditAccounts,
    setActiveRedditAccount,
  } = useRedditAccounts();
  const [activeTab, setActiveTab] = useState<TabValue>("activity");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const avatarSrc =
    activeRedditAccount?.snoovatar_img || activeRedditAccount?.icon_img;
  const createdDate = activeRedditAccount?.created_utc
    ? new Date(activeRedditAccount.created_utc * 1000)
    : null;

  const calculateAge = (date: Date) => {
    const now = new Date();

    let years = now.getFullYear() - date.getFullYear();
    let months = now.getMonth() - date.getMonth();
    let days = now.getDate() - date.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
    if (days > 0 || parts.length === 0)
      parts.push(`${days} day${days !== 1 ? "s" : ""}`);

    return parts.join(", ").replace(/, ([^,]*)$/, " and $1");
  };

  const handleRedditReauth = () => {
    const authUrl = generateRedditAuthUrl();
    window.location.href = authUrl;
  };

  const refreshRedditAccountStatistics = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/reddit/profile/refresh", {
        method: "POST",
      });
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setActiveRedditAccount(result.data);
      toast.success("Statistics refreshed successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to refresh Reddit account statistics");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoadingRedditAccounts) {
    return (
      <div className="space-y-6 p-6">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!activeRedditAccount) {
    return <NoRedditProfile />;
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="mb-6">
        <CardContent>
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="size-20">
                <AvatarImage
                  src={avatarSrc || undefined}
                  alt={`${activeRedditAccount.name}'s avatar`}
                />
                <AvatarFallback className="text-lg font-semibold">
                  <IconUser className="size-8" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    u/{activeRedditAccount.name}
                  </h1>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  {activeRedditAccount.public_description}
                </div>

                {createdDate && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <IconCalendar className="size-4" />
                      <span>Age: {calculateAge(createdDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={handleRedditReauth}>
                Re-Authenticate
                <IconBrandRedditNew className="text-primary size-6" />
              </Button>
              <Button
                variant="outline"
                onClick={refreshRedditAccountStatistics}
                disabled={isRefreshing}
              >
                Refresh Statistics
                <IconRefresh
                  className={cn(
                    "text-primary size-6",
                    isRefreshing && "animate-spin"
                  )}
                />
              </Button>
            </div>
          </div>

          <div className="flex items-center divide-x pt-2">
            <div className="flex flex-col items-center justify-center px-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconTrophy className="size-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Total Karma
                </span>
              </div>
              <span className="text-2xl font-bold">
                {activeRedditAccount.total_karma?.toLocaleString() ?? 0}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center px-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <IconTrophy className="size-5 text-secondary-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Link Karma
                </span>
              </div>
              <span className="text-2xl font-bold">
                {activeRedditAccount.link_karma?.toLocaleString() ?? 0}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center px-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <IconTrophy className="size-5 text-secondary-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Comment Karma
                </span>
              </div>
              <span className="text-2xl font-bold">
                {activeRedditAccount.comment_karma?.toLocaleString() ?? 0}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center px-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <IconCoins className="size-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Coins
                </span>
              </div>
              <span className="text-2xl font-bold">
                {activeRedditAccount.coins?.toLocaleString() ?? 0}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center px-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <IconUsers className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Friends
                </span>
              </div>
              <span className="text-2xl font-bold">
                {activeRedditAccount.num_friends?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-1 w-full">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative",
                  "border-b-2 -mb-px cursor-pointer",
                  isActive
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "activity" && <ActivityRedditProfile />}
      {activeTab === "settings" && <SettingsRedditProfile />}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex items-center divide-x border-t pt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-2 flex-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
