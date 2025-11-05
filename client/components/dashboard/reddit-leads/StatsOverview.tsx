import { Card, CardContent } from "@/components/ui/card";
import {
  IconFlame,
  IconMessage,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { StatsCardSkeleton } from "./StatsCardSkeleton";

interface StatsOverviewProps {
  isLoading: boolean;
  totalLeads: number;
  hotLeads: number;
  contactedLeads: number;
  convertedLeads: number;
}

export function StatsOverview({
  isLoading,
  totalLeads,
  hotLeads,
  contactedLeads,
  convertedLeads,
}: StatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Leads */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Leads
              </p>
              <p className="text-3xl font-bold font-heading">{totalLeads}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <IconUsers className="size-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hot Leads */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Hot Leads
              </p>
              <p className="text-3xl font-bold font-heading text-orange-600">
                {hotLeads}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <IconFlame className="size-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacted */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                In Progress
              </p>
              <p className="text-3xl font-bold font-heading text-blue-600">
                {contactedLeads}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <IconMessage className="size-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Converted */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Converted
              </p>
              <p className="text-3xl font-bold font-heading text-green-600">
                {convertedLeads}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <IconTrendingUp className="size-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
