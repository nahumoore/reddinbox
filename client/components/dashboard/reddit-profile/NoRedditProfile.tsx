"use client";
import { IconBrandRedditNew } from "@/components/icons/BrandRedditNew";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateRedditAuthUrl } from "@/utils/reddit/generate-auth-url";
import { IconCalendar, IconMessage, IconSparkles } from "@tabler/icons-react";

export default function NoRedditProfile() {
  const handleRedditReauth = () => {
    const authUrl = generateRedditAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="max-w-3xl w-full space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative size-20 bg-gradient-to-br from-[#FF4500] to-[#FF6B35] rounded-2xl flex items-center justify-center shadow-lg">
                <IconBrandRedditNew className="size-10 text-white rotate-6" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground font-heading">
                Connect Your Reddit Account
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Unlock powerful insights and automation by connecting your
                Reddit profile
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="relative group hover:shadow-md transition-shadow border-purple-500/20">
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="size-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconMessage className="size-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold font-heading text-foreground">
                      Smart Lead Tracking
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Automatically track and manage potential customers from
                      your Reddit interactions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative group hover:shadow-md transition-shadow border-blue-500/20">
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="size-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconCalendar className="size-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold font-heading text-foreground">
                      Schedule Posts & Comments
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Schedule your posts and comments to Reddit and manage your
                      content effectively
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative group hover:shadow-md transition-shadow border-emerald-500/20">
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="size-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconSparkles className="size-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold font-heading text-foreground">
                      Reply Generation
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Get intelligent, context-aware reply suggestions when
                      users respond to your comments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <Button
              onClick={handleRedditReauth}
              size="lg"
              className="px-10 py-6 text-lg font-semibold bg-[#FF4500] hover:bg-[#FF6B35] text-white shadow-lg"
            >
              <IconBrandRedditNew className="size-6 mr-3" />
              Connect Reddit Account
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Secure OAuth connection • Takes less than 30 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
