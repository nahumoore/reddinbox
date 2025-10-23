"use client";

import { useOnboardingForm } from "@/stores/onboarding-form";
import {
  IconArrowRight,
  IconPackage,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function WebsiteInformation() {
  const { websiteAnalysis, setWebsiteAnalysis, setStep } = useOnboardingForm();

  // Local state for form fields
  const [formData, setFormData] = useState({
    websiteName: websiteAnalysis?.websiteName || "",
    companyDescription: websiteAnalysis?.companyDescription || "",
    keywordsToMonitor: websiteAnalysis?.keywordsToMonitor || [],
    targetAudience: websiteAnalysis?.targetAudience || "",
    expertise: websiteAnalysis?.expertise || [],
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [newExpertise, setNewExpertise] = useState("");

  const [errors, setErrors] = useState<{
    websiteName?: string;
    companyDescription?: string;
    keywordsToMonitor?: string;
    targetAudience?: string;
    expertise?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.websiteName.trim()) {
      newErrors.websiteName = "Website name is required";
    }

    if (!formData.companyDescription.trim()) {
      newErrors.companyDescription = "Company description is required";
    }

    if (formData.keywordsToMonitor.length === 0) {
      newErrors.keywordsToMonitor = "At least one keyword is required";
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = "Target audience is required";
    }

    if (formData.expertise.length === 0) {
      newErrors.expertise = "At least one area of expertise is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (
    field: keyof typeof formData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const addKeyword = () => {
    const keyword = newKeyword.trim();
    if (
      keyword &&
      !formData.keywordsToMonitor.includes(keyword) &&
      formData.keywordsToMonitor.length < 5
    ) {
      handleFieldChange("keywordsToMonitor", [
        ...formData.keywordsToMonitor,
        keyword,
      ]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const updatedKeywords = formData.keywordsToMonitor.filter(
      (keyword) => keyword !== keywordToRemove
    );
    handleFieldChange("keywordsToMonitor", updatedKeywords);
  };

  const addExpertise = () => {
    const expertise = newExpertise.trim();
    if (
      expertise &&
      !formData.expertise.includes(expertise) &&
      formData.expertise.length < 5
    ) {
      handleFieldChange("expertise", [
        ...formData.expertise,
        expertise,
      ]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (expertiseToRemove: string) => {
    const updatedExpertise = formData.expertise.filter(
      (expertise) => expertise !== expertiseToRemove
    );
    handleFieldChange("expertise", updatedExpertise);
  };

  const handleKeywordInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleExpertiseInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addExpertise();
    }
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    // Update the onboarding store with the edited data
    setWebsiteAnalysis({
      websiteName: formData.websiteName,
      companyDescription: formData.companyDescription,
      keywordsToMonitor: formData.keywordsToMonitor,
      targetAudience: formData.targetAudience,
      expertise: formData.expertise,
    });

    setStep(3);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative size-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <IconPackage className="size-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Review Your Product Information
            </h1>
            <p className="text-lg text-muted-foreground">
              We&apos;ve analyzed your website. Please review and adjust the
              information below.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Website Name */}
        <div className="space-y-2">
          <Label htmlFor="websiteName">Website/Company Name *</Label>
          <Input
            id="websiteName"
            type="text"
            placeholder="Your company name"
            value={formData.websiteName}
            onChange={(e) => handleFieldChange("websiteName", e.target.value)}
            className={errors.websiteName ? "border-destructive" : ""}
          />
          {errors.websiteName && (
            <p className="text-sm text-destructive">{errors.websiteName}</p>
          )}
        </div>

        {/* Company Description */}
        <div className="space-y-2">
          <Label htmlFor="companyDescription">Company Description *</Label>
          <Textarea
            id="companyDescription"
            placeholder="What does your company do? What products or services do you offer?"
            value={formData.companyDescription}
            onChange={(e) =>
              handleFieldChange("companyDescription", e.target.value)
            }
            className={`min-h-24 ${
              errors.companyDescription ? "border-destructive" : ""
            }`}
          />
          {errors.companyDescription && (
            <p className="text-sm text-destructive">
              {errors.companyDescription}
            </p>
          )}
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience *</Label>
          <Textarea
            id="targetAudience"
            placeholder="Describe your ideal customers or target audience"
            value={formData.targetAudience}
            onChange={(e) =>
              handleFieldChange("targetAudience", e.target.value)
            }
            className={`min-h-24 ${
              errors.targetAudience ? "border-destructive" : ""
            }`}
          />
          {errors.targetAudience && (
            <p className="text-sm text-destructive">{errors.targetAudience}</p>
          )}
        </div>

        {/* Keywords to Monitor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="keywordInput">Relevant Keywords *</Label>
            <span className="text-sm text-muted-foreground">
              {formData.keywordsToMonitor.length}/5
            </span>
          </div>

          {/* Add New Keyword Input */}
          <div className="flex gap-2">
            <Input
              id="keywordInput"
              type="text"
              placeholder="Add a keyword and press Enter"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeywordInputKeyPress}
              disabled={formData.keywordsToMonitor.length >= 5}
              className={`flex-1 ${
                errors.keywordsToMonitor ? "border-destructive" : ""
              }`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addKeyword}
              disabled={
                !newKeyword.trim() || formData.keywordsToMonitor.length >= 5
              }
              className="px-3"
            >
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>
          {formData.keywordsToMonitor.length >= 5 && (
            <p className="text-sm text-muted-foreground">
              Maximum of 5 keywords reached
            </p>
          )}

          {/* Existing Keywords Display */}
          {formData.keywordsToMonitor.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.keywordsToMonitor.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 rounded-full p-1 hover:bg-destructive/20 transition-colors"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {errors.keywordsToMonitor && (
            <p className="text-sm text-destructive">
              {errors.keywordsToMonitor}
            </p>
          )}
        </div>

        {/* Areas of Expertise */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="expertiseInput">Areas of expertise *</Label>
            <span className="text-sm text-muted-foreground">
              {formData.expertise.length}/5
            </span>
          </div>

          {/* Add New Expertise Input */}
          <div className="flex gap-2">
            <Input
              id="expertiseInput"
              type="text"
              placeholder="Add an area of expertise and press Enter"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyPress={handleExpertiseInputKeyPress}
              disabled={formData.expertise.length >= 5}
              className={`flex-1 ${
                errors.expertise ? "border-destructive" : ""
              }`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExpertise}
              disabled={
                !newExpertise.trim() || formData.expertise.length >= 5
              }
              className="px-3"
            >
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>
          {formData.expertise.length >= 5 && (
            <p className="text-sm text-muted-foreground">
              Maximum of 5 areas of expertise reached
            </p>
          )}

          {/* Existing Expertise Display */}
          {formData.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.expertise.map((expertise, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 text-sm"
                >
                  {expertise}
                  <button
                    type="button"
                    onClick={() => removeExpertise(expertise)}
                    className="ml-1 rounded-full p-1 hover:bg-destructive/20 transition-colors"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {errors.expertise && (
            <p className="text-sm text-destructive">
              {errors.expertise}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end py-4">
        <Button onClick={handleContinue} className="px-8" size="lg">
          Continue
          <IconArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
