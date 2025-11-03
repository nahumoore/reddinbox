"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserWebsites } from "@/stores/user-wesbites";
import { IconCheck, IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function WebsiteOverview() {
  const { userActiveWebsite, setUserActiveWebsite } = useUserWebsites();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTargetAudience, setEditedTargetAudience] = useState("");
  const [editedKeywords, setEditedKeywords] = useState<string[]>([]);
  const [editedExpertise, setEditedExpertise] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");

  const handleEditClick = () => {
    if (userActiveWebsite) {
      setEditedDescription(userActiveWebsite.description || "");
      setEditedTargetAudience(userActiveWebsite.target_audience || "");
      setEditedKeywords(userActiveWebsite.keywords || []);
      setEditedExpertise(userActiveWebsite.expertise || []);
      setKeywordInput("");
      setExpertiseInput("");
      setIsEditMode(true);
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setKeywordInput("");
    setExpertiseInput("");
  };

  const handleSaveClick = async () => {
    if (!userActiveWebsite) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/manage-website/save-changes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website_id: userActiveWebsite.id,
          description: editedDescription,
          target_audience: editedTargetAudience,
          keywords: editedKeywords,
          expertise: editedExpertise,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save changes");
      }

      // Update the local store with the new data
      setUserActiveWebsite(result.data);

      toast.success("Changes saved successfully");
      setIsEditMode(false);
      setKeywordInput("");
      setExpertiseInput("");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (
      trimmed &&
      editedKeywords.length < 5 &&
      !editedKeywords.includes(trimmed)
    ) {
      setEditedKeywords([...editedKeywords, trimmed]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    setEditedKeywords(editedKeywords.filter((_, i) => i !== index));
  };

  const addExpertise = () => {
    const trimmed = expertiseInput.trim();
    if (
      trimmed &&
      editedExpertise.length < 5 &&
      !editedExpertise.includes(trimmed)
    ) {
      setEditedExpertise([...editedExpertise, trimmed]);
      setExpertiseInput("");
    }
  };

  const removeExpertise = (index: number) => {
    setEditedExpertise(editedExpertise.filter((_, i) => i !== index));
  };

  if (!userActiveWebsite) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Target Strategy Section */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">
              Target Strategy
            </h2>
            {!isEditMode ? (
              <Button
                onClick={handleEditClick}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <IconEdit className="size-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancelClick}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isSaving}
                >
                  <IconX className="size-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveClick}
                  size="sm"
                  className="gap-2"
                  disabled={isSaving}
                >
                  <IconCheck className="size-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>

          {/* Website Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Website Description
            </h3>
            {!isEditMode ? (
              userActiveWebsite.description ? (
                <p className="text-sm">{userActiveWebsite.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No website description specified
                </p>
              )
            ) : (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Describe what your website is about..."
                rows={3}
                className="resize-none"
              />
            )}
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Target Audience
            </h3>
            {!isEditMode ? (
              userActiveWebsite.target_audience ? (
                <p className="text-sm">{userActiveWebsite.target_audience}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No target audience specified
                </p>
              )
            ) : (
              <Textarea
                value={editedTargetAudience}
                onChange={(e) => setEditedTargetAudience(e.target.value)}
                placeholder="Describe your target audience..."
                rows={3}
                className="resize-none"
              />
            )}
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Keywords {isEditMode && `(${editedKeywords.length}/5)`}
            </h3>
            {!isEditMode ? (
              userActiveWebsite.keywords &&
              userActiveWebsite.keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userActiveWebsite.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No keywords specified
                </p>
              )
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                    placeholder="Add a keyword..."
                    disabled={editedKeywords.length >= 5}
                  />
                  <Button
                    onClick={addKeyword}
                    variant="outline"
                    size="icon"
                    disabled={
                      !keywordInput.trim() || editedKeywords.length >= 5
                    }
                  >
                    <IconPlus className="size-4" />
                  </Button>
                </div>
                {editedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editedKeywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="gap-1 pr-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(index)}
                          className="ml-1 rounded-sm hover:bg-destructive/20 p-0.5"
                        >
                          <IconX className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Expertise Areas */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Expertise Areas {isEditMode && `(${editedExpertise.length}/5)`}
            </h3>
            {!isEditMode ? (
              userActiveWebsite.expertise &&
              userActiveWebsite.expertise.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userActiveWebsite.expertise.map((area, index) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No expertise areas specified
                </p>
              )
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addExpertise();
                      }
                    }}
                    placeholder="Add an expertise area..."
                    disabled={editedExpertise.length >= 5}
                  />
                  <Button
                    onClick={addExpertise}
                    variant="outline"
                    size="icon"
                    disabled={
                      !expertiseInput.trim() || editedExpertise.length >= 5
                    }
                  >
                    <IconPlus className="size-4" />
                  </Button>
                </div>
                {editedExpertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editedExpertise.map((area, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="gap-1 pr-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        {area}
                        <button
                          onClick={() => removeExpertise(index)}
                          className="ml-1 rounded-sm hover:bg-destructive/20 p-0.5"
                        >
                          <IconX className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
