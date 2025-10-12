"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingForm } from "@/stores/onboarding-form";
import { SubredditData } from "@/types/reddit";
import {
  IconArrowLeft,
  IconArrowRight,
  IconLoader2,
  IconPlus,
  IconSearch,
  IconUsers,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
interface SearchResult extends SubredditData {
  id: string;
}

export default function SubredditSelector() {
  const { targetSubreddits, setTargetSubreddits, setStep } =
    useOnboardingForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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

  const isSubredditSelected = (subreddit: SearchResult) => {
    return targetSubreddits.some((selected) => selected.id === subreddit.id);
  };

  const selectSubreddit = (subreddit: SearchResult) => {
    if (targetSubreddits.length < 6) {
      setTargetSubreddits([...targetSubreddits, subreddit]);
      setSearchQuery("");
      setSearchResults([]);
      setIsPopoverOpen(false);
      setHasSearched(false);
      // Return focus to input after selection
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      toast.error("You can select up to 6 subreddits");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    // Popover will only open when search is performed
  };

  const removeSubreddit = (index: number) => {
    const newSubreddits = [...targetSubreddits];
    newSubreddits.splice(index, 1);
    setTargetSubreddits(newSubreddits);
  };

  const formatSubscriberCount = (count: number) => {
    if (!count) return "0";

    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }

    return count.toString();
  };

  const handleContinue = () => {
    setStep(4);
  };

  const handleGoBack = () => {
    setStep(2);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative size-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <IconUsersGroup className="size-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Select Target Subreddits
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose up to 6 subreddits where you&apos;d like to engage with
              your target audience
            </p>
          </div>
        </div>
      </div>

      {/* Search Selector */}
      <div className="space-y-2">
        <Label htmlFor="subredditSearch">Search Subreddits</Label>
        <div className="relative">
          <div className="relative">
            <Input
              ref={inputRef}
              id="subredditSearch"
              placeholder={
                targetSubreddits.length >= 6
                  ? "Maximum subreddits selected"
                  : "Type to search subreddits..."
              }
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              disabled={targetSubreddits.length >= 6}
              className="pl-10 pr-10"
            />
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            {isSearching && (
              <IconLoader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
            )}
            {searchQuery && !isSearching && (
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

          {isPopoverOpen && (
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
                    {searchResults
                      .filter((subreddit) => !isSubredditSelected(subreddit))
                      .map((subreddit) => (
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
                ) : searchQuery ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Start typing to search subreddits...
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Subreddits */}
      {targetSubreddits.length > 0 && (
        <div className="space-y-3">
          {/* Selected Count */}
          <div className="text-sm text-muted-foreground">
            {targetSubreddits.length} of 6 subreddits selected
          </div>

          {targetSubreddits.map((subreddit, index) => (
            <Card
              key={subreddit.display_name_prefixed}
              className="border border-border"
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
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
                        className={subreddit.community_icon ? "hidden" : ""}
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
                          {formatSubscriberCount(subreddit.subscribers)} members
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSubreddit(index);
                    }}
                  >
                    <IconX className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {targetSubreddits.length === 0 && (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="p-8 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <IconSearch className="size-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No subreddits selected yet</p>
              <p className="text-xs mt-1">
                Search and select up to 6 subreddits above
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between py-4">
        <Button variant="outline" onClick={handleGoBack} className="px-6">
          <IconArrowLeft className="size-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleContinue}
          className="px-8"
          size="lg"
          disabled={targetSubreddits.length === 0}
        >
          Continue
          <IconArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
