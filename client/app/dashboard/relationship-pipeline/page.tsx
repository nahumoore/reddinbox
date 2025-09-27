"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageCircle, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function RelationshipPipelinePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-primary/10">
            <Users className="w-12 h-12 text-primary" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold font-main">
              Relationship Pipeline
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Turn Reddit conversations into revenue. Manage relationships and
              close deals.
            </p>
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <Clock className="w-4 h-4 mr-2" />
              Coming soon!
            </Badge>
          </div>
        </div>

        {/* What You&apos;ll Be Able To Do */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">
            What you&apos;ll be able to do
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Track Every Relationship
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See your complete history with each Reddit user. Know what
                  you&apos;ve discussed, when they&apos;re most active, and
                  their interests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Score Lead Quality</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get instant warmth scores. Know who&apos;s ready for outreach
                  and who needs more nurturing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Send Perfect Messages
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get AI suggestions for your next message based on your
                  conversation history. Reference past help you&apos;ve given.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Manage Your Pipeline
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Move contacts through your sales process. Set reminders and
                  never let a warm lead go cold.
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
