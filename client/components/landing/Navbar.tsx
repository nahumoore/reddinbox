"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { BrandReddinbox } from "../icons/BrandReddinbox";
import { buttonVariants } from "../ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-end gap-6">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <BrandReddinbox className="text-primary size-8" />
              <span className="text-xl font-bold text-foreground">
                Reddinbox
              </span>
            </Link>
            <div className="flex items-end gap-4">
              <Link
                href="#benefits"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Benefits
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-baseline space-x-2">
              <Link
                href="/auth/login"
                className={buttonVariants({ variant: "outline" })}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-primary text-primary-foreground p-2 rounded-lg font-semibold hover:opacity-90 shadow-lg hover:scale-105 hover:shadow-lg transition-all hover:shadow-primary/20 cursor-pointer flex items-center gap-2"
              >
                Start Free Trial
                <IconArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-md border-t border-border">
              <a
                href="#features"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                About
              </a>
              <button className="w-full text-left bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Get Notified
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
