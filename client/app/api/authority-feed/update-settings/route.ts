import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // PARSE REQUEST BODY
  const body = await req.json();
  const { website_id, post_categories_active } = body;

  if (!website_id || !Array.isArray(post_categories_active)) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // UPDATE WEBSITE AUTHORITY FEED OPTIONS
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("websites")
    .update({
      authority_feed_options: {
        post_categories_active,
      },
    })
    .eq("id", website_id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, message: "Settings updated successfully" });
};
