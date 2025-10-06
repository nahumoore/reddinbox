import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RATE LIMITING
  const cookieStore = await cookies();
  const rateLimitCookie = cookieStore.get(`fetch_new_${user.id}`);

  if (rateLimitCookie) {
    const { count, resetTime } = JSON.parse(rateLimitCookie.value);
    const now = Date.now();

    if (now < resetTime) {
      if (count >= 2) {
        return NextResponse.json(
          { error: "You're doing this too much, wait for one hour" },
          { status: 429 }
        );
      }
    }
  }

  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("reddit_accounts")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Reddit account not found" },
      { status: 404 }
    );
  }

  // FETCH NEW COMMENTS
  const serverFetch = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reddit/check-new-comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SERVER_API_KEY}`,
      },
      body: JSON.stringify({ redditAccountId: data.id }),
    }
  );

  const serverResponse = await serverFetch.json();

  if (serverResponse.error || !serverResponse.interactions) {
    return NextResponse.json(serverResponse, { status: 500 });
  }

  // UPDATE RATE LIMIT COOKIE
  const existingCookie = cookieStore.get(`fetch_new_${user.id}`);
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  let newCount = 1;
  let newResetTime = now + oneHour;

  if (existingCookie) {
    const { count, resetTime } = JSON.parse(existingCookie.value);
    if (now < resetTime) {
      newCount = count + 1;
      newResetTime = resetTime;
    }
  }

  const response = NextResponse.json(
    { interactions: serverResponse.interactions },
    { status: 200 }
  );

  response.cookies.set(
    `fetch_new_${user.id}`,
    JSON.stringify({ count: newCount, resetTime: newResetTime }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
    }
  );

  return response;
};
