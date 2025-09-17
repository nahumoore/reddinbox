import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  truncate?: boolean;
  maxLength?: number;
}

export function MarkdownContent({
  content,
  className,
  truncate = false,
  maxLength = 200
}: MarkdownContentProps) {
  const processedContent = truncate && content.length > maxLength
    ? content.substring(0, maxLength) + "..."
    : content;

  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-base font-heading font-semibold mb-2 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-heading font-semibold mb-2 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-heading font-medium mb-1 text-foreground">
              {children}
            </h3>
          ),
          // Paragraphs with line breaks
          p: ({ children }) => (
            <p className="text-sm leading-relaxed mb-2 last:mb-0 whitespace-pre-wrap">
              {children}
            </p>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm">{children}</li>
          ),
          // Code
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                {children}
              </code>
            );
          },
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted-foreground/20 pl-3 py-1 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          // Line breaks
          br: () => <br />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}