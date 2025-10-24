import { IconBrandRedditNew } from "@/components/icons/BrandRedditNew";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RedditPostCardProps {
  subreddit: string;
  username: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function RedditPostCard({
  subreddit,
  username,
  title,
  children,
  className,
}: RedditPostCardProps) {
  return (
    <Card
      className={cn(
        "not-prose my-8 overflow-hidden border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      <CardContent className="!py-0">
        {/* Header with Reddit branding */}
        <div className="flex items-center gap-3 pb-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <IconBrandRedditNew className="size-6 text-primary" />
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-foreground">r/{subreddit}</span>
            <span className="text-muted-foreground">u/{username}</span>
          </div>
        </div>

        {/* Post content */}
        <div className="py-5">
          <h3 className="font-heading text-xl font-bold leading-tight tracking-tight text-foreground mb-3">
            {title}
          </h3>
          <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {children}
          </div>
        </div>

        {/* Footer with engagement indicators */}
        <div className="flex items-center gap-4 py-3 border-t border-border/50 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
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
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Comment</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
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
