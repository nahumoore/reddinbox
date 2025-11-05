"use client";

import { cn } from "@/lib/utils";
import {
  IconInfoCircle,
  IconNotes,
  IconTimeline,
} from "@tabler/icons-react";

export type TabValue = "overview" | "interactions" | "notes";

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
  {
    value: "interactions",
    label: "Interactions",
    icon: IconTimeline,
  },
  {
    value: "notes",
    label: "Notes",
    icon: IconNotes,
  },
];

interface LeadTabsProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export default function LeadTabs({ activeTab, onTabChange }: LeadTabsProps) {
  return (
    <div className="border-b">
      <div className="flex gap-1 w-full">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
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
  );
}
