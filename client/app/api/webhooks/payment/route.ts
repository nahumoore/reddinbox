import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const secret = process.env.STRIPE_WEBHOOK_SECRET!;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("Stripe-Signature")!;

    // BUILD STRIPE EVENT
    const event: Stripe.Event = stripe.webhooks.constructEvent(
      payload,
      signature,
      secret
    );

    // GET SUPABASE CLIENT
    const supabase = supabaseAdmin;

    // UTC DATES
    const startDate = new Date().toUTCString();
    const endDate = new Date(
      new Date().getTime() + 30 * 24 * 60 * 60 * 1000
    ).toUTCString();

    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // GET CUSTOMER EMAIL FROM STRIPE
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer || customer.deleted) {
          throw new Error("Customer not found");
        }

        // GET THE PRICE ID FROM THE SUBSCRIPTION
        const priceId = subscription.items.data[0].price.id;

        if (!priceId) {
          throw new Error("Plan not found");
        }

        // UPDATE USER INFO
        const { error: userInfoError } = await supabase
          .from("user_info")
          .update({
            stripe_customer_id: customerId,
            subscription_period_started_at: startDate,
            subscription_period_end_at: endDate,
            subscription_status: "active",
          })
          .eq("email", customer.email!);

        if (userInfoError) {
          console.log(userInfoError);
          throw new Error(userInfoError?.message || "User not found");
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        if (!customerId) {
          throw new Error("Starter plan not found");
        }

        // CANCEL USER SUBSCRIPTION
        const { error } = await supabase
          .from("user_info")
          .update({
            subscription_status: "stopped",
            subscription_period_started_at: startDate,
            subscription_period_end_at: endDate,
          })
          .eq("stripe_customer_id", customerId);

        if (error) throw error;
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        if (!customerId) {
          throw new Error("Customer not found");
        }

        // UPDATE USER INFO
        const { error } = await supabase
          .from("user_info")
          .update({
            subscription_status: "stopped",
            subscription_period_started_at: startDate,
            subscription_period_end_at: endDate,
          })
          .eq("stripe_customer_id", customerId);

        if (error) throw error;
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
