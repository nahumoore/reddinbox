"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRedditLeads } from "@/stores/reddit-leads";
import { RedditUserInteraction } from "@/types/db-schema";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { EmptyState } from "./EmptyState";
import { InteractionItem } from "./InteractionItem";
import { LoadingState } from "./LoadingState";

export default function InteractionsTab() {
  const { openLead, setOpenLead } = useRedditLeads();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!openLead || openLead.interactions.length > 0) return;

    const getInteractions = async () => {
      const { interactions } = await fetchInteractions(openLead.id);
      setOpenLead({ ...openLead, interactions, isLoadingInteractions: false });

      // Expand all items by default
      setExpandedItems(
        new Set(interactions.map((i: RedditUserInteraction) => i.id))
      );
    };

    getInteractions();
  }, [openLead, setOpenLead]);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (!openLead?.interactions.length) return;

    if (expandedItems.size === openLead.interactions.length) {
      // Collapse all
      setExpandedItems(new Set());
    } else {
      // Expand all
      setExpandedItems(new Set(openLead.interactions.map((i) => i.id)));
    }
  };

  if (!openLead) return null;

  const isLoading = openLead.isLoadingInteractions;
  const interactions = [...openLead.interactions].sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Interaction Timeline</CardTitle>
            <CardDescription>
              All conversations and engagements with this lead
            </CardDescription>
          </div>
          {interactions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAll}
              className="gap-2"
            >
              {expandedItems.size === interactions.length ? (
                <>
                  <IconChevronUp className="size-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <IconChevronDown className="size-4" />
                  Expand All
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <LoadingState />
        ) : interactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {interactions.map((interaction, index) => (
              <InteractionItem
                key={interaction.id}
                interaction={interaction}
                isExpanded={expandedItems.has(interaction.id)}
                onToggle={() => toggleItem(interaction.id)}
                isLast={index === interactions.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const fetchInteractions = async (leadId: string) => {
  try {
    const req = await fetch(`/api/reddit-leads/get-interactions?id=${leadId}`);

    const data = await req.json();
    return data;
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return [];
  }
};
