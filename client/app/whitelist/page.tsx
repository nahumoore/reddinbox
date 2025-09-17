"use client";

import { BrandReddinbox } from "@/components/icons/BrandReddinbox";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabase/client";
import { IconDiscount, IconFlame, IconMessage } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function WhitelistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isSubmitted) return;

    setIsSubmitting(true);

    try {
      const supabase = supabaseClient();
      const { error } = await supabase.from("whitelist").insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("You're on the list!", {
        description: "We'll notify you when Reddinbox launches.",
      });
    } catch (error) {
      console.error("Error submitting to whitelist:", error);
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <BrandReddinbox className="w-16 h-16 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-heading">
              Get Early Access
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
              Join +120 Reddit marketers already on our waitlist. Be first to
              transform your Reddit outreach into measurable revenue.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting || isSubmitted}
                  required
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || isSubmitted}
                  required
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full"
              >
                {isSubmitting
                  ? "Joining Waitlist..."
                  : isSubmitted
                  ? "You're On The List!"
                  : "Join The Waitlist"}
              </Button>
            </form>

            {isSubmitted && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">
                      Thanks for joining! We&apos;ll email you when Reddinbox
                      launches.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4">
              No spam, ever. Unsubscribe anytime with one click.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Why Join Early?
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex items-center p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <IconFlame className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    First Access
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Be among the first 100 users to try Reddinbox when we
                    launch.
                  </p>
                </div>
              </div>

              <div className="flex items-center p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <IconDiscount className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    50% Off Launch
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Exclusive early-bird pricing for the first 3 months.
                  </p>
                </div>
              </div>

              <div className="flex items-center p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  <IconMessage className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Shape The Product
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your feedback directly influences our roadmap and features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
