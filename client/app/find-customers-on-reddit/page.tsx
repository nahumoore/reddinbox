import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Metadata } from "next";
import FindRedditCustomersClient from "./clientPage";

export const metadata: Metadata = {
  title: "Find Customers on Reddit - Niche Marketing Guides | Reddinbox",
  description: "Discover proven strategies to find and engage high-intent customers on Reddit. Niche-specific guides for SaaS, e-commerce, freelancing, and more. Authentic growth without spam.",
  keywords: [
    "find customers on reddit",
    "reddit marketing",
    "reddit customer acquisition",
    "reddit lead generation",
    "saas marketing reddit",
    "ecommerce reddit strategy",
    "freelance clients reddit",
    "reddit business growth",
    "authentic reddit engagement",
  ],
  openGraph: {
    title: "Find Your Perfect Customers on Reddit - Niche Marketing Guides",
    description: "Learn niche-specific strategies to connect with motivated buyers on Reddit. No spam, just authentic engagement that drives real results.",
    type: "website",
    siteName: "Reddinbox",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Customers on Reddit - Niche Marketing Guides",
    description: "Discover proven strategies to find high-intent customers on Reddit. Niche guides for SaaS, e-commerce, freelancing & more.",
  },
  alternates: {
    canonical: "/find-customers-on-reddit",
  },
};

export default function FindRedditCustomers() {
  return (
    <>
      <Navbar />
      <FindRedditCustomersClient />;
      <Footer />
    </>
  );
}
