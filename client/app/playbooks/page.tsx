import { getAllPosts } from "@/utils/mdx";
import { Metadata } from "next";
import PlaybooksClientPage from "./clientPage";

export const metadata: Metadata = {
  title: "Reddit Marketing Playbooks | Step-by-Step Implementation Guides",
  description:
    "Comprehensive playbooks for Reddit marketing success. Learn how to find communities, build authority, generate leads, and grow your presence with proven step-by-step guides.",
  keywords: [
    "reddit playbooks",
    "reddit marketing guide",
    "reddit strategy guide",
    "reddit growth playbook",
    "reddit lead generation guide",
    "reddit community building",
    "reddit tactics",
    "reddit implementation guide",
  ],
  authors: [{ name: "Reddinbox Team" }],
  creator: "Reddinbox",
  publisher: "Reddinbox",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Reddit Marketing Playbooks | Step-by-Step Implementation Guides",
    description:
      "Comprehensive playbooks for Reddit marketing success. Learn how to find communities, build authority, generate leads, and grow your presence with proven step-by-step guides.",
    url: "https://reddinbox.com/playbooks",
    siteName: "Reddinbox",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/playbooks/og-image-playbooks.jpg",
        width: 1200,
        height: 630,
        alt: "Reddinbox Playbooks - Reddit Marketing Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reddit Marketing Playbooks | Step-by-Step Implementation Guides",
    description:
      "Comprehensive playbooks for Reddit marketing success. Learn how to find communities, build authority, generate leads, and grow your presence with proven step-by-step guides.",
    images: ["/playbooks/twitter-image-playbooks.jpg"],
    creator: "@reddinbox",
  },
  alternates: {
    canonical: "https://reddinbox.com/playbooks",
  },
  category: "Business & Marketing",
};

export default function PlaybookPage() {
  const allPlaybooks = getAllPosts("playbooks");

  return <PlaybooksClientPage allPlaybooks={allPlaybooks} />;
}
