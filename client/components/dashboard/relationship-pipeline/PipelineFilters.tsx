"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconFilter,
  IconSearch,
  IconSortAscending,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

export type SortOption = "recent" | "most-interactions" | "highest-score";
export type StatusFilter = "all" | "new" | "posted" | "scheduled" | "ignored";
export type InteractionTypeFilter =
  | "all"
  | "comment_reply"
  | "post_reply"
  | "dm";

interface PipelineFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  interactionTypeFilter: InteractionTypeFilter;
  onInteractionTypeFilterChange: (type: InteractionTypeFilter) => void;
}

export function PipelineFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  interactionTypeFilter,
  onInteractionTypeFilterChange,
}: PipelineFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    statusFilter !== "all" ||
    interactionTypeFilter !== "all" ||
    searchQuery.length > 0;

  const clearAllFilters = () => {
    onSearchChange("");
    onStatusFilterChange("all");
    onInteractionTypeFilterChange("all");
    onSortChange("recent");
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 min-h-[44px]"
            aria-label="Search users by username"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Clear search"
            >
              <IconX className="size-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg min-h-[44px] bg-white hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
          aria-label="Sort users by"
        >
          <option value="recent">Most Recent</option>
          <option value="most-interactions">Most Interactions</option>
          <option value="highest-score">Highest Score</option>
        </select>

        {/* Filter Toggle */}
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="min-h-[44px] min-w-[44px]"
          aria-label="Toggle filters"
        >
          <IconFilter className="size-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 size-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Filter Options</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <IconX className="size-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label
                htmlFor="status-filter"
                className="text-sm font-medium block"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  onStatusFilterChange(e.target.value as StatusFilter)
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg min-h-[44px] bg-white hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="posted">Posted</option>
                <option value="scheduled">Scheduled</option>
                <option value="ignored">Ignored</option>
              </select>
            </div>

            {/* Interaction Type Filter */}
            <div className="space-y-2">
              <label
                htmlFor="type-filter"
                className="text-sm font-medium block"
              >
                Interaction Type
              </label>
              <select
                id="type-filter"
                value={interactionTypeFilter}
                onChange={(e) =>
                  onInteractionTypeFilterChange(
                    e.target.value as InteractionTypeFilter
                  )
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg min-h-[44px] bg-white hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="comment_reply">Comment Reply</option>
                <option value="post_reply">Post Reply</option>
                <option value="dm">Direct Message</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
