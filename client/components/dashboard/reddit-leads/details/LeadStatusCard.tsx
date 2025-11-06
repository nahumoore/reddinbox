"use client";

import { getStatusConfig } from "@/components/dashboard/reddit-leads/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRedditLeads } from "@/stores/reddit-leads";
import { IconCheck, IconEdit, IconLoader2, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface LeadStatusCardProps {
  variant?: "inline" | "card";
}

export default function LeadStatusCard({
  variant = "inline",
}: LeadStatusCardProps) {
  const { openLead: lead, updateLead } = useRedditLeads();

  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(lead?.lead_status || "new");
  const [isSaving, setIsSaving] = useState(false);

  if (!lead) return null;

  const statusConfig = getStatusConfig(lead.lead_status!);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/reddit-leads/save-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          field: "lead_status",
          value: editedStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save status");
      }

      updateLead(lead.id, { lead_status: editedStatus });
      setIsEditing(false);
      toast.success("Lead status saved successfully");
    } catch (error) {
      toast.error("Failed to save lead status");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedStatus(lead.lead_status!);
  };

  return (
    <Card
      className={cn(
        "flex flex-col gap-2 p-0",
        variant === "inline" && "flex-row"
      )}
    >
      <CardContent className="flex items-center gap-2 p-4">
        <span className="text-sm font-bold">Status:</span>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Select
              value={editedStatus}
              onValueChange={(value) =>
                setEditedStatus(value as typeof editedStatus)
              }
              disabled={isSaving}
            >
              <SelectTrigger className="w-[180px] h-9 bg-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="not_interested">Not Interested</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="default"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconCheck className="size-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <IconX className="size-4" />
            </Button>
          </div>
        ) : (
          <>
            <Badge
              variant={statusConfig.variant}
              className={cn(statusConfig.className, "text-sm px-3 py-1")}
            >
              {statusConfig.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <IconEdit className="size-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
