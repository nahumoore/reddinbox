import { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { subscriptionExpiredEmailTemplate } from "../../defs/email-template/subscription-expired";

const resend = new Resend(process.env.RESEND_API_KEY);

export const checkSubscriptions = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  console.log("🔄 Starting check subscriptions cron job...");

  try {
    // GET CURRENT DATE (START OF TODAY IN UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // GET ALL USERS WITH ACTIVE OR FREE-TRIAL SUBSCRIPTIONS THAT EXPIRE TODAY
    const { data: expiredUsers, error: fetchError } = await supabase
      .from("user_info")
      .select(
        "id, auth_user_id, email, name, subscription_status, subscription_period_end_at"
      )
      .in("subscription_status", ["active", "free-trial"])
      .lte("subscription_period_end_at", todayISO);

    if (fetchError) {
      console.error("❌ Error fetching expired subscriptions:", fetchError);
      throw fetchError;
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      console.log("✅ No expired subscriptions found");
      return { success: true, processedCount: 0 };
    }

    console.log(`📊 Found ${expiredUsers.length} expired subscription(s)`);

    // PROCESS EACH EXPIRED SUBSCRIPTION
    let successCount = 0;
    let errorCount = 0;

    for (const user of expiredUsers) {
      try {
        // UPDATE SUBSCRIPTION STATUS TO STOPPED
        const { error: updateError } = await supabase
          .from("user_info")
          .update({ subscription_status: "stopped" })
          .eq("id", user.id);

        if (updateError) {
          console.error(`❌ Error updating user ${user.id}:`, updateError);
          errorCount++;
          continue;
        }

        // SEND EXPIRATION EMAIL IF USER HAS EMAIL
        if (user.email) {
          const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
          const firstName = user.name?.split(" ")[0] || "there";

          const emailHtml = subscriptionExpiredEmailTemplate({
            first_name: firstName,
            dashboard_url: dashboardUrl,
            was_trial: user.subscription_status === "free-trial",
          });

          const { error: emailError } = await resend.emails.send({
            from: "Reddinbox <notifications@reddinbox.com>",
            to: user.email,
            subject:
              user.subscription_status === "free-trial"
                ? "Your Reddinbox Trial Has Ended"
                : "Your Reddinbox Subscription Has Expired",
            html: emailHtml,
          });

          if (emailError) {
            console.error(
              `❌ Error sending email to ${user.email}:`,
              emailError
            );
          } else {
            console.log(`✅ Sent expiration email to ${user.email}`);
          }
        }

        successCount++;
        console.log(`✅ Updated subscription status for user ${user.id}`);
      } catch (error) {
        console.error(`❌ Error processing user ${user.id}:`, error);
        errorCount++;
      }
    }

    console.log(
      `🏁 Check subscriptions completed: ${successCount} successful, ${errorCount} errors`
    );

    return {
      success: true,
      processedCount: successCount,
      errorCount,
    };
  } catch (error) {
    console.error("❌ Check subscriptions job failed:", error);
    throw error;
  }
};
