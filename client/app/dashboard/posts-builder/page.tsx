"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBulb, IconClock, IconFileText, IconNews, IconSparkles, IconTrendingUp } from "@tabler/icons-react";
import Link from "next/link";

export default function PostBuilderPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-primary/10">
            <IconNews className="w-12 h-12 text-primary" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold font-heading">
              Reddit Post Builder
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create authentic, high-performing posts that resonate with your
              communities—without looking promotional.
            </p>
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <IconClock className="w-4 h-4 mr-2" />
              Coming soon!
            </Badge>
          </div>
        </div>

        {/* What You'll Be Able To Do */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">
            What you&apos;ll be able to do
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <IconTrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Analyze What Actually Works
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Study top-performing posts in your target subreddits. See what
                  formats, tones, and topics get the most engagement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <IconBulb className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Find Trending Topics
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor industry news, discussions, and pain points. Know
                  exactly what your community is talking about right now.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <IconFileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Repurpose Your Content
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Transform blog posts, videos, and case studies into authentic
                  Reddit posts that match each community&apos;s style.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <IconSparkles className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Get Community-Fit Scores
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Before you post, see how well your content matches the
                  subreddit&apos;s culture. Avoid sounding promotional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notification */}
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">
            We&apos;ll notify you when it&apos;s ready :)
          </h3>
          <p className="text-muted-foreground">
            For now, focus on building authority at{" "}
            <Link
              className="text-primary hover:underline"
              href="/dashboard/authority-feed"
            >
              Authority Feed
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
