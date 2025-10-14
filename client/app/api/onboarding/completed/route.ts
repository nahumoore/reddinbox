import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";

export const POST = async (req: NextRequest) => {
  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // UPDATE USER INFO
  const supabase = supabaseAdmin;
  const { error: userInfoError } = await supabase
    .from("user_info")
    .update({
      onboarding_completed: true,
    })
    .eq("auth_user_id", user.id);

  if (userInfoError) {
    return NextResponse.json({ error: userInfoError.message }, { status: 500 });
  }

  // GENERATE FIRST INTERACTIONS (Background Job)
  // Uses Next.js 15's after() API to run this after the response is sent
  // This ensures the fetch completes even in Vercel's serverless environment
  after(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reddit/generate-first-interactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SERVER_API_KEY}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (!response.ok) {
        console.error(
          `Failed to generate first interactions: ${response.status} ${response.statusText}`
        );
      } else {
        console.log(
          `Successfully triggered first interactions for user ${user.id}`
        );
      }
    } catch (error) {
      console.error("Failed to generate first interactions:", error);
    }
  });

  return NextResponse.json({ message: "Onboarding completed" });
};
