import { IconTimeline } from "@tabler/icons-react";

export function EmptyState() {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <IconTimeline className="size-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="font-heading font-semibold text-lg mb-2">
        No interactions yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Interactions with this lead will appear here once you start engaging
        with them on Reddit. Each interaction will show the post context, your
        response, and engagement metrics.
      </p>
    </div>
  );
}
