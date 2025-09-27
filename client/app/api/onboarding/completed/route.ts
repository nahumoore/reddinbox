import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

  return NextResponse.json({ message: "Onboarding completed" });
};
