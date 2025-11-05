import { IconBrandRedditNew } from "@/components/icons/BrandRedditNew";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RedditLeads } from "@/types/db-schema";
import {
  IconAlertCircle,
  IconArrowRight,
  IconCalendar,
  IconClockHour4,
  IconMessage,
  IconSparkles,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import { getScoreColor, getScoreLabel, getStatusConfig } from "./utils";

interface LeadCardProps {
  lead: Partial<RedditLeads>;
}

export function LeadCard({ lead }: LeadCardProps) {
  const statusConfig = getStatusConfig(lead.lead_status!);
  const scoreColor = getScoreColor(lead.lead_score!);
  const scoreLabel = getScoreLabel(lead.lead_score!);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - User Info & Status */}
          <div className="flex-shrink-0 lg:w-64">
            <div className="flex items-start justify-between lg:flex-col lg:items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <IconBrandRedditNew className="size-5 text-orange-600 flex-shrink-0" />
                  <h3 className="font-heading font-semibold text-lg truncate">
                    u/{lead.reddit_username}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <IconMessage className="size-4" />
                  <span>
                    {lead.total_interactions_count || 0} interaction
                    {(lead.total_interactions_count || 0) !== 1 ? "s" : ""}
                  </span>
                </div>
                <Badge variant={statusConfig.variant} className="mb-4">
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            {/* Lead Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Lead Score</span>
                <span className="font-semibold">{lead.lead_score}/100</span>
              </div>
              <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all", scoreColor)}
                  style={{ width: `${lead.lead_score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {scoreLabel}
              </p>
            </div>
          </div>

          {/* Middle Section - Signals & Pain Points */}
          <div className="flex-1 space-y-4 min-w-0">
            {/* Buying Signals */}
            {lead.buying_signals && lead.buying_signals.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <IconSparkles className="size-4 text-yellow-500" />
                  Buying Signals
                </div>
                <div className="flex flex-wrap gap-2">
                  {lead.buying_signals.map((signal, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs font-medium"
                    >
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pain Points */}
            {lead.pain_points && lead.pain_points.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <IconAlertCircle className="size-4 text-red-500" />
                  Pain Points
                </div>
                <div className="flex flex-wrap gap-2">
                  {lead.pain_points.map((point, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs font-medium"
                    >
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* See more details */}
            <div className="flex justify-end">
              <Link
                href={`/dashboard/reddit-leads/${lead.id}`}
                className={buttonVariants({
                  variant: "default",
                  className:
                    "flex items-center gap-2 hover:scale-105 transition-transform",
                })}
              >
                See more details
                <IconArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Timeline Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-6 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <IconCalendar className="size-4" />
            <span className="font-medium">First interaction:</span>
            <span>
              {lead.first_interaction_at
                ? format(new Date(lead.first_interaction_at), "MMM d, yyyy")
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconClockHour4 className="size-4" />
            <span className="font-medium">Last interaction:</span>
            <span>
              {lead.last_interaction_at
                ? format(new Date(lead.last_interaction_at), "MMM d, yyyy")
                : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
