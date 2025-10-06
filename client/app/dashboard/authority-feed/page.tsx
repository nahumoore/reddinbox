"use client";

import ApprovedCommentsTab from "@/components/dashboard/authority-feed/ApprovedCommentsTab";
import CommentsRepliesTab from "@/components/dashboard/authority-feed/CommentsRepliesTab";
import NewPostsTab from "@/components/dashboard/authority-feed/NewPostsTab";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserWebsites } from "@/stores/user-wesbites";
import {
  IconCheck,
  IconMessage,
  IconMessagePlus,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type TabValue = "new-posts" | "approved-comments" | "comment-replies";

interface Tab {
  value: TabValue;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  {
    value: "new-posts",
    label: "New Posts",
    icon: IconMessagePlus,
  },
  {
    value: "comment-replies",
    label: "Comment Replies",
    icon: IconMessage,
  },
  {
    value: "approved-comments",
    label: "Approved Comments",
    icon: IconCheck,
  },
];

export default function LeadsPage() {
  const { userActiveWebsite } = useUserWebsites();
  const [activeTab, setActiveTab] = useState<TabValue>("new-posts");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="py-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-2xl font-bold">Authority Feed</h1>
          </div>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "bg-white hover:shadow-md transition-all",
            })}
            href="/dashboard/authority-feed/settings"
          >
            <IconSettings className="size-4" />
            Settings
          </Link>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Start building authority on Reddit for content around{" "}
            <b className="text-primary italic">{userActiveWebsite?.name}</b>
          </p>
        </div>
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
      <div>
        {activeTab === "new-posts" && <NewPostsTab />}
        {activeTab === "comment-replies" && <CommentsRepliesTab />}
        {activeTab === "approved-comments" && <ApprovedCommentsTab />}
      </div>
    </div>
  );
}
