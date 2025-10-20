"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import {
  IconArrowRight,
  IconLoader2,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandReddinbox } from "../icons/BrandReddinbox";
import { buttonVariants } from "../ui/button";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}

function NavLink({ href, children, onClick, mobile = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors group",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </Link>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = supabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setLoggedUser(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-2 group"
            >
              <BrandReddinbox className="text-primary size-8 transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold font-heading text-foreground">
                Reddinbox
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              <NavLink href="/#benefits">Benefits</NavLink>
              <NavLink href="/#how-it-works">How It Works</NavLink>
              <NavLink href="/free-tools">Free Tools</NavLink>
              <NavLink href="/about">About</NavLink>
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2">
                <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            ) : loggedUser ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "group"
                )}
              >
                Go to Dashboard
                <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={buttonVariants({ variant: "ghost" })}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "group shadow-sm"
                  )}
                >
                  Start Free Trial
                  <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconX className="size-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconMenu2 className="size-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-4 space-y-2 bg-white/90 backdrop-blur-md border-t border-border">
                <NavLink
                  href="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  mobile
                >
                  Blog
                </NavLink>
                <NavLink
                  href="/free-tools"
                  onClick={() => setIsMenuOpen(false)}
                  mobile
                >
                  Free Tools
                </NavLink>
                <NavLink
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  mobile
                >
                  About
                </NavLink>

                <div className="pt-4 space-y-2 border-t border-border mt-2">
                  {loading ? (
                    <div className="w-full bg-primary/10 text-primary px-4 py-3 rounded-lg flex items-center justify-center gap-2">
                      <IconLoader2 className="size-4 animate-spin" />
                      <span className="text-sm font-medium">Loading...</span>
                    </div>
                  ) : loggedUser ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full justify-center"
                      )}
                    >
                      Go to Dashboard
                      <IconArrowRight className="ml-2 size-4" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full justify-center"
                        )}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full justify-center"
                        )}
                      >
                        Start Free Trial
                        <IconArrowRight className="ml-2 size-4" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
