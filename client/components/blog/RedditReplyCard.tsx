import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Founder from "@/public/founder.webp";
import { IconUser } from "@tabler/icons-react";
import Image from "next/image";

interface RedditReplyCardProps {
  username: string;
  children: React.ReactNode;
  className?: string;
  timeAgo?: string;
}

export function RedditReplyCard({
  username,
  children,
  className,
  timeAgo = "just now",
}: RedditReplyCardProps) {
  return (
    <Card
      className={cn(
        "not-prose my-6 overflow-hidden border-l-2 border-l-primary/40 border-t-0 border-r-0 border-b-0 shadow-sm hover:shadow-md hover:border-l-primary/60 transition-all duration-300 ml-8",
        className
      )}
    >
      <CardContent className="!py-0">
        {/* Reply header with username */}
        <div className="flex items-center gap-2 py-3 text-sm">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
            {username === "Nicolas" ? (
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
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">u/{username}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
          </div>
        </div>

        {/* Reply content */}
        <div className="pb-4">
          <div className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {children}
          </div>
        </div>

        {/* Reply footer with minimal actions */}
        <div className="flex items-center gap-4 pb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
            <span>Upvote</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Reply</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
