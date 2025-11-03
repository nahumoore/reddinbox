import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IconCheck, IconSparkles } from "@tabler/icons-react";
import { GeneratedPost } from "./StepTwo";

interface ExamplesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts: GeneratedPost[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function ExamplesDialog({
  open,
  onOpenChange,
  posts,
  currentIndex,
  onSelect,
}: ExamplesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <IconSparkles className="size-5 text-primary" />
            All Generated Posts ({posts.length})
          </DialogTitle>
          <DialogDescription>
            Select a post variation to use as your starting point. You can edit
            it further after selection.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-120px)] pr-4">
          <div className="space-y-4">
            {posts.map((post, index) => {
              const isSelected = index === currentIndex;

              return (
                <div
                  key={index}
                  onClick={() => onSelect(index)}
                  className={cn(
                    "relative p-4 rounded-lg border cursor-pointer transition-all",
                    "hover:bg-accent/50 hover:border-accent-foreground/20 hover:shadow-md",
                    isSelected &&
                      "bg-primary/5 border-primary shadow-md ring-2 ring-primary/20"
                  )}
                >
                  {/* Header with number and check */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center text-sm font-semibold",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Variation {index + 1}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <IconCheck className="size-4" />
                        Selected
                      </div>
                    )}
                  </div>

                  {/* Post Title */}
                  <h3 className="font-semibold text-base mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Post Content Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-4 font-mono">
                    {post.content}
                  </p>

                  {/* Select Button (visible on hover or when selected) */}
                  <div
                    className={cn(
                      "mt-3 transition-opacity",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(index);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <IconCheck className="size-3" />
                          Currently Selected
                        </>
                      ) : (
                        "Select This Post"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
