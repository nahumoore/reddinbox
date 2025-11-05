"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRedditLeads } from "@/stores/reddit-leads";
import { IconCheck, IconEdit, IconLoader2, IconMessage, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ConversationSummaryCard() {
  const { openLead: lead, updateLead } = useRedditLeads();

  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(
    lead?.conversation_summary || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!lead) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/reddit-leads/save-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          field: "conversation_summary",
          value: editedSummary,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save summary");
      }

      updateLead(lead.id, { conversation_summary: editedSummary });
      setIsEditing(false);
      toast.success("Conversation summary saved successfully");
    } catch (error) {
      toast.error("Failed to save conversation summary");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconMessage className="size-5" />
            Conversation Summary
          </div>
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
        <CardDescription>A summary of all interactions</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              placeholder="Enter conversation summary..."
              rows={6}
              className="font-body"
              disabled={isSaving}
            />
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
                  setEditedSummary(lead.conversation_summary || "");
                }}
                disabled={isSaving}
              >
                <IconX className="size-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : lead.conversation_summary ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {lead.conversation_summary}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No conversation summary available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
