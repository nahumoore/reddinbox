import { Button } from "@/components/ui/button";
import { IconHome, IconSearch } from "@tabler/icons-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Visual Indicator */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
            <IconSearch
              className="text-primary"
              size={48}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <h1 className="text-6xl sm:text-7xl font-bold text-foreground mb-4">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-10 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
            Looks like this post got lost in the Reddit void. The page
            you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto min-w-40">
            <Link href="/">
              <IconHome size={20} />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
