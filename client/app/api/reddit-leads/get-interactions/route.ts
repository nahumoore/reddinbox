import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
  }

  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  // GET INTERACTIONS FOR THIS LEAD
  const supabase = supabaseAdmin;
  const { data: interactions } = await supabase
    .from("reddit_user_interactions")
    .select(
      `
      id,
      status,
      created_at,
      our_interaction_content,
      interaction_type,
      error_message,
      reddit_content_discovered:reddit_content_discovered_id (
        title,
        reddit_url,
        content,
        ups,
        downs,
        subreddit:subreddit_id (
          display_name_prefixed
        )
      )
    `
    )
    .eq("reddit_lead", id)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ interactions });
}
