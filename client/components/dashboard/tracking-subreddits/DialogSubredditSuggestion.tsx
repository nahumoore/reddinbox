"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubredditData } from "@/types/reddit";
import {
  IconLoader2,
  IconPlus,
  IconSearch,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SearchResult extends SubredditData {
  id: string;
}

export default function DialogSubredditSuggestion({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] =
    useState<SearchResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchSubreddits = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setIsPopoverOpen(true);
    try {
      const response = await fetch("/api/reddit/subreddits/search-subreddits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error("Failed to search subreddits");
        setSearchResults([]);
      } else {
        setSearchResults(data.subreddits);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search subreddits");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSubreddits(searchQuery);
      } else {
        setIsPopoverOpen(false);
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchSubreddits]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopoverOpen]);

  const selectSubreddit = (subreddit: SearchResult) => {
    setSelectedSubreddit(subreddit);
    setSearchQuery("");
    setSearchResults([]);
    setIsPopoverOpen(false);
    setHasSearched(false);
  };

  const removeSelection = () => {
    setSelectedSubreddit(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleSubmit = async () => {
    if (!selectedSubreddit) {
      toast.error("Please select a subreddit");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reddit/subreddits/suggest-subreddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subreddit: selectedSubreddit }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else if (data.message) {
        toast.success("Subreddit suggestion submitted successfully!", {
          description: data.message,
        });
        onOpenChange(false);
        // Reset state
        setSelectedSubreddit(null);
        setSearchQuery("");
        setSearchResults([]);
        setHasSearched(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit suggestion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Suggest a Subreddit</DialogTitle>
          <DialogDescription>
            Submit a subreddit suggestion for review. We&apos;ll notify you
            within approximately one hour once we&apos;ve made a decision.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="subredditSearch">Search Subreddit</Label>
            <div className="relative">
              <div className="relative">
                <Input
                  ref={inputRef}
                  id="subredditSearch"
                  placeholder={
                    selectedSubreddit
                      ? "Subreddit selected"
                      : "Type to search subreddits..."
                  }
                  value={searchQuery}
                  onChange={handleInputChange}
                  disabled={selectedSubreddit !== null}
                  className="pl-10 pr-10"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                {isSearching && (
                  <IconLoader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
                )}
                {searchQuery && !isSearching && !selectedSubreddit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-accent"
                    onClick={() => {
                      setSearchQuery("");
                      setIsPopoverOpen(false);
                    }}
                  >
                    <IconX className="size-3" />
                  </Button>
                )}
              </div>

              {isPopoverOpen && !selectedSubreddit && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md"
                >
                  <div className="max-h-80 overflow-y-auto">
                    {isSearching ? (
                      <div className="flex items-center justify-center py-6">
                        <IconLoader2 className="size-4 animate-spin mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">
                          Searching...
                        </span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((subreddit) => (
                          <div
                            key={subreddit.id}
                            onClick={() => selectSubreddit(subreddit)}
                            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                              {subreddit.community_icon ? (
                                <img
                                  src={subreddit.community_icon}
                                  alt={subreddit.display_name_prefixed}
                                  className="w-8 h-8 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    target.nextElementSibling?.classList.remove(
                                      "hidden"
                                    );
                                  }}
                                />
                              ) : null}
                              <span
                                className={
                                  subreddit.community_icon ? "hidden" : ""
                                }
                              >
                                r/
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-foreground">
                                {subreddit.display_name_prefixed}
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <IconUsers className="size-3" />
                                <span>
                                  {formatSubscriberCount(subreddit.subscribers)}{" "}
                                  members
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <IconPlus className="size-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : hasSearched && searchQuery ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No subreddits found.
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Subreddit */}
          {selectedSubreddit && (
            <div className="space-y-2">
              <Label>Selected Subreddit</Label>
              <div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/20">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                  {selectedSubreddit.community_icon ? (
                    <img
                      src={selectedSubreddit.community_icon}
                      alt={selectedSubreddit.display_name_prefixed}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <span
                    className={selectedSubreddit.community_icon ? "hidden" : ""}
                  >
                    r/
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base text-foreground">
                    {selectedSubreddit.display_name_prefixed}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <IconUsers className="size-4" />
                    <span>
                      {formatSubscriberCount(selectedSubreddit.subscribers)}{" "}
                      members
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                  onClick={removeSelection}
                >
                  <IconX className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedSubreddit || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="size-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Suggestion"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
