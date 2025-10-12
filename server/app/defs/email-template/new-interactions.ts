interface NewInteractionsEmailParams {
  first_name: string;
  interaction_count: number;
  dashboard_url: string;
}

export const newInteractionsEmailTemplate = ({
  first_name,
  interaction_count,
  dashboard_url,
}: NewInteractionsEmailParams): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Interactions Are Ready - Reddinbox</title>
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
                                Great news! We've found ${interaction_count} relevant conversation${
    interaction_count === 1 ? "" : "s"
  } on Reddit where you can build authority and generate leads.
                            </p>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Your comments are ready to review. Each one is tailored to add value to the conversation while naturally positioning your expertise.
                            </p>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Here's what to do next:
                            </p>

                            <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 16px; line-height: 24px; color: #333333;">
                                <li style="margin-bottom: 8px;">Review your personalized comments</li>
                                <li style="margin-bottom: 8px;">Edit or approve each interaction</li>
                                <li style="margin-bottom: 8px;">Start engaging and building your authority</li>
                            </ul>

                            <!-- CTA Button -->
                            <table role="presentation" style="margin: 24px 0;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #FF4500;">
                                        <a href="${dashboard_url}" style="display: inline-block; padding: 12px 32px; font-size: 16px; font-weight: 500; color: #ffffff; text-decoration: none;">
                                            View Your Interactions
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Questions? Just reply to this email, I read every message.
                            </p>

                            <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                                Best,<br>
                                Nicolas,<br>
                                Founder of Reddinbox
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; font-size: 12px; line-height: 18px; color: #999999;">
                                You're receiving this because you're using Reddinbox to build authority on Reddit.
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
