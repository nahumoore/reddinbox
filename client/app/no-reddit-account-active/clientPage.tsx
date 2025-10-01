"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateRedditAuthUrl } from "@/utils/reddit/generate-auth-url";
import {
  IconBrandReddit,
  IconExternalLink,
  IconLoader2,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useState } from "react";

export default function NoRedditAccountActiveClientPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleRedditAuth = async () => {
    setIsConnecting(true);

    try {
      const authUrl = generateRedditAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative size-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
              <IconAlertCircle className="size-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground font-heading">
            Reddit Account Required
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            You need to connect a Reddit account to continue using ReddInbox
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Connect Your Reddit Account
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Authorize ReddInbox to access your Reddit account
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Build Authority
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start engaging with Reddit communities to promote your
                    product
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Get Notifications
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when relevant conversations happen
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex flex-col items-center space-y-4">
                <Button
                  onClick={handleRedditAuth}
                  disabled={isConnecting}
                  size="lg"
                  className="w-full sm:w-auto px-12 py-6 text-lg font-semibold bg-[#FF4500] hover:bg-[#FF6B35] text-white"
                >
                  {isConnecting ? (
                    <>
                      <IconLoader2 className="size-5 animate-spin mr-3" />
                      Connecting to Reddit...
                    </>
                  ) : (
                    <>
                      <IconBrandReddit className="size-5 mr-3" />
                      Connect with Reddit
                      <IconExternalLink className="size-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center max-w-md">
                  By connecting, you authorize ReddInbox to read and post on
                  your behalf
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-muted">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <IconAlertCircle className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-sm">
                  Why do I need to reconnect?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your Reddit account was either removed or is no longer active.
                  You need to reconnect to continue using ReddInbox&apos;s
                  features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
