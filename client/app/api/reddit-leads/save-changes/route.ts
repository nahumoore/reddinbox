import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { id, field, value } = await req.json();

  // CHECK PARAMS
  if (!id || !field || value === undefined || value === null) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // PERFORM CHANGES
  console.log("id", id);
  console.log("field", field);
  console.log("value", value);

  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("reddit_leads")
    .update({ [field]: value })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ data }));
};
