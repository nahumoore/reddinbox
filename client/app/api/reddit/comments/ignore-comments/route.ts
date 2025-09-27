import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // PARSE REQUEST BODY
  const { interaction_ids } = await req.json();

  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // UPDATE INTERACTION STATUS
  const supabase = supabaseAdmin;
  const { error } = await supabase
    .from("reddit_user_interactions")
    .update({
      status: "ignored",
    })
    .in("id", interaction_ids)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Comment ignored" });
};
