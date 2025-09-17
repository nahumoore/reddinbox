import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabaseAuth = await supabaseServer();
    const { error: sessionError } =
      await supabaseAuth.auth.exchangeCodeForSession(code);
    if (sessionError) return NextResponse.redirect(`${origin}/`);

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) return NextResponse.redirect(`${origin}/auth`);

    // CHECK IF USER EXISTS
    const supabase = supabaseAdmin;
    const { data: userInfo } = await supabase
      .from("user_info")
      .select("id, auth_user_id, onboarding_completed")
      .eq("auth_user_id", user.id)
      .single();

    if (userInfo?.id && userInfo.onboarding_completed) {
      return NextResponse.redirect(`${origin}/dashboard`);
    } else if (userInfo?.id && !userInfo.onboarding_completed) {
      return NextResponse.redirect(`${origin}/onboarding`);
    }

    // ADD USER TO SUPABASE
    const { error: userInfoError } = await supabase.from("user_info").insert({
      auth_user_id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || "",
      onboarding_completed: false,
    });

    if (userInfoError) {
      console.error(userInfoError);

      supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/auth/login`);
    }

    return NextResponse.redirect(`${origin}/onboarding`);
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
