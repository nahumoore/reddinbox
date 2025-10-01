"use client";

import PostsClassification from "@/components/dashboard/authority-feed/settings/PostsClassification";
import PostsPerHour from "@/components/dashboard/authority-feed/settings/PostsPerHour";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconArrowLeft, IconClock, IconFilter } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TabValue = "classification" | "posts-per-hour";

interface Tab {
  value: TabValue;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  {
    value: "classification",
    label: "Posts Classification",
    icon: IconFilter,
  },
  {
    value: "posts-per-hour",
    label: "Posts Per Hour",
    icon: IconClock,
  },
];

export default function AuthorityFeedSettingsPage() {
  const router = useRouter();
  const { userActiveWebsite } = useUserWebsites();
  const [activeTab, setActiveTab] = useState<TabValue>("classification");

  const handleBack = () => {
    router.push("/dashboard/authority-feed");
  };

  return (
    <div className="flex flex-col gap-6 p-6 relative">
      {/* Header */}
      <div className="pb-2">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <IconArrowLeft className="size-4" />
          </Button>
          <h1 className="font-heading text-2xl font-bold">
            Authority Feed Settings
          </h1>
        </div>
        <p className="text-muted-foreground ml-12">
          Configure the authority feed settings you want to see for{" "}
          <b className="text-primary italic">{userActiveWebsite?.name}</b>
        </p>
      </div>

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
      <div className="max-w-4xl">
        {activeTab === "classification" && <PostsClassification />}
        {activeTab === "posts-per-hour" && <PostsPerHour />}
      </div>
    </div>
  );
}
