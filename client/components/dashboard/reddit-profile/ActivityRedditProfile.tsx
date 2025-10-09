"use client";

import { useRedditUserInteractions } from "@/stores/reddit-user-interactions";
import { FileText, Mail, MessageSquare } from "lucide-react";
import { useMemo } from "react";

const getInteractionIcon = (type: string) => {
  switch (type) {
    case "comment_reply":
      return <MessageSquare className="w-5 h-5 text-blue-500" />;
    case "post_reply":
      return <FileText className="w-5 h-5 text-green-500" />;
    case "dm":
      return <Mail className="w-5 h-5 text-purple-500" />;
    default:
      return <MessageSquare className="w-5 h-5 text-gray-500" />;
  }
};

export default function ActivityRedditProfile() {
  const { redditUserInteractions } = useRedditUserInteractions();

  const filteredInteractions = useMemo(() => {
    return (
      redditUserInteractions &&
      redditUserInteractions.filter(
        (interaction) =>
          interaction.status !== "ignored" && interaction.status !== "new"
      )
    );
  }, [redditUserInteractions]);

  if (filteredInteractions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">
            No interactions yet
          </h3>
          <p className="text-sm text-gray-600">
            Start engaging on Reddit by posting comments or replying to users.
            We&apos;ll automatically track your interactions here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredInteractions.map((interaction) => (
        <div
          key={interaction.id}
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getInteractionIcon(interaction.interaction_type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">
                  u/{interaction.interacted_with_reddit_username}
                </span>
                <span className="text-sm text-gray-500">
                  {interaction.interaction_type.replace("_", " ")}
                </span>
              </div>
              {interaction.reddit_content_discovered && (
                <div className="space-y-1">
                  {interaction.reddit_content_discovered.title && (
                    <p className="text-sm font-medium">
                      {interaction.reddit_content_discovered.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {interaction.reddit_content_discovered.content}
                  </p>
                  {interaction.reddit_content_discovered.subreddit && (
                    <p className="text-xs text-gray-500">
                      r/
                      {interaction.reddit_content_discovered.subreddit.display_name_prefixed.replace(
                        "r/",
                        ""
                      )}
                    </p>
                  )}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-400">
                {new Date(interaction.created_at || "").toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
