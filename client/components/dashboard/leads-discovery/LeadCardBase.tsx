import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRedditLeads } from "@/stores/reddit-leads";
import { RedditLead } from "@/types/db-schema";
import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconClock,
  IconExternalLink,
  IconMessage,
} from "@tabler/icons-react";
import Link from "next/link";
import { ReactNode } from "react";
import { LeadCardFooterSection } from "./LeadCardFooterSection";
import { LeadScoreBadge } from "./LeadScoreBadge";

interface LeadCardBaseProps {
  lead: RedditLead;
  className?: string;
  children: ReactNode;
  onIgnore?: () => void;
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function LeadCardBase({
  lead,
  className,
  children,
  onIgnore,
}: LeadCardBaseProps) {
  const { setFocusRedditLead } = useRedditLeads();
  const avatarFallback = lead.reddit_author.substring(0, 2).toUpperCase();

  const isContacted = lead.status === "contacted";

  return (
    <Card
      className={cn(
        "h-fit hover:shadow-md transition-shadow",
        isContacted && "border-green-500 bg-green-50/50",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src="" alt={lead.reddit_author} />
              <AvatarFallback className="text-xs font-medium">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  u/{lead.reddit_author}
                </span>
                {isContacted ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <IconCheck className="size-3" />
                    <span>Contacted</span>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      onClick={() => setFocusRedditLead(lead)}
                      variant="outline"
                      size="icon"
                      className="size-6"
                      title="Contact lead"
                    >
                      <IconMessage className="size-4 hover:text-primary transition-colors" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                r/{lead.subreddit}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {lead.reddit_url && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={lead.reddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on Reddit"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  <IconExternalLink />
                </Link>
              </Button>
            )}
            <LeadScoreBadge lead={lead} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {children}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <IconArrowUp className="size-3" />
            <span>{lead.ups || 0}</span>
          </div>
          {lead.downs !== null && (
            <div className="flex items-center gap-1">
              <IconArrowDown className="size-3" />
              <span>{lead.downs}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <IconClock className="size-3" />
            <span>{formatTimeAgo(lead.reddit_created_at)}</span>
          </div>
        </div>

        <LeadCardFooterSection lead={lead} />
      </CardContent>
    </Card>
  );
}
