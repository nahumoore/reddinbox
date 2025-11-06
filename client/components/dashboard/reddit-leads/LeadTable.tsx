import { IconBrandRedditNew } from "@/components/icons/BrandRedditNew";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RedditLeads } from "@/types/db-schema";
import { IconAlertCircle, IconArrowRight } from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import { getScoreColor, getScoreLabel, getStatusConfig } from "./utils";

interface LeadTableProps {
  leads: Partial<RedditLeads>[];
}

export function LeadTable({ leads }: LeadTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-heading font-semibold">User</TableHead>
            <TableHead className="font-heading font-semibold">Status</TableHead>
            <TableHead className="font-heading font-semibold">
              Lead Score
            </TableHead>
            <TableHead className="font-heading font-semibold">
              Pain Points
            </TableHead>
            <TableHead className="font-heading font-semibold text-right">
              Last Interaction
            </TableHead>
            <TableHead className="font-heading font-semibold text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const statusConfig = getStatusConfig(lead.lead_status!);
            const scoreColor = getScoreColor(lead.lead_score!);
            const scoreLabel = getScoreLabel(lead.lead_score!);

            return (
              <TableRow
                key={lead.id}
                className="hover:bg-muted/20 transition-colors"
              >
                {/* Username */}
                <TableCell className="py-6">
                  <div className="flex items-center gap-2">
                    <IconBrandRedditNew className="size-5 text-orange-600 flex-shrink-0" />
                    <span className="font-heading font-semibold text-base">
                      u/{lead.reddit_username}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-6">
                  <Badge
                    variant={statusConfig.variant}
                    className={cn(statusConfig.className, "whitespace-nowrap")}
                  >
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                {/* Lead Score */}
                <TableCell className="py-6">
                  <div className="space-y-2 min-w-[140px]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">
                        {lead.lead_score}/100
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {scoreLabel}
                      </span>
                    </div>
                    <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full transition-all", scoreColor)}
                        style={{ width: `${lead.lead_score}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Pain Points */}
                <TableCell className="py-6">
                  {lead.pain_points && lead.pain_points.length > 0 ? (
                    <div className="space-y-2 max-w-xs">
                      <div className="flex flex-wrap gap-1.5">
                        {lead.pain_points.slice(0, 3).map((painPoint, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs font-medium bg-red-50 text-red-600 border-red-100"
                          >
                            <IconAlertCircle className="size-4 mr-1" />
                            {painPoint}
                          </Badge>
                        ))}
                        {lead.pain_points.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            +{lead.pain_points.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No pain points
                    </span>
                  )}
                </TableCell>

                {/* Last Interaction */}
                <TableCell className="py-6 text-right">
                  <div className="text-sm">
                    {lead.last_interaction_at ? (
                      <>
                        <div className="font-medium">
                          {format(
                            new Date(lead.last_interaction_at),
                            "MMM d, yyyy"
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(lead.last_interaction_at), "h:mm a")}
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-6 text-right">
                  <Link
                    href={`/dashboard/reddit-leads/${lead.id}`}
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className:
                        "flex items-center gap-1.5 hover:scale-105 transition-transform",
                    })}
                  >
                    View Details
                    <IconArrowRight className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
