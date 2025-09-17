import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { RedditLead } from "@/types/db-schema";

interface LeadScoreBadgeProps {
  lead: RedditLead;
}

function getScoreColor(score: number) {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

function getScoreIntensity(score: number) {
  // Normalize score to 0.4-1.0 range for better visibility
  const normalizedScore = Math.max(0.4, score / 100);
  return normalizedScore;
}

export function LeadScoreBadge({ lead }: LeadScoreBadgeProps) {
  const colorClass = getScoreColor(lead.lead_score);
  const intensity = getScoreIntensity(lead.lead_score);

  const circleElement = (
    <div
      className={cn(
        "relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer",
        colorClass
      )}
      style={{
        opacity: intensity,
        boxShadow: `0 0 0 2px ${
          intensity > 0.7
            ? "rgba(34, 197, 94, 0.2)"
            : intensity > 0.4
            ? "rgba(249, 115, 22, 0.2)"
            : "rgba(239, 68, 68, 0.2)"
        }`,
      }}
    >
      <span className="text-white text-xs font-semibold font-body">
        {lead.lead_score}
      </span>
    </div>
  );

  // If no AI explanation, return just the circle without tooltip
  if (!lead.ai_explanation) {
    return circleElement;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{circleElement}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-xs leading-relaxed">{lead.ai_explanation}</p>
      </TooltipContent>
    </Tooltip>
  );
}
