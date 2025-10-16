import { Metadata } from "next";
import FindRedditCustomersClientPage from "./clientPage";

export const metadata: Metadata = {
  title: "Find Reddit Customers for FREE!",
  description:
    "Discover potential customers on Reddit for free. Identify buying intent in discussions, connect with your target audience authentically, and generate qualified leads.",
  keywords:
    "find reddit customers, reddit lead generation, reddit customer discovery, find leads on reddit, reddit sales tool, reddit prospecting, social selling reddit",
  openGraph: {
    title: "Find Reddit Customers Free - Lead Discovery Tool",
    description:
      "Discover potential customers on Reddit for free. Identify buying intent, connect authentically, and generate qualified leads from relevant discussions.",
    url: "https://reddinbox.com/free-tools/find-reddit-customers",
    siteName: "Reddinbox",
    type: "website",
    images: [
      {
        url: "https://reddinbox.com/og-find-reddit-customers.png",
        width: 1200,
        height: 630,
        alt: "Find Reddit Customers - Free Lead Discovery Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Reddit Customers Free - Lead Discovery Tool",
    description:
      "Discover potential customers on Reddit for free. Identify buying intent, connect authentically, and generate qualified leads from relevant discussions.",
    images: ["https://reddinbox.com/og-find-reddit-customers.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://reddinbox.com/free-tools/find-reddit-customers",
  },
};

export default function FindRedditCustomersPage() {
  return <FindRedditCustomersClientPage />;
}
