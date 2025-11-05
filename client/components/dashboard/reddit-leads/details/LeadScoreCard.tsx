"use client";

import {
  getScoreColor,
  getScoreLabel,
} from "@/components/dashboard/reddit-leads/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRedditLeads } from "@/stores/reddit-leads";
import { IconCheck, IconEdit, IconLoader2, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface LeadScoreCardProps {
  leadId: string;
}

export default function LeadScoreCard({ leadId }: LeadScoreCardProps) {
  const { leads, updateLead } = useRedditLeads();
  const lead = leads.find((lead) => lead.id === leadId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState(
    lead?.lead_score?.toString() || "0"
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!lead) return null;

  const scoreColor = getScoreColor(lead.lead_score!);
  const scoreLabel = getScoreLabel(lead.lead_score!);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const score = parseInt(editedScore);
      const response = await fetch("/api/reddit-leads/save-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          field: "lead_score",
          value: score,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score");
      }

      updateLead(leadId, { lead_score: score });
      setIsEditing(false);
      toast.success("Lead score saved successfully");
    } catch (error) {
      toast.error("Failed to save lead score");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lead Score</span>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <IconEdit className="size-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>Overall lead quality assessment</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="score">Score (0-100)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={editedScore}
                onChange={(e) => setEditedScore(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <IconLoader2 className="size-4 mr-1 animate-spin" />
                ) : (
                  <IconCheck className="size-4 mr-1" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setEditedScore(lead.lead_score?.toString() || "0");
                }}
                disabled={isSaving}
              >
                <IconX className="size-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{lead.lead_score}/100</span>
              <span className="text-sm font-medium text-muted-foreground">
                {scoreLabel}
              </span>
            </div>
            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all", scoreColor)}
                style={{ width: `${lead.lead_score}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
