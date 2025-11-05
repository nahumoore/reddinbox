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
import { IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function NotesTab() {
  const { openLead: lead, updateLead } = useRedditLeads();

  const [notes, setNotes] = useState(lead?.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!lead) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/reddit-leads/save-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          field: "notes",
          value: notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notes");
      }

      updateLead(lead.id, { notes });
      toast.success("Notes saved successfully");
    } catch (error) {
      toast.error("Failed to save notes");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Notes</CardTitle>
        <CardDescription>
          Add your own observations and follow-up reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this lead, follow-up tasks, or any observations..."
          rows={12}
          className="font-body resize-none"
          disabled={isSaving}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setNotes("")}
            disabled={isSaving}
          >
            Clear
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <IconLoader2 className="size-4 mr-2 animate-spin" />}
            Save Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
