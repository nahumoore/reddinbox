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
import {
  IconAlertCircle,
  IconCheck,
  IconEdit,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PainPointsCard() {
  const { openLead: lead, updateLead } = useRedditLeads();

  const [isEditing, setIsEditing] = useState(false);
  const [editedPainPoints, setEditedPainPoints] = useState(
    lead?.pain_points?.join(", ") || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!lead) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const painPointsArray = editedPainPoints
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await fetch("/api/reddit-leads/save-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          field: "pain_points",
          value: painPointsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save pain points");
      }

      updateLead(lead.id, { pain_points: painPointsArray });
      setIsEditing(false);
      toast.success("Pain points saved successfully");
    } catch (error) {
      toast.error("Failed to save pain points");
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
            <IconAlertCircle className="size-5 text-red-500" />
            Pain Points
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
          Problems and challenges this lead is facing
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="painPoints">Pain Points (comma-separated)</Label>
              <Textarea
                id="painPoints"
                value={editedPainPoints}
                onChange={(e) => setEditedPainPoints(e.target.value)}
                placeholder="e.g., Struggling with X, Frustrated by Y, Need help with Z"
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
                  setEditedPainPoints(lead.pain_points?.join(", ") || "");
                }}
                disabled={isSaving}
              >
                <IconX className="size-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : lead.pain_points && lead.pain_points.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {lead.pain_points.map((point, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-sm px-3 py-1"
              >
                {point}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No pain points identified yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
