import { Metadata } from "next";
import AboutPage from "./clientPage";

export const metadata: Metadata = {
  title: "About Reddinbox | Reddit Lead Generation Story",
  description:
    "Meet Nicolas, the founder of Reddinbox. Learn how a viral Reddit post led to building the ultimate Reddit growth and lead generation platform. Discover the anti-spam approach to Reddit marketing that builds genuine authority first.",
  keywords: [
    "Reddinbox founder",
    "Reddit lead generation",
    "Reddit marketing strategy",
    "build authority on Reddit",
    "Reddit growth tool",
    "authentic Reddit engagement",
  ],
  authors: [{ name: "Nicolas" }],
  openGraph: {
    title: "About Nicolas - Founder of Reddinbox",
    description:
      "From a viral Reddit post to building the ultimate Reddit growth platform. Learn how Reddinbox helps you build authority and generate leads authentically.",
    url: "https://reddinbox.com/about",
    siteName: "Reddinbox",
    images: [
      {
        url: "/founder.webp",
        width: 800,
        height: 800,
        alt: "Nicolas - Founder of Reddinbox",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Nicolas - Founder of Reddinbox",
    description:
      "From a viral Reddit post to building the ultimate Reddit growth platform. Learn the anti-spam approach to Reddit marketing.",
    images: ["/founder.webp"],
  },
  alternates: {
    canonical: "https://reddinbox.com/about",
  },
};

export default function AboutPageServer() {
  return (
    <>
      <AboutPage />
    </>
  );
}
