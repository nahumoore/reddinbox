interface InteractionsLimitReachedEmailParams {
  first_name: string;
  interaction_count: number;
  dashboard_url: string;
}

export const interactionsLimitReachedEmailTemplate = ({
  first_name,
  interaction_count,
  dashboard_url,
}: InteractionsLimitReachedEmailParams): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Action Required: Review Your Interactions - Reddinbox</title>
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

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                You've reached ${interaction_count} pending interactions waiting for your review! 🎉
                            </p>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                <strong>We've paused finding new opportunities</strong> until you review your current interactions. This ensures you stay in control and can carefully manage each conversation.
                            </p>

                            <div style="margin: 24px 0; padding: 16px; background-color: #FFF4E6; border-left: 4px solid #FF4500; border-radius: 4px;">
                                <p style="margin: 0; font-size: 14px; line-height: 20px; color: #333333;">
                                    <strong>Why review matters:</strong><br>
                                    Quality over quantity is key on Reddit. Reviewing your interactions helps you maintain authenticity and build genuine authority in your communities.
                                </p>
                            </div>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Take a few minutes to:
                            </p>

                            <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 16px; line-height: 24px; color: #333333;">
                                <li style="margin-bottom: 8px;">Review and edit your generated comments</li>
                                <li style="margin-bottom: 8px;">Approve the ones you want to post</li>
                                <li style="margin-bottom: 8px;">Dismiss any that don't fit your strategy</li>
                            </ul>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Once you've reviewed your interactions, we'll automatically resume finding new opportunities for you to engage with.
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 24px 0;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #FF4500;">
                                        <a href="${dashboard_url}" style="display: inline-block; padding: 12px 32px; font-size: 16px; font-weight: 500; color: #ffffff; text-decoration: none;">
                                            Review Your Interactions
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Questions about reviewing or need help? Just reply to this email, I'm here to help!
                            </p>

                            <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Best,<br>
                                Nicolas,<br>
                                Founder of Reddinbox
                            </p>

                            <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 20px; color: #666666; font-style: italic;">
                                P.S. The best Reddit marketers review every interaction before posting. It's what separates authentic engagement from spam!
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; font-size: 12px; line-height: 18px; color: #999999;">
                                You're receiving this because you have pending interactions waiting for review on Reddinbox.
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
