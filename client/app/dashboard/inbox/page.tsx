"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { IconSend, IconTrash, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// Mock types for demonstration
interface RedditMessage {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  isFromUser: boolean;
}

interface RedditConversation {
  id: string;
  subject: string;
  latestMessageAt: string;
  totalMessages: number;
  messages: RedditMessage[];
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<RedditConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<RedditConversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations: RedditConversation[] = [
      {
        id: "1",
        subject: "Direct message",
        latestMessageAt: "2024-01-15T10:30:00Z",
        totalMessages: 1,
        messages: [
          {
            id: "1",
            author: "AaronSteeleX",
            body: "For context, I run audio gears niche website and I covered blog posts about headphones / earbuds for gym, sports, and yoga which will be relevant backlink to your website.",
            createdAt: "2024-01-15T10:30:00Z",
            isFromUser: false,
          },
        ],
      },
      {
        id: "2",
        subject: "Direct message",
        latestMessageAt: "2024-01-15T09:15:00Z",
        totalMessages: 1,
        messages: [
          {
            id: "2",
            author: "AaronSteeleX",
            body: "Hello, I noticed you posted on Reddit",
            createdAt: "2024-01-15T09:15:00Z",
            isFromUser: false,
          },
        ],
      },
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setSelectedConversation(mockConversations[0]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getLastMessage = (conversation: RedditConversation) => {
    if (conversation.messages.length === 0) return null;
    return conversation.messages[conversation.messages.length - 1];
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    // Here you would typically send the message to your API
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ConversationListContent = () => (
    <>
      <div className="p-4 border-b border-border bg-card h-[75px]">
        <h1 className="text-xl font-bold text-foreground">Inbox</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {conversations.length} conversation
          {conversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <ConversationListSkeleton />
        ) : error ? (
          <div className="p-4 text-center text-destructive">
            <p>Error loading conversations</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <IconUser className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Your Reddit DMs will appear here</p>
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conversation) => {
              const lastMessage = getLastMessage(conversation);
              const otherUserName =
                lastMessage?.author !== lastMessage?.isFromUser
                  ? lastMessage?.author
                  : conversation.messages.find((m) => !m.isFromUser)?.author ||
                    "Unknown";

              return (
                <Card
                  key={conversation.id}
                  className={`p-3 mb-2 ${
                    selectedConversation?.id === conversation.id
                      ? "bg-primary/20 border-primary/30"
                      : "hover:bg-muted/50 cursor-pointer transition-colors"
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-4 w-4 shrink-0">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${otherUserName}`}
                        />
                        <AvatarFallback>
                          {otherUserName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="font-medium text-sm truncate">
                        {otherUserName}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(conversation.latestMessageAt)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {lastMessage && (
                        <p className="text-sm text-foreground/80 mb-2 truncate max-w-full">
                          {lastMessage.isFromUser ? "You: " : ""}
                          {lastMessage.body.length > 35
                            ? lastMessage.body.substring(0, 35) + "..."
                            : lastMessage.body}
                        </p>
                      )}

                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          selectedConversation?.id === conversation.id
                            ? "bg-primary/20 border-primary/30"
                            : "hover:bg-muted/50 cursor-pointer transition-colors"
                        }`}
                      >
                        {conversation.totalMessages} message
                        {conversation.totalMessages !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </>
  );

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex-col flex">
        <ConversationListContent />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <MainContentSkeleton />
        ) : !selectedConversation ? (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
            <div>
              <IconUser className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Select a conversation
              </h3>
              <p className="text-sm">
                Choose a conversation from the sidebar to view messages
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Conversation Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card h-[75px]">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${
                      selectedConversation.messages.find((m) => !m.isFromUser)
                        ?.author
                    }`}
                  />
                  <AvatarFallback>
                    {selectedConversation.messages
                      .find((m) => !m.isFromUser)
                      ?.author?.charAt(0)
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold truncate">
                    {selectedConversation.messages.find((m) => !m.isFromUser)
                      ?.author || "Unknown"}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedConversation.subject.replace(
                      "[direct chat room]",
                      "Direct message"
                    )}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-2 shrink-0">
                <IconTrash className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area - Scrollable with sticky input */}
            <div className="flex-1 flex flex-col bg-muted/30 overflow-hidden">
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-4">
                  {selectedConversation.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input Area - Sticky at bottom */}
              <div className="border-t border-border bg-background p-4 flex-shrink-0">
                <div className="flex items-end space-x-2 max-w-4xl mx-auto">
                  <div className="flex-1">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="resize-none bg-card"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    size="sm"
                    className="shrink-0"
                  >
                    <IconSend className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Component to render individual message bubbles
function MessageBubble({ message }: { message: RedditMessage }) {
  return (
    <div
      className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 py-2 rounded-xl bg-white shadow-md ${
          message.isFromUser
            ? "border text-foreground rounded-br-sm"
            : "border text-foreground rounded-bl-sm"
        }`}
      >
        {!message.isFromUser && (
          <p className="text-xs font-medium mb-1 text-primary">
            {message.author}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.body}
        </p>
        <p className="text-xs mt-1 text-muted-foreground">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

// Loading state components
function ConversationListSkeleton() {
  return (
    <div className="p-2 space-y-2">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="p-3 mb-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <Skeleton className="h-4 w-24 flex-1" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <Skeleton className="h-3 w-full max-w-48 mb-2" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MainContentSkeleton() {
  return (
    <>
      {/* Loading Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card h-[75px]">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 shrink-0" />
      </div>

      {/* Loading Messages */}
      <div className="flex-1 flex flex-col bg-muted/30 overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex ${
                  i % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div className="max-w-[85%] sm:max-w-xs lg:max-w-md space-y-2">
                  <Skeleton
                    className={`h-12 w-48 rounded-xl ${
                      i % 2 === 0 ? "rounded-bl-sm" : "rounded-br-sm"
                    }`}
                  />
                  <Skeleton className="h-3 w-16 mx-2" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Loading Input Area */}
        <div className="border-t border-border bg-background p-4 flex-shrink-0">
          <div className="flex items-end space-x-2 max-w-4xl mx-auto">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10 shrink-0" />
          </div>
        </div>
      </div>
    </>
  );
}
