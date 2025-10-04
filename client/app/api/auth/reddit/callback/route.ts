import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import {
  exchangeCodeForTokens,
  storeRedditTokens,
} from "@/utils/reddit/reddit-access-token";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // CHECK USER
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/auth/login`);

  const supabase = supabaseAdmin;

  // ROLLBACK IF ERROR
  if (error || !code || !state) {
    await rollbackDatabase(supabase, user.id);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/onboarding/error`
    );
  }

  try {
    // EXCHANGE CODE FOR TOKENS AND USER DATA
    const result = await exchangeCodeForTokens(code);

    if (!result.success) {
      console.error(`Reddit OAuth error [${result.code}]:`, result.error);
      await rollbackDatabase(supabase, user.id);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_CLIENT_URL}/onboarding/error`
      );
    }

    const { tokenData, userData } = result.data!;
    const expiresAt = new Date(
      Date.now() + tokenData.expires_in * 1000
    ).toISOString();
    const scopes = tokenData.scope ? tokenData.scope.split(" ") : [];

    // CHECK IF REDDIT ACCOUNT ALREADY EXISTS
    const { data: existingAccount } = await supabase
      .from("reddit_accounts")
      .select("id")
      .eq("reddit_id", userData.id)
      .single();

    const { public_description, ...subredditInfo } = userData.subreddit;

    if (existingAccount) {
      // UPDATE EXISTING ACCOUNT
      const { error: updateError } = await supabase
        .from("reddit_accounts")
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: expiresAt,
          oauth_scopes: scopes,
          user_id: user.id,
          public_description: public_description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("reddit_id", userData.id);

      if (updateError) {
        console.error("Failed to update Reddit account:", updateError);
        await rollbackDatabase(supabase, user.id);
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_CLIENT_URL}/onboarding/error`
        );
      }
    } else {
      // CREATE NEW REDDIT ACCOUNT RECORD
      const { error: insertError } = await supabase
        .from("reddit_accounts")
        .insert({
          reddit_id: userData.id,
          name: userData.name,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: expiresAt,
          oauth_scopes: scopes,
          user_id: user.id,
          created_utc: userData.created_utc || null,
          comment_karma: userData.comment_karma || null,
          link_karma: userData.link_karma || null,
          total_karma: userData.total_karma || null,
          is_gold: userData.is_gold || null,
          is_moderator: userData.is_moderator || null,
          is_employee: userData.is_employee || null,
          has_verified_email: userData.has_verified_email || null,
          icon_img: userData.icon_img || null,
          snoovatar_img: userData.snoovatar_img || null,
          verified: userData.verified || null,
          is_suspended: userData.is_suspended || null,
          coins: userData.coins || null,
          num_friends: userData.num_friends || null,
          subreddit: subredditInfo || null,
          public_description: public_description || null,
        });

      if (insertError) {
        console.error("Failed to create Reddit account record:", insertError);
        await rollbackDatabase(supabase, user.id);
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_CLIENT_URL}/onboarding/error`
        );
      }
    }

    // STORE TOKENS IN COOKIES
    await storeRedditTokens(tokenData, userData.name);

    // REDIRECT TO COMPLETED PAGE
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/onboarding/completed`
    );
  } catch (error) {
    console.error("Unexpected error in Reddit OAuth callback:", error);
    await rollbackDatabase(supabase, user.id);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/onboarding/error`
    );
  }
}

const rollbackDatabase = async (
  supabase: SupabaseClient,
  authUserId: string
) => {
  try {
    // CLEAN UP WEBSITES
    const { error: websitesError } = await supabase
      .from("websites")
      .delete()
      .eq("user_id", authUserId);

    if (websitesError) {
      console.error("Failed to rollback websites:", websitesError);
    }
  } catch (error) {
    console.error("Error during rollback:", error);
  }
};
