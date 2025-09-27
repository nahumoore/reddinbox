"use client";

import { Highlighter } from "../ui/highlighter";
import { NumberTicker } from "../ui/number-ticker";

export default function SocialProof() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Join{" "}
            <Highlighter action="underline" color="#ff5700">
              Reddit marketers
            </Highlighter>{" "}
            who&apos;ve stopped getting banned
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from authentic engagement. No spam, no bans, just
            genuine authority building.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Helpful Answers */}
          <div className="text-center group">
            <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl sm:text-6xl font-bold font-heading text-primary mb-2">
                <NumberTicker value={1200} className="text-primary" />+
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">
                Helpful Answers Provided
              </h3>
              <p className="text-muted-foreground">
                Community members helped with authentic, valuable responses that
                build real authority
              </p>
            </div>
          </div>

          {/* Active Users */}
          <div className="text-center group">
            <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl sm:text-6xl font-bold font-heading text-primary mb-2">
                <NumberTicker value={70} className="text-primary" />+
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">
                Reddit Marketers
              </h3>
              <p className="text-muted-foreground">
                Active users building sustainable growth through authentic
                community engagement
              </p>
            </div>
          </div>

          {/* Interest Generated */}
          <div className="text-center group">
            <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl sm:text-6xl font-bold font-heading text-primary mb-2">
                <NumberTicker value={50} className="text-primary" />+
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">
                Users Got in Touch
              </h3>
              <p className="text-muted-foreground">
                Interested users reached out after seeing authentic Reddit
                marketing in action
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
