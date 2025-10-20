import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const mainFont = Lexend_Deca({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  // Primary SEO Tags
  title: "Reddinbox - Reddit Marketing. Build Authority & Generate Leads",
  description:
    "Build authentic authority in Reddit communities, then convert trust into qualified leads. The anti-spam approach to Reddit marketing that actually works.",
  keywords: [
    "reddit marketing",
    "reddit lead generation",
    "reddit authority building",
    "reddit growth tool",
    "reddit marketing automation",
    "community engagement software",
    "B2B reddit marketing",
  ],
  authors: [{ name: "Reddinbox" }],
  creator: "Reddinbox",
  publisher: "Reddinbox",

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Open Graph Tags for Social Sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reddinbox.com",
    siteName: "Reddinbox",
    title: "Reddit Marketing Tool - Build Authority & Generate Leads",
    description:
      "Build authentic authority in Reddit communities, then convert trust into qualified leads. The anti-spam approach to Reddit marketing that actually works.",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "Reddinbox - Reddit Marketing Platform",
      },
    ],
  },

  // Twitter Card Tags
  twitter: {
    card: "summary_large_image",
    title: "Reddit Marketing Tool - Build Authority & Generate Leads",
    description:
      "Build authentic authority in Reddit communities, then convert trust into qualified leads. The anti-spam approach to Reddit marketing that actually works.",
    images: ["/icon.svg"],
    creator: "@reddinbox",
    site: "@reddinbox",
  },

  // Additional Meta Tags
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },

  // Verification Tags (add your verification codes when available)
  verification: {
    google: "your-google-verification-code",
    // yandex: 'your-yandex-verification-code',
    // other: 'your-other-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Reddinbox",
    url: "https://reddinbox.com",
    logo: "https://reddinbox.com/icon.svg",
    description:
      "Reddit marketing platform for building authority and generating leads through authentic community engagement",
    sameAs: [
      "https://twitter.com/reddinbox",
      "https://www.linkedin.com/company/reddinbox",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://reddinbox.com/contact",
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Reddinbox",
    applicationCategory: "BusinessApplication",
    description:
      "Reddit marketing and lead generation platform that helps businesses build authentic authority in communities and convert trust into qualified leads",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: "https://reddinbox.com/pricing",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
  };

  return (
    <html lang="en">
      <body className={`${mainFont.variable} font-main antialiased`}>
        {/* Structured Data for SEO */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="software-application-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />

        {children}
        <Toaster richColors />
        {process.env.NODE_ENV === "production" && (
          <>
            {/* // GOOGLE ANALYTICS */}
            <GoogleAnalytics gaId="G-B29FM3PKX5" />

            {/* // VERICEL ANALYTICS */}
            <Analytics />

            {/* AHREFS ANALYTICS */}
            <Script
              src="https://analytics.ahrefs.com/analytics.js"
              data-key="hbImKkk0joIgPnpgmbNl5g"
              async
            />

            {/* HEYO - CHATBOT */}
            <Script src="https://heyo.so/embed/script?projectId=68f183027d28bb99332c2e2c"></Script>
          </>
        )}
      </body>
    </html>
  );
}
