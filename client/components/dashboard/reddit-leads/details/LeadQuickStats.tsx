"use client";

import { getScoreLabel } from "@/components/dashboard/reddit-leads/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useRedditLeads } from "@/stores/reddit-leads";
import { IconCalendar, IconMessage, IconTrendingUp } from "@tabler/icons-react";
import { format } from "date-fns";

export default function LeadQuickStats() {
  const { openLead: lead } = useRedditLeads();

  if (!lead) return null;

  const scoreLabel = getScoreLabel(lead.lead_score!);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lead Score</p>
              <p className="text-2xl font-bold">{lead.lead_score}/100</p>
              <p className="text-xs text-muted-foreground mt-1">{scoreLabel}</p>
            </div>
            <IconTrendingUp className="size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Interactions</p>
              <p className="text-2xl font-bold">
                {lead.total_interactions_count || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Total messages
              </p>
            </div>
            <IconMessage className="size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">First Contact</p>
              <p className="text-2xl font-semibold">
                {lead.first_interaction_at
                  ? format(new Date(lead.first_interaction_at), "MMM d, yyyy")
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lead.first_interaction_at
                  ? format(new Date(lead.first_interaction_at), "h:mm a")
                  : ""}
              </p>
            </div>
            <IconCalendar className="size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Contact</p>
              <p className="text-2xl font-semibold">
                {lead.last_interaction_at
                  ? format(new Date(lead.last_interaction_at), "MMM d, yyyy")
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lead.last_interaction_at
                  ? format(new Date(lead.last_interaction_at), "h:mm a")
                  : ""}
              </p>
            </div>
            <IconCalendar className="size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
