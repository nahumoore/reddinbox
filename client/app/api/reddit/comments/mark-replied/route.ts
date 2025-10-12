import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { interaction_id } = await req.json();

  if (!interaction_id) {
    return NextResponse.json(
      { error: "Interaction ID is required" },
      { status: 400 }
    );
  }

  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("reddit_user_interactions")
    .update({ status: "posted" })
    .eq("id", interaction_id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Interaction marked as posted" });
};
