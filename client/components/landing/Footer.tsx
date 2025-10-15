"use client";

import { IconBrandX } from "@tabler/icons-react";
import Link from "next/link";
import { BrandReddinbox } from "../icons/BrandReddinbox";
import { Badge } from "../ui/badge";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-2 gap-2">
              <BrandReddinbox className="text-primary size-8" />
              <span className="text-xl font-bold text-foreground">
                Reddinbox
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Build authentic authority on Reddit through strategic community
              engagement. Turn relationships into revenue - without looking like
              a marketer.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://x.com/nicolasmore_"
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconBrandX className="size-6" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#benefits"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <div className="text-muted-foreground flex items-center gap-2">
                  Blog
                  <Badge variant="outline">Coming Soon...</Badge>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-muted-foreground text-sm">
              © 2025 Reddinbox. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
