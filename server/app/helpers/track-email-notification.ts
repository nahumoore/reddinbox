import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

type EmailNotificationReason =
  Database["public"]["Enums"]["email_notification_reason"];
type EmailNotificationStatus =
  Database["public"]["Enums"]["email_notification_status"];

export const trackEmailNotification = async (
  supabase: SupabaseClient,
  {
    userId,
    email,
    reason,
    status,
    errorMessage,
  }: {
    userId: string;
    email: string;
    reason: EmailNotificationReason;
    status: EmailNotificationStatus;
    errorMessage?: string;
  }
) => {
  try {
    // INSERT EMAIL NOTIFICATION RECORD INTO DATABASE
    const { error } = await supabase.from("email_notifications").insert({
      user_id: userId,
      email: email,
      reason: reason,
      status: status,
      error_message: errorMessage || null,
      sent_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Error tracking email notification:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to track email notification:", error);
    return { success: false, error };
  }
};
