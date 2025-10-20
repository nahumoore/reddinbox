import { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { feedbackRequestEmailTemplate } from "../../defs/email-template/feedback-request";
import { trackEmailNotification } from "../../helpers/track-email-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export const collectFeedback = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  console.log("🔄 Starting collect feedback cron job...");

  try {
    // CALCULATE TIMESTAMP FOR 2 HOURS AGO
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
    const twoHoursAgoISO = twoHoursAgo.toISOString();

    // CALCULATE TIMESTAMP FOR 2 DAYS AGO (MAX WINDOW)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoISO = twoDaysAgo.toISOString();

    // GET ALL ELIGIBLE USERS BASED ON ONBOARDING AND TIME WINDOW
    const { data: potentialUsers, error: fetchError } = await supabase
      .from("user_info")
      .select("auth_user_id, email, name, created_at")
      .lte("created_at", twoHoursAgoISO)
      .gte("created_at", twoDaysAgoISO)
      .not("email", "is", null);

    if (fetchError) {
      console.error("❌ Error fetching potential users:", fetchError);
      throw fetchError;
    }

    if (!potentialUsers || potentialUsers.length === 0) {
      console.log("✅ No potential users found for feedback collection");
      return { success: true, processedCount: 0 };
    }

    console.log(`📊 Found ${potentialUsers.length} potential user(s)`);

    // EXTRACT USER IDS TO CHECK AGAINST EMAIL NOTIFICATIONS
    const userIdsToCheck = potentialUsers.map((u) => u.auth_user_id);

    // CHECK WHICH USERS ALREADY RECEIVED FEEDBACK EMAILS
    const { data: notifiedUsers, error: notificationError } = await supabase
      .from("email_notifications")
      .select("user_id")
      .eq("reason", "feedback")
      .in("user_id", userIdsToCheck);

    if (notificationError) {
      console.error("❌ Error fetching notified users:", notificationError);
      throw notificationError;
    }

    // EXTRACT USER IDS WHO ALREADY RECEIVED EMAILS
    const notifiedUserIds = new Set(notifiedUsers?.map((n) => n.user_id) || []);
    console.log(`📋 Found ${notifiedUserIds.size} user(s) already notified`);

    // FILTER OUT USERS WHO ALREADY RECEIVED FEEDBACK EMAILS
    const eligibleUsers = potentialUsers.filter(
      (user) => !notifiedUserIds.has(user.auth_user_id)
    );

    if (eligibleUsers.length === 0) {
      console.log("✅ No new users to send feedback emails");
      return { success: true, processedCount: 0 };
    }

    console.log(`📧 Sending emails to ${eligibleUsers.length} user(s)`);

    // PROCESS EACH ELIGIBLE USER
    let successCount = 0;
    let errorCount = 0;

    for (const user of eligibleUsers) {
      try {
        // SEND FEEDBACK REQUEST EMAIL
        if (user.email) {
          const firstName = user.name?.split(" ")[0] || "there";

          const emailText = feedbackRequestEmailTemplate({
            first_name: firstName,
          });

          const { error: emailError } = await resend.emails.send({
            from: "Nicolas from Reddinbox <nicolas@reddinbox.com>",
            to: user.email,
            subject: "Just one minute of your time please",
            text: emailText,
          });

          if (emailError) {
            console.error(
              `❌ Error sending email to ${user.email}:`,
              emailError
            );
            // TRACK FAILED EMAIL NOTIFICATION
            await trackEmailNotification(supabase, {
              userId: user.auth_user_id,
              email: user.email,
              reason: "feedback",
              status: "failed",
              errorMessage:
                emailError instanceof Error
                  ? emailError.message
                  : "Unknown error",
            });
            errorCount++;
          } else {
            console.log(`✅ Sent feedback email to ${user.email}`);
            // TRACK SUCCESSFUL EMAIL NOTIFICATION
            await trackEmailNotification(supabase, {
              userId: user.auth_user_id,
              email: user.email,
              reason: "feedback",
              status: "sent",
            });
            successCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Error processing user ${user.auth_user_id}:`, error);
        errorCount++;
      }
    }

    console.log(
      `🏁 Collect feedback completed: ${successCount} sent, ${errorCount} errors`
    );

    return {
      success: true,
      processedCount: successCount,
      errorCount,
    };
  } catch (error) {
    console.error("❌ Collect feedback job failed:", error);
    throw error;
  }
};
