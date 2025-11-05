"use client";

import { IconBrandRedditNew } from "@/components/icons/BrandRedditNew";
import { useRedditLeads } from "@/stores/reddit-leads";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import LeadStatusCard from "./LeadStatusCard";

export default function LeadHeader() {
  const { openLead: lead } = useRedditLeads();

  if (!lead) return null;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/reddit-leads"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <IconArrowLeft className="size-4" />
        Back to leads
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <IconBrandRedditNew className="size-8 text-orange-600" />
          <div>
            <Link
              href={`https://www.reddit.com/user/${lead.reddit_username}`}
              className="font-heading text-3xl font-bold hover:text-primary transition-colors"
              target="_blank"
            >
              u/{lead.reddit_username}
            </Link>
            <p className="text-muted-foreground">
              Lead Profile &amp; Interactions
            </p>
          </div>
        </div>
        <LeadStatusCard variant="inline" />
      </div>
    </div>
  );
}
