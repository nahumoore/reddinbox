"use client";

import InteractionsTab from "@/components/dashboard/reddit-leads/details/InteractionsTab";
import LeadHeader from "@/components/dashboard/reddit-leads/details/LeadHeader";
import LeadOverview from "@/components/dashboard/reddit-leads/details/LeadOverview";
import LeadQuickStats from "@/components/dashboard/reddit-leads/details/LeadQuickStats";
import LeadTabs, {
  TabValue,
} from "@/components/dashboard/reddit-leads/details/LeadTabs";
import NotesTab from "@/components/dashboard/reddit-leads/details/NotesTab";
import { useRedditLeads } from "@/stores/reddit-leads";
import { RedditLeads } from "@/types/db-schema";
import { useEffect, useState } from "react";

export default function LeadDetailsClient({ id }: { id: string }) {
  const { leads, setOpenLead } = useRedditLeads();

  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  useEffect(() => {
    const lead = leads.find((lead) => lead.id === id) as RedditLeads;
    setOpenLead({ ...lead, interactions: [], isLoadingInteractions: true });
  }, [id, leads, setOpenLead]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <LeadHeader />

      <LeadQuickStats />

      <LeadTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && <LeadOverview />}
      {activeTab === "interactions" && <InteractionsTab />}
      {activeTab === "notes" && <NotesTab />}
    </div>
  );
}
