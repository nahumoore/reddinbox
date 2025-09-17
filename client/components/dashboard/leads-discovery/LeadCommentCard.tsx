import { MarkdownContent } from "@/components/ui/markdown-content";
import { RedditLead } from "@/types/db-schema";
import { IconCornerDownRight } from "@tabler/icons-react";
import { LeadCardBase } from "./LeadCardBase";

interface LeadCommentCardProps {
  lead: RedditLead;
  className?: string;
  onIgnore?: () => void;
}

export function LeadCommentCard({ lead, className, onIgnore }: LeadCommentCardProps) {
  return (
    <LeadCardBase lead={lead} className={className} onIgnore={onIgnore}>
      {/* Comment Context */}
      {lead.parent_post_id && (
        <div className="bg-muted/50 border-l-2 border-muted-foreground/20 pl-3 py-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <IconCornerDownRight className="size-3" />
            <span>Replying to post</span>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Context from original post discussion
          </p>
        </div>
      )}

      {/* Comment Content */}
      <div>
        <h3 className="font-heading font-medium text-sm mb-2 text-muted-foreground">
          Comment:
        </h3>
        <MarkdownContent content={lead.content} />
      </div>
    </LeadCardBase>
  );
}
