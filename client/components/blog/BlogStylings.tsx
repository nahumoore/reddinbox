import { cn } from "@/lib/utils";
import { MDXComponents } from "mdx/types";
import Link from "next/link";
import { RedditChatPreview } from "./RedditChatPreview";
import { RedditPostCard } from "./RedditPostCard";
import { RedditReplyCard } from "./RedditReplyCard";

export default function BlogStylings(): MDXComponents {
  return {
    h1: (props) => {
      const id = props.children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      return (
        <h1
          {...props}
          id={id}
          className={cn(
            "scroll-m-20 text-[2.5rem] leading-tight font-bold tracking-[-0.02em]",
            props.className
          )}
        />
      );
    },
    h2: (props) => {
      const id = props.children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      return (
        <h2
          {...props}
          id={id}
          className={cn(
            "mt-14 mb-6 scroll-m-20 text-[1.875rem] leading-tight font-semibold tracking-[-0.02em]",
            props.className
          )}
        />
      );
    },
    h3: (props) => {
      const id = props.children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      return (
        <h3
          {...props}
          id={id}
          className={cn(
            "mt-10 mb-4 scroll-m-20 text-[1.5rem] leading-tight font-semibold tracking-[-0.02em]",
            props.className
          )}
        />
      );
    },
    h4: (props) => {
      const id = props.children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      return (
        <h4
          {...props}
          id={id}
          className={cn(
            "mt-8 mb-3 scroll-m-20 text-[1.25rem] leading-tight font-semibold tracking-[-0.02em] text-white",
            props.className
          )}
        />
      );
    },
    p: (props) => (
      <p
        {...props}
        className={cn(
          "text-[1.0625rem] leading-[1.7] [&:not(:first-child)]:mt-6",
          props.className
        )}
      />
    ),
    ul: (props) => (
      <ul
        {...props}
        className={cn(
          "my-6 ml-8 list-disc [&>li]:mt-3 [&>li]:leading-[1.7]",
          props.className
        )}
      />
    ),
    ol: (props) => (
      <ol
        {...props}
        className={cn(
          "my-6 ml-8 list-decimal [&>li]:mt-3 [&>li]:leading-[1.7]",
          props.className
        )}
      />
    ),
    code: (props) => (
      <code
        className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        {...props}
      />
    ),
    a: (props) => (
      <Link
        {...props}
        href={props.href || ""}
        className="transition-all relative text-primary underline-offset-4 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.children}
      </Link>
    ),
    table: (props) => (
      <div className="my-8 w-full overflow-x-auto rounded-lg border border-zinc-700/50 bg-zinc-900/30 backdrop-blur-sm">
        <table
          {...props}
          className={cn("w-full border-collapse text-sm", props.className)}
        />
      </div>
    ),
    thead: (props) => (
      <thead
        {...props}
        className={cn(
          "border-b border-zinc-700/70 bg-zinc-800/50",
          props.className
        )}
      />
    ),
    tbody: (props) => <tbody {...props} className={cn("", props.className)} />,
    tr: (props) => (
      <tr
        {...props}
        className={cn(
          "border-b border-zinc-700/30 transition-all duration-200 hover:bg-zinc-800/30",
          props.className
        )}
      />
    ),
    th: (props) => (
      <th
        {...props}
        className={cn(
          "px-6 py-4 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right",
          props.className
        )}
      />
    ),
    td: (props) => (
      <td
        {...props}
        className={cn(
          "px-6 py-4 [&[align=center]]:text-center [&[align=right]]:text-right",
          props.className
        )}
      />
    ),
    blockquote: (props) => (
      <blockquote
        {...props}
        className={cn(
          "my-8 p-6 bg-muted/60 border border-zinc-700/50 rounded-lg shadow-lg backdrop-blur-sm italic relative before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:rounded-l-lg",
          props.className
        )}
      />
    ),
    // --- Custom Interactive Components for Articles ---
    RedditPostCard: (props) => <RedditPostCard {...props} />, // Used when a post is shared
    RedditReplyCard: (props) => <RedditReplyCard {...props} />, // Used when a reply is shared
    RedditChatPreview: (props) => <RedditChatPreview {...props} />, // Used when a chat preview is shared
  };
}
