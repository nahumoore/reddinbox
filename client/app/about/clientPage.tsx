"use client";

import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { cn } from "@/lib/utils";
import TopRedditPost from "@/public/about/top-reddit-post.webp";
import FounderImage from "@/public/founder.webp";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 relative">
              <div className="relative w-40 h-40 mx-auto mb-8">
                <Image
                  src={FounderImage}
                  alt="Nicolas - Founder of Reddinbox, building Reddit growth and lead generation tools"
                  width={160}
                  height={160}
                  priority
                  className="rounded-full object-cover border-4 border-primary/20 shadow-xl shadow-primary/10 hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 font-heading">
                Hey, I&apos;m Nicolas 👋
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                I&apos;m a Salesforce developer by day and a serial side project
                builder by night. Like many of you, I&apos;m on a mission to hit
                that elusive{" "}
                <span className="text-primary font-semibold">
                  10k MRR milestone
                </span>
                .
              </p>
            </div>
          </div>
        </section>

        {/* The Breakthrough Story */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-8 font-heading">
              The Reddit Breakthrough{" "}
              <span className="text-muted-foreground">(and Headache)</span>
            </h2>
            <div className="space-y-6 text-lg text-foreground/90 leading-relaxed">
              <p>
                A few months ago, I wrote a post about idea validation on
                r/SaaS. It went viral. Suddenly, my DMs exploded with people
                asking for advice, validation help, and just wanting to connect.
                It was incredible—I&apos;d accidentally built real authority in
                the startup community.
              </p>
              <p className="text-2xl font-semibold text-foreground">
                But here&apos;s the thing: Reddit became chaos.
              </p>
            </div>
          </div>
        </section>

        {/* Image Placeholder 1 */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden aspect-video flex items-center justify-center mb-6">
              <Image
                src={TopRedditPost}
                alt="Top Reddit Post"
                className="object-cover border-2 border-primary/20 rounded-2xl"
              />
            </div>
            <p className="text-center text-lg font-medium text-foreground">
              That post became one of the most popular posts on{" "}
              <Link
                href="https://www.reddit.com/r/SaaS/top/?t=all"
                rel="noopener noreferrer"
                target="_blank"
                className="text-primary hover:underline"
              >
                r/SaaS
              </Link>{" "}
              (top 10)!!
            </p>
          </div>
        </section>

        {/* The Chaos List */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-foreground/90 mb-8 leading-relaxed">
              I had:
            </p>
            <ul className="space-y-4 mb-12">
              {[
                "Dozens of conversations scattered across threads",
                "Potential leads buried in comment replies",
                "No way to track who I'd helped or follow up with",
                "Zero organization for people who might actually need my products",
                "Opportunities slipping through the cracks daily",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-lg text-foreground/90"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/20 text-destructive flex items-center justify-center text-sm font-bold mt-0.5">
                    ✗
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xl text-foreground/80 italic leading-relaxed border-l-4 border-primary/30 pl-6 py-2">
              I&apos;d open Reddit intending to spend 20 minutes, then lose 2
              hours jumping between tabs trying to remember who said what and
              where.
            </p>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-8 font-heading">
              The Problem I Kept Ignoring
            </h2>
            <div className="space-y-6 text-lg text-foreground/90 leading-relaxed">
              <p>
                As a builder, my biggest struggle has always been finding the
                right people to validate ideas with and get honest feedback
                from. I know SEO, I understand cold email, but I was terrible at
                the distribution piece—at actually finding and connecting with
                my ICP.
              </p>
              <p>
                Reddit was right there, full of my ideal customers having real
                conversations about their problems. But treating it like a lead
                generation tool felt impossible. The platform isn&apos;t built
                for that. It&apos;s built for discussions, not business.
              </p>
            </div>
          </div>
        </section>

        {/* Why Reddinbox Exists */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-8 font-heading">
              Why Reddinbox Exists
            </h2>
            <div className="space-y-6 text-lg text-foreground/90 leading-relaxed mb-12">
              <p>
                I built{" "}
                <Link href="/" className="text-primary hover:underline">
                  Reddinbox
                </Link>{" "}
                because I was tired of choosing between two bad options:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20">
                  <p className="text-foreground font-semibold">
                    ❌ Spam Reddit with promotional content (and get banned)
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20">
                  <p className="text-foreground font-semibold">
                    ❌ Build genuine relationships but lose track of every
                    opportunity
                  </p>
                </div>
              </div>
              <p className="text-xl font-semibold text-foreground pt-6">
                There had to be a better way—one where you could be
                authentically helpful, build real authority, AND actually
                capture value from those relationships.
              </p>
            </div>

            {/* The Solution */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/20 p-8 sm:p-12">
              <p className="text-2xl font-bold text-foreground mb-8">
                Reddinbox is that middle path. It helps you:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Track conversations that matter without drowning in noise",
                  "Identify potential customers organically through your helpful responses",
                  "Build authority first, generate leads second (the way Reddit actually works)",
                  "Stay organized without needing 47 browser tabs open",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-lg text-foreground"
                  >
                    <IconCheck
                      className="flex-shrink-0 w-6 h-6 text-primary mt-0.5"
                      stroke={3}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 text-lg text-foreground/90 leading-relaxed">
              <p>
                This it&apos;s about being
                <span className="font-semibold text-primary">
                  {" "}
                  systematically helpful
                </span>{" "}
                in a way that also grows your business. Because the people DMing
                you for advice today could be your customers tomorrow, if you
                don&apos;t lose them in the chaos.
              </p>
              <p className="text-xl font-semibold text-foreground">
                If you&apos;ve ever had a breakthrough on Reddit but felt
                overwhelmed managing it all, this tool is for you.
              </p>
              <p className="text-2xl font-bold text-primary text-center py-8">
                Let&apos;s build authority the right way.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-2xl p-12 shadow-2xl shadow-primary/20">
              <h3 className="text-3xl font-bold text-primary-foreground mb-6">
                Ready to Turn Reddit Authority into Revenue?
              </h3>
              <p className="text-lg text-primary-foreground/90 mb-8">
                Start your free trial today and never lose another opportunity
                in the Reddit chaos.
              </p>
              <Link
                href="/auth/register"
                className={cn(
                  "inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg",
                  "hover:scale-105 transition-all hover:shadow-xl cursor-pointer"
                )}
              >
                Start Free Trial
                <IconArrowRight className="size-5" stroke={3} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
