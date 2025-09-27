import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Reddinbox",
  description: "Terms of Service for Reddinbox - Reddit CRM Platform",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="prose prose-gray max-w-none">
            <h1 className="text-4xl font-bold mb-8 text-foreground">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  1. Acceptance of Terms
                </h2>
                <p className="text-foreground leading-relaxed">
                  By accessing and using Reddinbox (&quot;Service&quot;), you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  2. Service Description
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Reddinbox is a Customer Relationship Management (CRM) platform
                  designed specifically for Reddit marketing and lead
                  generation. Our service provides tools for managing Reddit
                  communications, tracking leads, and analyzing engagement
                  metrics.
                </p>
                <p className="text-foreground leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any
                  aspect of the Service at any time without prior notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  3. User Responsibilities
                </h2>
                <div className="space-y-3">
                  <p className="text-foreground leading-relaxed">
                    By using Reddinbox, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-foreground">
                    <li>
                      Comply with Reddit&apos;s Terms of Service and User
                      Agreement
                    </li>
                    <li>
                      Use the Service only for lawful purposes and legitimate
                      business activities
                    </li>
                    <li>
                      Respect other users&apos; privacy and not engage in spam
                      or harassment
                    </li>
                    <li>Maintain the security of your account credentials</li>
                    <li>
                      Not attempt to reverse engineer or compromise our systems
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  4. Reddit Integration
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Reddinbox integrates with Reddit&apos;s API to provide its
                  services. This integration is subject to Reddit&apos;s API
                  Terms of Use. Users must maintain valid Reddit accounts and
                  comply with all Reddit policies.
                </p>
                <p className="text-foreground leading-relaxed">
                  We are not affiliated with Reddit, Inc. Reddit is a trademark
                  of Reddit, Inc.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  5. Data and Privacy
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of the Service, to
                  understand our practices regarding data collection and use.
                </p>
                <p className="text-foreground leading-relaxed">
                  You retain ownership of any data you submit to Reddinbox. We
                  process this data solely to provide our services to you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  6. Prohibited Uses
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  You may not use Reddinbox for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>Sending unsolicited messages or spam</li>
                  <li>
                    Violating Reddit&apos;s community guidelines or terms of
                    service
                  </li>
                  <li>Collecting personal information without consent</li>
                  <li>
                    Automated or bulk messaging that violates platform policies
                  </li>
                  <li>Any illegal activities or activities that harm others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  7. Account Termination
                </h2>
                <p className="text-foreground leading-relaxed">
                  We reserve the right to terminate or suspend your account at
                  our discretion, particularly if you violate these terms or
                  engage in activities that harm our service or other users. You
                  may also terminate your account at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  8. Disclaimers
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  The Service is provided &quot;as is&quot; without any
                  warranties, express or implied. We do not guarantee
                  uninterrupted access or error-free operation of the Service.
                </p>
                <p className="text-foreground leading-relaxed">
                  We are not responsible for any actions taken by third parties,
                  including Reddit, that may affect your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  9. Limitation of Liability
                </h2>
                <p className="text-foreground leading-relaxed">
                  In no event shall Reddinbox be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use,
                  goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  10. Changes to Terms
                </h2>
                <p className="text-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. We
                  will notify users of significant changes via email or through
                  the Service. Continued use of the Service after changes
                  constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  11. Contact Information
                </h2>
                <p className="text-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please
                  contact us at legal@reddinbox.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
