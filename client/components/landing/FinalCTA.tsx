"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Highlighter } from "../ui/highlighter";

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-tl from-primary/10 via-background to-secondary/10">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 max-w-xl mx-auto">
          Start Building Authority{" "}
          <span className="text-primary">
            <Highlighter action="underline" color="#ff5700">
              That Converts!
            </Highlighter>
          </span>
        </h2>

        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Turn your Reddit activity into measurable business results. Build
          authentic authority, generate qualified leads.
        </p>

        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 h-auto font-semibold group"
        >
          <Link href="/auth/register">
            Start Building Authority
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
