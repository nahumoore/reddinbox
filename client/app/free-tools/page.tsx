import { Metadata } from "next";
import FreeToolsPageClient from "./clientPage";

export const metadata: Metadata = {
  title: "Free Reddit Marketing Tools - Lead Generation & Growth",
  description:
    "Free tools for Reddit lead generation and authority building. Find customers, optimize profiles, and grow engagement - no signup required. Start today.",
  keywords:
    "reddit marketing tools, reddit lead generation, find reddit customers, reddit growth tools, reddit marketing free, social media lead generation",
  openGraph: {
    title: "Free Reddit Marketing Tools - Lead Generation & Growth",
    description:
      "Free tools for Reddit lead generation and authority building. Find customers, optimize profiles, and grow engagement - no signup required.",
    url: "https://reddinbox.com/free-tools",
    siteName: "Reddinbox",
    type: "website",
    images: [
      {
        url: "https://reddinbox.com/og-free-tools.png",
        width: 1200,
        height: 630,
        alt: "Reddinbox Free Reddit Marketing Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Reddit Marketing Tools - Lead Generation & Growth",
    description:
      "Free tools for Reddit lead generation and authority building. Find customers, optimize profiles, and grow engagement - no signup required.",
    images: ["https://reddinbox.com/og-free-tools.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://reddinbox.com/free-tools",
  },
};

export default function FreeToolsPage() {
  return <FreeToolsPageClient />;
}
