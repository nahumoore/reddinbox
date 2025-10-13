interface SubscriptionExpiredEmailParams {
  first_name: string;
  dashboard_url: string;
  was_trial: boolean;
}

export const subscriptionExpiredEmailTemplate = ({
  first_name,
  dashboard_url,
  was_trial,
}: SubscriptionExpiredEmailParams): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${
      was_trial ? "Your Trial Has Ended" : "Subscription Expired"
    } - Reddinbox</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: left;">
                            <div style="font-size: 24px; font-weight: 600; color: #FF4500; margin-bottom: 4px;">
                                Reddinbox
                            </div>
                            <div style="font-size: 12px; color: #575757; letter-spacing: 0.5px;">
                                BUILD AUTHORITY • GENERATE LEADS
                            </div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Hey ${first_name},
                            </p>

                            ${
                              was_trial
                                ? `
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Your Reddinbox trial has come to an end. I hope you enjoyed exploring how we can help you build authority and generate leads on Reddit!
                            </p>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                During your trial, you discovered how Reddinbox can help you:
                            </p>

                            <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 16px; line-height: 24px; color: #333333;">
                                <li style="margin-bottom: 8px;">Find relevant Reddit conversations in your niche</li>
                                <li style="margin-bottom: 8px;">Generate authentic, valuable responses that build trust</li>
                                <li style="margin-bottom: 8px;">Track your authority and engagement across communities</li>
                            </ul>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Ready to continue building your Reddit presence and turn conversations into customers?
                            </p>
                            `
                                : `
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Your Reddinbox subscription has expired. We've paused your account, but all your data and progress are safe.
                            </p>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Your Reddit authority-building journey doesn't have to stop here. Continue discovering opportunities and generating leads with just a few clicks.
                            </p>
                            `
                            }

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 24px 0;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #FF4500;">
                                        <a href="${dashboard_url}" style="display: inline-block; padding: 12px 32px; font-size: 16px; font-weight: 500; color: #ffffff; text-decoration: none;">
                                            ${
                                              was_trial
                                                ? "Upgrade Now"
                                                : "Reactivate Your Account"
                                            }
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                                ${
                                  was_trial
                                    ? "No credit card was charged during your trial. You can upgrade anytime to unlock unlimited access."
                                    : "You can reactivate your subscription anytime. All your settings, connections, and history will be right where you left them."
                                }
                            </p>

                            <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Questions? Just reply to this email – I read every message and I'm here to help.
                            </p>

                            <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Best,<br>
                                Nicolas,<br>
                                Founder of Reddinbox
                            </p>

                            <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 20px; color: #666666; font-style: italic;">
                                P.S. Building authority on Reddit takes time, but the leads you generate are worth the wait. I'd love to see you back in the platform!
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; font-size: 12px; line-height: 18px; color: #999999;">
                                You're receiving this because your ${
                                  was_trial ? "trial" : "subscription"
                                } with Reddinbox has ended.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
