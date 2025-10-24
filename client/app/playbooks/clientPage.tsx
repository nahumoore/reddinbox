"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Highlighter } from "@/components/ui/highlighter";
import { type BlogPostMeta } from "@/utils/mdx";
import {
  IconBook,
  IconCalendar,
  IconClock,
  IconRocket,
  IconTarget,
  IconTrendingUp,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

interface PlaybooksClientPageProps {
  allPlaybooks: BlogPostMeta[];
}

export default function PlaybooksClientPage({
  allPlaybooks,
}: PlaybooksClientPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-24">
        {/* Hero Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 rounded-3xl -z-10"></div>
          <div className="py-12">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <Highlighter action="underline" color="#ff5700">
                <span className="text-primary font-bold">Reddit Marketing</span>
              </Highlighter>{" "}
              Playbooks
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
              Step-by-step playbooks that guide you through proven Reddit
              marketing tactics. From finding your first subreddit to building a
              thriving community presence—everything you need in one place.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-6 text-sm font-body">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconBook className="h-4 w-4 text-primary" />
                <span>Actionable Guides</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconTarget className="h-4 w-4 text-accent" />
                <span>Goal-Oriented Tactics</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconRocket className="h-4 w-4 text-primary" />
                <span>Ready to Implement</span>
              </div>
            </div>
          </div>
        </div>

        {allPlaybooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="font-heading text-2xl font-bold mb-4">
                New Playbooks Coming Soon
              </h3>
              <p className="text-muted-foreground font-body text-lg mb-6">
                We&apos;re crafting comprehensive step-by-step playbooks for
                Reddit marketing success. Be the first to know when they&apos;re
                ready.
              </p>
              <Button className="font-body">Get Notified</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* All Playbooks */}
            {allPlaybooks.length > 0 && (
              <section>
                <div className="mb-8">
                  <h2 className="font-heading text-3xl font-bold mb-2">
                    All Playbooks
                  </h2>
                  <p className="text-muted-foreground font-body">
                    Complete guides to master every aspect of Reddit marketing
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allPlaybooks.map((playbook) => (
                    <Card
                      key={playbook.slug}
                      className="group hover:shadow-xl transition-all duration-300 border-border hover:border-accent/30 bg-gradient-to-br from-background to-primary/5 flex flex-col !pt-0"
                    >
                      <div className="relative overflow-hidden">
                        {playbook.image ? (
                          <Image
                            src={playbook.image}
                            alt={playbook.imageAlt || playbook.title}
                            width={400}
                            height={240}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-md"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📘</div>
                              <p className="text-sm text-muted-foreground font-body">
                                Playbook Guide
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <IconCalendar className="h-4 w-4" />
                            <span className="font-body">
                              {formatDate(playbook.date)}
                            </span>
                            {playbook.readTime && (
                              <>
                                <IconClock className="h-4 w-4 ml-2" />
                                <span className="font-body">
                                  {playbook.readTime}
                                </span>
                              </>
                            )}
                          </div>

                          <CardTitle className="font-heading text-lg leading-tight group-hover:text-accent transition-colors">
                            <Link
                              href={`/playbooks/${playbook.slug}`}
                              className="hover:underline"
                            >
                              {playbook.title}
                            </Link>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0 flex flex-col flex-1">
                          <p className="font-body text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                            {playbook.description}
                          </p>

                          {/* Tags */}
                          {playbook.tags && playbook.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {playbook.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs font-body"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {playbook.tags.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs font-body"
                                >
                                  +{playbook.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}

                          <Link
                            href={`/playbooks/${playbook.slug}`}
                            className="mt-auto"
                          >
                            <Button className="w-full font-body group-hover:shadow-md transition-shadow">
                              View Playbook
                            </Button>
                          </Link>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Call to Action */}
            <section className="mt-16">
              <Card className="bg-gradient-to-br from-accent/10 via-background to-primary/10 border-accent/20">
                <CardContent className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <IconTrendingUp className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                    Put These Playbooks Into Action
                  </h3>
                  <p className="font-body text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                    Reddinbox makes it easy to implement these playbooks with
                    AI-powered tools that help you build authority, engage
                    authentically, and generate qualified leads from Reddit.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/blog"
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "font-body",
                      })}
                    >
                      Read Our Blog
                    </Link>
                    <Link
                      href="/auth/register"
                      className={buttonVariants({
                        variant: "default",
                        size: "lg",
                      })}
                    >
                      Get Started Free
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
