"use server";
import { supabaseServer } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const origin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://reddinbox.com";

const planPriceId = "price_1SJdQmH8SnaGZmukSNqKEOfm";

export async function stripeBuyPlanRedirect() {
  const supabaseAuth = await supabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return false;
  }

  try {
    // CREATE STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [
        {
          price: planPriceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/plan-upgraded`,
      cancel_url: `${origin}/dashboard`,
      allow_promotion_codes: true,
    });

    // REDIRECT TO STRIPE
    return session.url;
  } catch (error) {
    console.error(error);
    return false;
  }
}
