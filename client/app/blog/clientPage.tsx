"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Highlighter } from "@/components/ui/highlighter";
import { type BlogPostMeta } from "@/utils/mdx";
import {
  IconCalendar,
  IconClock,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

interface BlogClientPageProps {
  allPosts: BlogPostMeta[];
}

export default function BlogClientPage({ allPosts }: BlogClientPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const featuredPost = allPosts.find((post) => post.featured) || allPosts[0];
  const regularPosts = allPosts.filter(
    (post) => post.slug !== featuredPost?.slug
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-24">
        {/* Hero Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10"></div>
          <div className="py-12">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Authority-First{" "}
              <Highlighter action="underline" color="#ff5700">
                Reddit Growth
              </Highlighter>
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
              Learn the authentic strategies that turn Reddit lurking into
              sustainable lead generation. Build genuine authority in your niche
              communities without looking promotional.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-6 text-sm font-body">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconTrendingUp className="h-4 w-4 text-primary" />
                <span>Proven Growth Strategies</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconUsers className="h-4 w-4 text-accent" />
                <span>Community-First Approach</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconClock className="h-4 w-4 text-primary" />
                <span>Weekly Insights</span>
              </div>
            </div>
          </div>
        </div>

        {allPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="font-heading text-2xl font-bold mb-4">
                New Content Coming Soon
              </h3>
              <p className="text-muted-foreground font-body text-lg mb-6">
                We&apos;re crafting in-depth guides on Reddit marketing
                strategies. Be the first to know when we publish.
              </p>
              <Button className="font-body">Get Notified</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article */}
            {featuredPost && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-primary text-primary-foreground">
                    Featured Strategy
                  </Badge>
                  <span className="text-sm text-muted-foreground font-body">
                    Most Popular
                  </span>
                </div>

                <Card className="group overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-background to-primary/5">
                  <div className="md:flex">
                    <div className="md:w-1/2 relative overflow-hidden">
                      {featuredPost.image ? (
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.imageAlt || featuredPost.title}
                          width={600}
                          height={400}
                          className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-64 md:h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🚀</div>
                            <p className="text-lg text-muted-foreground font-body">
                              Reddit Growth Strategy
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                        <IconCalendar className="h-4 w-4" />
                        <span className="font-body">
                          {formatDate(featuredPost.date)}
                        </span>
                        {featuredPost.readTime && (
                          <>
                            <IconClock className="h-4 w-4" />
                            <span className="font-body">
                              {featuredPost.readTime}
                            </span>
                          </>
                        )}
                      </div>

                      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="font-body text-muted-foreground mb-6 text-base leading-relaxed">
                        {featuredPost.description}
                      </p>

                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {featuredPost.tags.slice(0, 4).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs font-body"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Link href={`/blog/${featuredPost.slug}`}>
                        <Button size="lg" className="w-fit font-body">
                          Read Full Strategy
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Latest Articles */}
            {regularPosts.length > 0 && (
              <section>
                <div className="mb-8">
                  <h2 className="font-heading text-3xl font-bold mb-2">
                    Latest Growth Insights
                  </h2>
                  <p className="text-muted-foreground font-body">
                    Actionable strategies from real Reddit marketing campaigns
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {regularPosts.map((post) => (
                    <Card
                      key={post.slug}
                      className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 bg-gradient-to-br from-background to-accent/5"
                    >
                      <div className="relative overflow-hidden">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.imageAlt || post.title}
                            width={400}
                            height={240}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📊</div>
                              <p className="text-sm text-muted-foreground font-body">
                                Growth Strategy
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <IconCalendar className="h-4 w-4" />
                          <span className="font-body">
                            {formatDate(post.date)}
                          </span>
                          {post.readTime && (
                            <>
                              <IconClock className="h-4 w-4 ml-2" />
                              <span className="font-body">{post.readTime}</span>
                            </>
                          )}
                        </div>

                        <CardTitle className="font-heading text-xl leading-tight group-hover:text-primary transition-colors">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="hover:underline"
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <p className="font-body text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-6">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs font-body"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs font-body"
                              >
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <Link href={`/blog/${post.slug}`}>
                          <Button className="w-full font-body group-hover:shadow-md transition-shadow">
                            Read Insights
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Call to Action */}
            <section className="mt-16">
              <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
                <CardContent className="text-center py-12">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                    Ready to Build Authority on Reddit?
                  </h3>
                  <p className="font-body text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                    Turn these strategies into action with Reddinbox. Build
                    genuine relationships, establish authority, and generate
                    qualified leads through authentic community engagement.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="font-body">
                      Start Building Authority
                    </Button>
                    <Button variant="outline" size="lg" className="font-body">
                      See How It Works
                    </Button>
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
