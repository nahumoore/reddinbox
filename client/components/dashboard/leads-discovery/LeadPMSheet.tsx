"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { useRedditLeads } from "@/stores/reddit-leads";
import type { RedditUserProfile } from "@/types/reddit";
import {
  IconMail,
  IconSend,
  IconShield,
  IconSparkles,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function LeadPMSheet() {
  const { focusRedditLead, redditLeads, setFocusRedditLead, setRedditLeads } =
    useRedditLeads();
  const [userProfile, setUserProfile] = useState<RedditUserProfile | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { activeRedditAccount } = useRedditAccounts();

  // Fetch user profile when a lead is focused
  useEffect(() => {
    if (focusRedditLead?.reddit_author) {
      fetchUserProfile(focusRedditLead.reddit_author);
    }
  }, [focusRedditLead?.reddit_author]);

  const fetchUserProfile = async (username: string) => {
    setIsLoadingProfile(true);
    try {
      const response = await fetch(
        `/api/reddit/conversations/get-context?username=${encodeURIComponent(
          username
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !focusRedditLead?.reddit_author) return;

    setIsSending(true);
    try {
      const finalSubject = subject.trim() || activeRedditAccount!.name;

      const response = await fetch(
        "/api/reddit/conversations/start-conversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: focusRedditLead.reddit_author,
            subject: finalSubject,
            text: message,
            leadId: focusRedditLead.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error("Failed to send message", {
          description: result.error || "Please try again later.",
        });
        return;
      }

      // Show success toast
      toast.success("Message sent and lead stored!", {
        description: `Your message to u/${focusRedditLead.reddit_author} has been sent.`,
      });

      // Change all leads with the same reddit_author to contacted
      setRedditLeads(
        redditLeads.map((lead) =>
          lead.reddit_author === focusRedditLead.reddit_author
            ? {
                ...lead,
                status: "contacted",
                contacted_at: new Date().toISOString(),
              }
            : lead
        )
      );

      // Close the sheet
      setFocusRedditLead(null!);
      setMessage("");
      setSubject("");
      setUserProfile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatAccountAge = (createdUtc: number) => {
    const accountDate = new Date(createdUtc * 1000);
    const now = new Date();
    const diffInYears =
      (now.getTime() - accountDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    if (diffInYears >= 1) {
      return `${Math.floor(diffInYears)} year${
        Math.floor(diffInYears) !== 1 ? "s" : ""
      } old`;
    } else {
      const diffInMonths = diffInYears * 12;
      return `${Math.floor(diffInMonths)} month${
        Math.floor(diffInMonths) !== 1 ? "s" : ""
      } old`;
    }
  };

  const formatKarma = (karma: number) => {
    if (karma >= 1000) {
      return `${(karma / 1000).toFixed(1)}k`;
    }
    return karma.toString();
  };

  return (
    <Sheet
      open={focusRedditLead !== null}
      onOpenChange={(open) => {
        if (open) {
          setFocusRedditLead(focusRedditLead!);
        } else {
          setFocusRedditLead(null!);
          setUserProfile(null);
          setMessage("");
          setSubject("");
        }
      }}
    >
      <SheetContent className="w-full max-w-2xl sm:max-w-2xl bg-gradient-to-b from-background to-muted">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="font-heading text-xl">
            Start Conversation
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full px-4 pb-4">
          {/* User Metadata Section */}
          <div className="space-y-6 pb-4">
            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : userProfile ? (
              <div className="space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={userProfile.icon_img}
                      alt={userProfile.name}
                    />
                    <AvatarFallback className="text-lg font-semibold">
                      {userProfile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-heading text-lg font-semibold">
                        u/{userProfile.name}
                      </h3>
                      {userProfile.verified && (
                        <Badge variant="default" className="text-xs">
                          <IconShield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {userProfile.has_verified_email && (
                        <Badge variant="secondary" className="text-xs">
                          <IconMail className="w-3 h-3 mr-1" />
                          Email Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{formatKarma(userProfile.total_karma)} karma</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{formatAccountAge(userProfile.created_utc)}</span>
                    </div>
                  </div>
                </div>

                {/* Public Description */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <span className="text-sm font-medium">
                    Profile Description:
                  </span>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                    {userProfile.public_description || "No public description"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <p>No user data available</p>
              </div>
            )}
          </div>

          {/* Conversation Section */}
          <div className="flex-1 flex flex-col space-y-4 border-t pt-6">
            <h4 className="font-heading font-medium">Send Message</h4>

            {/* Message History Area */}
            <div className="flex-1 rounded-lg p-4 min-h-32">
              <p className="text-sm text-muted-foreground text-center py-8">
                Start a conversation with <b>{userProfile?.name}</b> below.
              </p>
            </div>

            {/* Message Composition */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <div className="relative">
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                    rows={3}
                    className="resize-none bg-white pr-12" // Added right padding for icon space
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 size-12 p-0 hover:bg-gray-100 transition-colors"
                    disabled={isSending}
                  >
                    <IconSparkles className="size-6 text-muted-foreground fill-muted-foreground" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSending}
                  className="min-w-24"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <>
                      <IconSend className="w-4 h-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
