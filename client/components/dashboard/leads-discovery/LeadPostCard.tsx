import { MarkdownContent } from "@/components/ui/markdown-content";
import { RedditLead } from "@/types/db-schema";
import { LeadCardBase } from "./LeadCardBase";

interface LeadPostCardProps {
  lead: RedditLead;
  className?: string;
  onIgnore?: () => void;
}

export function LeadPostCard({ lead, className, onIgnore }: LeadPostCardProps) {
  const postTitle = lead.content.split("\n")[0];
  const postContent = lead.content.split("\n").slice(1).join("\n");

  return (
    <LeadCardBase lead={lead} className={className} onIgnore={onIgnore}>
      <h3 className="font-heading font-semibold text-base leading-tight mb-3">
        {postTitle}
      </h3>
      {postContent && (
        <MarkdownContent
          content={postContent}
          className="text-muted-foreground"
        />
      )}
    </LeadCardBase>
  );
}
