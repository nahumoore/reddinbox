import { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { interactionsLimitReachedEmailTemplate } from "../../defs/email-template/interactions-limit-reached";
import { trackEmailNotification } from "../../helpers/track-email-notification";

type ActiveUser = {
  auth_user_id: string;
  email: string | null;
  name: string | null;
};

/**
 * SEND REVIEW REMINDER EMAILS TO USERS WHO REACHED MAX INTERACTIONS
 * Only sends if user hasn't received an interactions-limit-reached email today
 */
export const sendReviewReminderEmails = async (
  supabase: SupabaseClient,
  activeUsers: ActiveUser[],
  newInteractionCountMap: Map<string, number>,
  maxInteractions: number
): Promise<number> => {
  console.log("📧 Checking for users who need review reminder emails...");

  const resend = new Resend(process.env.RESEND_API_KEY);
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  let emailsSent = 0;

  // GET USER IDS WHO NEED EMAILS (HAVE EXACTLY MAX_INTERACTIONS)
  const usersNeedingEmails = activeUsers.filter((user) => {
    const interactionCount = newInteractionCountMap.get(user.auth_user_id) || 0;
    return interactionCount === maxInteractions && user.email;
  });

  if (usersNeedingEmails.length === 0) {
    console.log("ℹ️ No users need review reminder emails");
    return emailsSent;
  }

  // GET START OF TODAY (UTC)
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const startOfTodayISO = startOfToday.toISOString();

  // QUERY EMAIL_NOTIFICATIONS TO CHECK WHO ALREADY RECEIVED EMAIL TODAY (OPTIMIZED - SINGLE QUERY)
  const userIds = usersNeedingEmails.map((u) => u.auth_user_id);
  const { data: emailsSentToday, error: queryError } = await supabase
    .from("email_notifications")
    .select("user_id")
    .in("user_id", userIds)
    .eq("reason", "interactions-limit-reached")
    .eq("status", "sent")
    .gte("sent_at", startOfTodayISO);

  if (queryError) {
    console.error("❌ Error querying email notifications:", queryError);
    // CONTINUE WITH ALL USERS IF QUERY FAILS
  }

  // CREATE SET OF USER IDS WHO ALREADY RECEIVED EMAIL TODAY
  const usersWithEmailToday = new Set<string>();
  if (emailsSentToday) {
    for (const record of emailsSentToday) {
      usersWithEmailToday.add(record.user_id);
    }
  }

  console.log(
    `ℹ️ ${usersWithEmailToday.size} users already received email today, skipping...`
  );

  // SEND EMAILS TO USERS WHO HAVEN'T RECEIVED ONE TODAY
  for (const user of usersNeedingEmails) {
    // SKIP IF USER ALREADY RECEIVED EMAIL TODAY
    if (usersWithEmailToday.has(user.auth_user_id)) {
      console.log(
        `⏭️ Skipping email to ${user.email} - already sent today (User ID: ${user.auth_user_id})`
      );
      continue;
    }

    try {
      const dashboardUrl = `${clientUrl}/dashboard/authority-feed`;

      const emailHtml = interactionsLimitReachedEmailTemplate({
        first_name: user.name || "there",
        interaction_count: maxInteractions,
        dashboard_url: dashboardUrl,
      });

      const { error: emailError } = await resend.emails.send({
        from: "Reddinbox <notifications@reddinbox.com>",
        to: user.email!,
        subject: "Action Required: Review Your Interactions",
        html: emailHtml,
      });

      if (emailError) {
        console.error(`❌ Error sending email to ${user.email}:`, emailError);
        // TRACK FAILED EMAIL NOTIFICATION
        await trackEmailNotification(supabase, {
          userId: user.auth_user_id,
          email: user.email!,
          reason: "interactions-limit-reached",
          status: "failed",
          errorMessage:
            emailError instanceof Error ? emailError.message : "Unknown error",
        });
      } else {
        emailsSent++;
        console.log(
          `📧 Review reminder email sent to ${user.email} (User ID: ${user.auth_user_id})`
        );
        // TRACK SUCCESSFUL EMAIL NOTIFICATION
        await trackEmailNotification(supabase, {
          userId: user.auth_user_id,
          email: user.email!,
          reason: "interactions-limit-reached",
          status: "sent",
        });
      }
    } catch (emailError) {
      console.error(
        `❌ Failed to send review reminder email to ${user.email}:`,
        emailError
      );
    }
  }

  if (emailsSent > 0) {
    console.log(`✅ Sent ${emailsSent} review reminder email(s)`);
  }

  return emailsSent;
};
