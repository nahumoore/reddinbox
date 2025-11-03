"use client";

import { BrandReddinbox } from "@/components/icons/BrandReddinbox";
import { IconBrandGoogle } from "@/components/icons/IconBrandGoogle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseClient } from "@/lib/supabase/client";
import { IconCircleCheck, IconLoader2, IconMail } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// EMAIL VALIDATION SCHEMA
const emailSchema = z.string().email("Please enter a valid email");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const supabase = supabaseClient();

  const handleEmailSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!emailSchema.safeParse(email).success) {
      return toast.error("Please enter a valid email");
    }

    setIsEmailLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setIsEmailLoading(false);
      return toast.error("Failed to send magic link");
    }

    setOtpSent(true);
    setIsEmailLoading(false);
    toast.success("Magic link sent to your email");
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setIsGoogleLoading(false);
      return toast.error("Failed to sign in with Google");
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <motion.div
        className="w-full max-w-sm md:max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <h2 className="font-body text-lg text-muted-foreground">
                Welcome back to
              </h2>
              <Link
                href="/"
                className="flex items-center gap-2 font-heading hover:scale-105 transition-transform"
              >
                <h1 className="text-3xl font-bold text-primary">Reddinbox</h1>
                <BrandReddinbox className="size-7 text-primary" />
                <span className="sr-only">Reddinbox</span>
              </Link>
              <p className="font-body text-center text-sm text-muted-foreground mt-1 max-w-md">
                Continue building your Reddit authority and generating leads
              </p>
            </div>
            <div className="text-center text-sm font-body">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Auth Form */}
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.div
                key="auth-form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Email Form */}
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className="font-body text-sm font-medium"
                    >
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      disabled={isEmailLoading || isGoogleLoading}
                      onChange={(e) => setEmail(e.target.value)}
                      className="font-body"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-body"
                    disabled={isEmailLoading || isGoogleLoading}
                  >
                    {isEmailLoading ? (
                      <>
                        <IconLoader2 className="size-4 animate-spin mr-2" />
                        Sending magic link...
                      </>
                    ) : (
                      <>
                        <IconMail className="size-4 mr-2" />
                        Login with Email
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-muted text-muted-foreground relative z-10 px-3 font-body">
                    Or continue with
                  </span>
                </div>

                {/* Google Sign In */}
                <Button
                  variant="outline"
                  type="button"
                  className="w-full font-body"
                  onClick={handleGoogleLogin}
                  disabled={isEmailLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin mr-2" />
                      Connecting to Google...
                    </>
                  ) : (
                    <>
                      <IconBrandGoogle className="size-4 mr-2" />
                      Continue with Google
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="bg-primary/10 rounded-full p-3">
                  <IconCircleCheck className="size-12 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-heading text-xl font-semibold">
                    Check your email
                  </h3>
                  <p className="font-body text-sm text-muted-foreground max-w-sm">
                    We&apos;ve sent a magic link to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="font-body text-xs text-muted-foreground pt-2">
                    Click the link in the email to complete your login
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terms & Privacy */}
          <div className="text-muted-foreground text-center text-xs text-balance font-body">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-of-service"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </motion.div>
    </div>
  );
}
