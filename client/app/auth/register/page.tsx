"use client";

import { BrandReddinbox } from "@/components/icons/BrandReddinbox";
import { IconBrandGoogle } from "@/components/icons/IconBrandGoogle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseClient } from "@/lib/supabase/client";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// EMAIL VALIDATION SCHEMA
const emailSchema = z.object({
  email: z.email().min(1, "Email is required"),
});

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const supabase = supabaseClient();

  const handleEmailSubmit = async (email: string) => {
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
      return toast.error("Failed to sign izn with Google");
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-lg">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-bold">Welcome to</h2>
              <Link
                href="/"
                className="flex items-center gap-2 font-medium hover:scale-105 transition-all"
              >
                <h1 className="text-2xl font-bold text-primary">Reddinbox</h1>
                <BrandReddinbox className="size-6 text-primary" />
                <span className="sr-only">Reddinbox</span>
              </Link>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  disabled={isEmailLoading || isGoogleLoading || otpSent}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => handleEmailSubmit(email)}
                disabled={isEmailLoading || isGoogleLoading || otpSent}
              >
                {isEmailLoading ? (
                  <>
                    <IconLoader2 className="size-5 animate-spin mr-2" />
                    Sending magic link...
                  </>
                ) : (
                  "Sign up with Email"
                )}
              </Button>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-muted text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isEmailLoading || isGoogleLoading || otpSent}
            >
              {isGoogleLoading ? (
                <>
                  <IconLoader2 className="size-5 animate-spin mr-2" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <IconBrandGoogle className="size-4" />
                  Continue with Google
                </>
              )}
            </Button>
          </div>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <Link href="/terms-of-service">Terms of Service</Link> and{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
