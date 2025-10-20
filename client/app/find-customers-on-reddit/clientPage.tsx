"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconArrowRight,
  IconBriefcase,
  IconChartBar,
  IconMessageCircle,
  IconRocket,
  IconShoppingCart,
  IconSparkles,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Mock niche guides - replace with real data when available
const nicheGuides = [
  {
    title: "SaaS & Software",
    slug: "saas-software",
    description:
      "Discover how to find early adopters and B2B customers for your SaaS product on Reddit's tech communities.",
    icon: IconRocket,
    color: "from-blue-500 to-cyan-500",
    stats: {
      subreddits: "150+",
      avgMembers: "2.3M",
      engagement: "High",
    },
    topSubreddits: ["r/SaaS", "r/startups", "r/Entrepreneur"],
  },
  {
    title: "E-commerce & Retail",
    slug: "ecommerce-retail",
    description:
      "Learn proven strategies to connect with online shoppers and build a loyal customer base for your e-commerce store.",
    icon: IconShoppingCart,
    color: "from-purple-500 to-pink-500",
    stats: {
      subreddits: "200+",
      avgMembers: "1.8M",
      engagement: "Very High",
    },
    topSubreddits: ["r/ecommerce", "r/shopify", "r/Flipping"],
  },
  {
    title: "Freelancing & Services",
    slug: "freelancing-services",
    description:
      "Master the art of finding high-quality clients for your freelance services without being spammy or salesy.",
    icon: IconBriefcase,
    color: "from-orange-500 to-red-500",
    stats: {
      subreddits: "180+",
      avgMembers: "1.5M",
      engagement: "High",
    },
    topSubreddits: ["r/forhire", "r/freelance", "r/DigitalNomad"],
  },
];

const platformStats = [
  {
    icon: IconUsers,
    value: "430M+",
    label: "Monthly Active Users",
  },
  {
    icon: IconMessageCircle,
    value: "100K+",
    label: "Active Communities",
  },
  {
    icon: IconTrendingUp,
    value: "73%",
    label: "Trust Reddit Reviews",
  },
  {
    icon: IconChartBar,
    value: "50%",
    label: "Purchase Intent",
  },
];

const features = [
  {
    icon: IconTarget,
    title: "Highly Targeted",
    description:
      "Find customers actively discussing problems your product solves",
  },
  {
    icon: IconSparkles,
    title: "Authentic Engagement",
    description:
      "Build genuine relationships without being pushy or promotional",
  },
  {
    icon: IconTrendingUp,
    title: "Proven ROI",
    description:
      "Reddit users are 4x more likely to trust peer recommendations",
  },
];

export default function FindRedditCustomersClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              <IconSparkles className="mr-1 h-3 w-3" />
              Get Leads
            </Badge>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Perfect Customers on{" "}
              <span className="text-primary">Reddit</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Discover niche-specific strategies to connect with motivated
              buyers actively seeking solutions like yours. No spam, no hard
              sells—just authentic engagement that drives real results.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="#guides">
                  Explore Guides
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Start Finding Customers</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {platformStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Reddit Section */}
      <section className="border-b py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Reddit is a Customer Goldmine
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Reddit users are highly engaged, influential, and ready to buy
            </p>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Niche Guides Section */}
      <section id="guides" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Niche-Specific Customer Acquisition Guides
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Deep-dive strategies tailored to your industry
            </p>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {nicheGuides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-xl">
                    <div className={`h-2 bg-gradient-to-r ${guide.color}`} />
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${guide.color} shadow-lg transition-transform group-hover:scale-110`}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <Badge variant="secondary">
                          {guide.stats.subreddits} Subreddits
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {guide.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {guide.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Avg Members
                          </div>
                          <div className="font-semibold">
                            {guide.stats.avgMembers}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Engagement
                          </div>
                          <div className="font-semibold">
                            {guide.stats.engagement}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 text-xs font-medium text-muted-foreground">
                          Top Subreddits
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {guide.topSubreddits.map((subreddit, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {subreddit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        className="w-full group-hover:bg-primary/90"
                        asChild
                      >
                        <Link href={`/find-customers-on-reddit/${guide.slug}`}>
                          Read Full Guide
                          <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Teaser */}
      <section className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              More niche guides coming soon for Finance, Health & Wellness,
              Education, Gaming, and more...
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Find Your Customers on Reddit?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Reddinbox automates Reddit monitoring so you never miss an
              opportunity to engage with potential customers.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Start Free Trial
                  <IconRocket className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
