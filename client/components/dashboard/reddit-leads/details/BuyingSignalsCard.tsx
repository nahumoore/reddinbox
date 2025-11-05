"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRedditLeads } from "@/stores/reddit-leads";
import { IconCheck, IconEdit, IconLoader2, IconSparkles, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BuyingSignalsCard() {
  const { openLead: lead, updateLead } = useRedditLeads();

  const [isEditing, setIsEditing] = useState(false);
  const [editedSignals, setEditedSignals] = useState(
    lead?.buying_signals?.join(", ") || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!lead) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const signalsArray = editedSignals
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await fetch("/api/reddit-leads/save-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          field: "buying_signals",
          value: signalsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save buying signals");
      }

      updateLead(lead.id, { buying_signals: signalsArray });
      setIsEditing(false);
      toast.success("Buying signals saved successfully");
    } catch (error) {
      toast.error("Failed to save buying signals");
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
            <IconSparkles className="size-5 text-yellow-500" />
            Buying Signals
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
        <CardDescription>
          Key indicators that this lead is ready to buy
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="signals">Buying Signals (comma-separated)</Label>
              <Textarea
                id="signals"
                value={editedSignals}
                onChange={(e) => setEditedSignals(e.target.value)}
                placeholder="e.g., Looking for solution, Budget mentioned, Timeline discussed"
                rows={4}
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
                  setEditedSignals(lead.buying_signals?.join(", ") || "");
                }}
                disabled={isSaving}
              >
                <IconX className="size-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : lead.buying_signals && lead.buying_signals.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {lead.buying_signals.map((signal, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-sm px-3 py-1"
              >
                {signal}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No buying signals identified yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
