import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  // CHECK USER
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // GET REDDIT ACCOUNT
  const supabase = supabaseAdmin;
  const { data: redditAccount } = await supabase
    .from("reddit_accounts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!redditAccount) {
    return NextResponse.json(
      { error: "Reddit account not found" },
      { status: 404 }
    );
  }

  // DELETE REDDIT ACCOUNT
  const { error: deleteError } = await supabase
    .from("reddit_accounts")
    .update({
      is_active: false,
      refresh_token: null,
      access_token: null,
      token_expires_at: null,
      oauth_scopes: null,
    })
    .eq("id", redditAccount.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to delete Reddit account" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Reddit account deleted successfully" },
    { status: 200 }
  );
}
