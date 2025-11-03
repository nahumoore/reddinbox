"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { postBuilderGenerationStore } from "@/stores/post-builder-generation";
import {
  IconCheck,
  IconCopy,
  IconRefresh,
  IconSparkles,
} from "@tabler/icons-react";
import { useState } from "react";

interface PostEditorStepProps {
  onNext: () => void;
}

export default function PostEditorStep({ onNext }: PostEditorStepProps) {
  const { isLoadingPostGeneration, post, setPost, reset } =
    postBuilderGenerationStore();

  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPost = { ...post, title: e.target.value };
    setPost(updatedPost);
  };

  const handleBodyChange = (value?: string) => {
    const updatedPost = { ...post, content: value || "" };
    setPost(updatedPost);
  };

  const handleCopyTitle = async () => {
    if (post.title) {
      await navigator.clipboard.writeText(post.title);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }
  };

  const handleCopyBody = async () => {
    if (post.content) {
      await navigator.clipboard.writeText(post.content);
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  const handleRestart = () => {
    reset();
  };

  return (
    <div className="relative space-y-6">
      {/* Post Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="post-title">Post Title</Label>
          {isLoadingPostGeneration ? null : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyTitle}
              className="h-8 gap-2"
            >
              {copiedTitle ? (
                <>
                  <IconCheck className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <IconCopy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
        {isLoadingPostGeneration ? (
          <div className="relative">
            <Skeleton className="h-10 w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconSparkles className="h-4 w-4 animate-pulse" />
                <span className="animate-pulse">Generating title...</span>
              </div>
            </div>
          </div>
        ) : (
          <Input
            id="post-title"
            value={post.title}
            onChange={handleTitleChange}
            placeholder="Enter your post title..."
            className="text-base font-medium"
          />
        )}
      </div>

      {/* Post Body */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="post-body">Post Body</Label>
          {isLoadingPostGeneration ? null : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyBody}
              className="h-8 gap-2"
            >
              {copiedBody ? (
                <>
                  <IconCheck className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <IconCopy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
        {isLoadingPostGeneration ? (
          <div className="relative">
            <Skeleton className="h-[500px] w-full rounded-md" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <IconSparkles className="h-8 w-8 text-primary animate-pulse" />
              <div className="text-center space-y-1">
                <p className="text-base font-medium text-foreground animate-pulse">
                  Your post is being generated...
                </p>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="markdown-editor" data-color-mode="light">
            <Textarea
              value={post.content}
              onChange={(e) => handleBodyChange(e.target.value)}
              placeholder="Write your post content in markdown..."
              className="bg-white"
            />
          </div>
        )}
      </div>

      {/* Restart Button - Fixed at bottom left */}
      <div className="">
        <Button
          onClick={handleRestart}
          variant="outline"
          size="default"
          className="gap-2 shadow-lg"
        >
          <IconRefresh className="size-4" />
          Create New Post
        </Button>
      </div>
    </div>
  );
}
