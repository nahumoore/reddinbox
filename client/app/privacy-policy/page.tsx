import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Reddinbox",
  description: "Privacy Policy for Reddinbox - Reddit CRM Platform",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                1. Introduction
              </h2>
              <p className="text-foreground leading-relaxed">
                Reddinbox (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
                respects your privacy and is committed to protecting your
                personal data. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our Reddit
                CRM platform and related services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold mb-3 text-foreground">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
                <li>Account information (email, username, password)</li>
                <li>Profile information (name, company, contact details)</li>
                <li>
                  Reddit account credentials (through OAuth authentication)
                </li>
                <li>
                  Communications and messages you send through our platform
                </li>
                <li>Support requests and feedback</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">
                2.2 Information from Reddit
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                With your authorization, we access and store information from
                your Reddit account, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
                <li>Reddit username and profile information</li>
                <li>Direct messages and private conversations</li>
                <li>Subreddit interactions and comments</li>
                <li>Karma, account age, and other Reddit metrics</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">
                2.3 Automatically Collected Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Usage data and analytics (pages visited, features used)</li>
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                3. How We Use Your Information
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Provide and maintain our CRM services</li>
                <li>Manage your Reddit communications and contacts</li>
                <li>
                  Generate analytics and insights about your Reddit activity
                </li>
                <li>Improve our platform and develop new features</li>
                <li>Provide customer support and technical assistance</li>
                <li>Send important updates about our services</li>
                <li>Ensure security and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information. We may
                share information in these limited circumstances:
              </p>

              <h3 className="text-xl font-semibold mb-3 text-foreground">
                4.1 Service Providers
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                We work with trusted third-party service providers who help us
                operate our platform (hosting, analytics, support). These
                providers are bound by confidentiality agreements and can only
                use your data to provide services to us.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-foreground">
                4.2 Legal Requirements
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                We may disclose information when required by law, such as in
                response to court orders, legal processes, or government
                requests.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-foreground">
                4.3 Business Transfers
              </h3>
              <p className="text-foreground leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, user
                information may be transferred as part of the transaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                5. Data Security
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                We implement industry-standard security measures to protect your
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Encryption in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication protocols</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                However, no system is 100% secure, and we cannot guarantee
                absolute security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                6. Data Retention
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                We retain your information for as long as necessary to provide
                our services and fulfill the purposes described in this policy.
                Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Account information: Until you delete your account</li>
                <li>
                  Reddit data: Until you revoke access or delete your account
                </li>
                <li>
                  Usage analytics: Aggregated data may be retained indefinitely
                </li>
                <li>
                  Support communications: Up to 3 years for quality assurance
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                7. Your Rights and Choices
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Request your data in a portable
                  format
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of data
                  processing
                </li>
                <li>
                  <strong>Revoke consent:</strong> Withdraw permission for
                  Reddit access
                </li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at
                privacy@reddinbox.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                8. Cookies and Tracking
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your
                experience and collect usage information. You can control
                cookies through your browser settings, though some features may
                not function properly if cookies are disabled.
              </p>
              <p className="text-foreground leading-relaxed">
                We use both session cookies (deleted when you close your
                browser) and persistent cookies (stored until expiration or
                deletion).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                9. International Data Transfers
              </h2>
              <p className="text-foreground leading-relaxed">
                Your information may be processed and stored in countries other
                than your own. We ensure appropriate safeguards are in place to
                protect your data in accordance with this Privacy Policy and
                applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-foreground leading-relaxed">
                Reddinbox is not intended for use by individuals under 13 years
                of age. We do not knowingly collect personal information from
                children under 13. If we become aware of such data collection,
                we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                11. Changes to This Policy
              </h2>
              <p className="text-foreground leading-relaxed">
                We may update this Privacy Policy periodically. We will notify
                you of significant changes via email or through our platform.
                The &quot;Last updated&quot; date indicates when the policy was
                last modified.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                12. Contact Information
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact us:
              </p>
              <div className="text-foreground space-y-1">
                <p>Email: contact@reddinbox.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
