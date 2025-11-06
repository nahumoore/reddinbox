import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LeadTableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-heading font-semibold">User</TableHead>
            <TableHead className="font-heading font-semibold">Status</TableHead>
            <TableHead className="font-heading font-semibold">
              Lead Score
            </TableHead>
            <TableHead className="font-heading font-semibold">
              Pain Points
            </TableHead>
            <TableHead className="font-heading font-semibold text-right">
              Last Interaction
            </TableHead>
            <TableHead className="font-heading font-semibold text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              {/* Username */}
              <TableCell className="py-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </TableCell>

              {/* Status */}
              <TableCell className="py-6">
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>

              {/* Lead Score */}
              <TableCell className="py-6">
                <div className="space-y-2 min-w-[140px]">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              </TableCell>

              {/* Buying Signals */}
              <TableCell className="py-6">
                <div className="space-y-2 max-w-xs">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </TableCell>

              {/* Last Interaction */}
              <TableCell className="py-6 text-right">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24 ml-auto" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="py-6 text-right">
                <Skeleton className="h-9 w-32 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
