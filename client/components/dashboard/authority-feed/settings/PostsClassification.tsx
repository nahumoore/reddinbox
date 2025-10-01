"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type RedditPostCategory = Database["public"]["Enums"]["reddit_post_category"];

interface CategoryConfig {
  value: RedditPostCategory;
  label: string;
  description: string;
}

const ALL_CATEGORIES: CategoryConfig[] = [
  {
    value: "help_request",
    label: "Help Requests",
    description: "Users asking for help solving problems",
  },
  {
    value: "advice_seeking",
    label: "Advice Seeking",
    description: "Users wanting recommendations or guidance",
  },
  {
    value: "problem_complaint",
    label: "Problems & Complaints",
    description: "Users frustrated with pain points",
  },
  {
    value: "comparison_request",
    label: "Comparisons",
    description: "Users comparing options or tools",
  },
  {
    value: "open_discussion",
    label: "Open Discussion",
    description: "General conversation and opinion sharing",
  },
  {
    value: "success_story",
    label: "Success Stories",
    description: "Users sharing achievements or results",
  },
  {
    value: "experience_share",
    label: "Experience Sharing",
    description: "Personal experiences without specific advice",
  },
  {
    value: "news_update",
    label: "News & Updates",
    description: "Industry news, trends, and changes",
  },
  {
    value: "tool_announcement",
    label: "Tool Announcements",
    description: "Product launches and new features",
  },
  {
    value: "self_promotion",
    label: "Self Promotion",
    description: "Direct pitches and link drops",
  },
  {
    value: "resource_compilation",
    label: "Resource Lists",
    description: "List posts, roundups, and guides",
  },
  {
    value: "other",
    label: "Other",
    description: "Posts that don't fit other categories",
  },
];

export default function PostsClassification() {
  const { userActiveWebsite, setUserActiveWebsite } = useUserWebsites();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [initialCategories, setInitialCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userActiveWebsite) {
      const options = userActiveWebsite.authority_feed_options as {
        post_categories_active?: string[];
      } | null;

      const categories =
        options?.post_categories_active ||
        ALL_CATEGORIES.map((cat) => cat.value);
      setSelectedCategories(categories);
      setInitialCategories(categories);
    }
  }, [userActiveWebsite]);

  const hasChanges =
    JSON.stringify(selectedCategories.sort()) !==
    JSON.stringify(initialCategories.sort());

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const toggleCategory = (categoryValue: string) => {
    const newCategories = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter((v) => v !== categoryValue)
      : [...selectedCategories, categoryValue];

    setSelectedCategories(newCategories);
  };

  const handleSave = async () => {
    if (!userActiveWebsite) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/authority-feed/update-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website_id: userActiveWebsite.id,
          post_categories_active: selectedCategories,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings");
      }

      if (result.data) {
        setUserActiveWebsite(result.data);
      }

      setInitialCategories(selectedCategories);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Posts You Want to See</CardTitle>
          <CardDescription>
            We&apos;re automatically filtering posts for your product, however,
            you can also customize the posts you want to see here!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {ALL_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.value);
            return (
              <div
                key={category.value}
                onClick={() => toggleCategory(category.value)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  "hover:bg-accent/50 hover:border-accent-foreground/20",
                  isSelected && "bg-muted border-muted-foreground/20"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 size-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && (
                    <IconCheck className="size-3 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{category.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {category.description}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
