"use client";

import WebsiteOverview from "@/components/dashboard/manage-website/WebsiteOverview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconInfoCircle, IconWorld } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type TabValue = "overview" | "settings" | "advanced";

interface Tab {
  value: TabValue;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  {
    value: "overview",
    label: "Overview",
    icon: IconInfoCircle,
  },
];

export default function WebsiteManager() {
  const { userActiveWebsite, isLoadingUserWebsites } = useUserWebsites();
  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  if (isLoadingUserWebsites) {
    return (
      <div className="space-y-6 p-6">
        <WebsiteSkeleton />
      </div>
    );
  }

  if (!userActiveWebsite) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="text-center space-y-3">
          <IconWorld className="size-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-medium">No Website Selected</h3>
          <p className="text-sm text-muted-foreground">
            Please select or create a website to manage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${userActiveWebsite.url}`}
                  className="w-8 h-8"
                  alt="Website Icon"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={userActiveWebsite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-all hover:scale-105"
                  >
                    <h1 className="font-heading text-2xl md:text-3xl font-bold">
                      {userActiveWebsite.name}
                    </h1>
                  </Link>
                  <Badge
                    variant={
                      userActiveWebsite.is_active ? "default" : "secondary"
                    }
                    className={cn(
                      userActiveWebsite.is_active
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-400 hover:bg-gray-500"
                    )}
                  >
                    {userActiveWebsite.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground w-8/12">
                  {userActiveWebsite.description}
                </p>
              </div>
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
      {activeTab === "overview" && <WebsiteOverview />}
    </div>
  );
}

function WebsiteSkeleton() {
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <Skeleton className="size-14 rounded-lg" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
