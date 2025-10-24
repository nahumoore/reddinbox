import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Founder from "@/public/founder.webp";
import { IconMessage, IconMessage2, IconUser } from "@tabler/icons-react";
import Image from "next/image";

interface Message {
  username: string;
  message: string;
}

interface RedditChatPreviewProps {
  messages: Message[];
  className?: string;
  title?: string;
}

export function RedditChatPreview({
  messages,
  className,
  title = "Direct Message",
}: RedditChatPreviewProps) {
  return (
    <Card
      className={cn(
        "not-prose my-8 overflow-hidden border-border/50 bg-card shadow-md",
        className
      )}
    >
      <CardContent className="!py-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
            <IconMessage className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">
              {title}
            </span>
            <span className="text-muted-foreground text-xs">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </span>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex flex-col gap-4 py-5">
          {messages.map((msg, index) => {
            const isNicolas = msg.username === "Nicolas";
            return (
              <div key={index} className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 shrink-0">
                  {isNicolas ? (
                    <Image
                      src={Founder}
                      alt="Founder"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <IconUser className="size-4 text-primary" />
                  )}
                </div>

                {/* Message content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-foreground text-sm">
                      u/{msg.username}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "text-sm leading-relaxed p-3 rounded-lg inline-block max-w-[85%]",
                      isNicolas
                        ? "bg-primary/10 text-foreground"
                        : "bg-muted text-foreground/90"
                    )}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat footer */}
        <div className="flex items-center gap-2 py-3 border-t border-border/50 bg-muted/20 rounded-lg">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md bg-background/50 text-muted-foreground text-sm">
            <IconMessage2 className="size-4" />
            <span>Type a message...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
