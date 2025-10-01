"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const origin = process.env.NEXT_PUBLIC_CLIENT_URL;

export async function stripeCustomerPortalRedirect() {
  // CHECK USER
  const supabaseUserCheck = await supabaseServer();
  const {
    data: { user },
  } = await supabaseUserCheck.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: true, message: "User not found" },
      { status: 404 }
    );
  }

  // START DB SUPABASE
  const supabase = supabaseAdmin;
  const { data } = await supabase
    .from("user_info")
    .select("stripe_customer_id")
    .eq("auth_user_id", user.id)
    .single();

  if (!data?.stripe_customer_id)
    return NextResponse.json(
      { error: true, message: "Customer not found" },
      { status: 404 }
    );

  // REDIRECT TO STRIPE CUSTOMER PORTAL
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${origin}/dashboard/settings?tab=billing`,
  });

  redirect(session.url);
}
