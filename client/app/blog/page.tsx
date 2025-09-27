import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { getAllPosts } from "@/utils/mdx";
import { Metadata } from "next";
import BlogClientPage from "./clientPage";

export const metadata: Metadata = {
  title: "Reddit Marketing Blog | Growth Strategies & Authority Building",
  description:
    "Discover proven Reddit marketing strategies, growth hacks, and authority-building techniques. Learn how to generate leads and build genuine relationships through authentic community engagement.",
  keywords: [
    "reddit marketing",
    "reddit growth strategies",
    "reddit lead generation",
    "reddit authority building",
    "reddit community engagement",
    "reddit business marketing",
    "reddit content strategy",
    "reddit promotion tips",
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
    title: "Reddit Marketing Blog | Growth Strategies & Authority Building",
    description:
      "Discover proven Reddit marketing strategies, growth hacks, and authority-building techniques. Learn how to generate leads and build genuine relationships through authentic community engagement.",
    url: "https://reddinbox.com/blog",
    siteName: "Reddinbox",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/blog/og-image-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Reddinbox Blog - Reddit Marketing Strategies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reddit Marketing Blog | Growth Strategies & Authority Building",
    description:
      "Discover proven Reddit marketing strategies, growth hacks, and authority-building techniques. Learn how to generate leads and build genuine relationships through authentic community engagement.",
    images: ["/blog/twitter-image-blog.jpg"],
    creator: "@reddinbox",
  },
  alternates: {
    canonical: "https://reddinbox.com/blog",
  },
  category: "Business & Marketing",
};

export default function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <>
      <Navbar />
      <BlogClientPage allPosts={allPosts.slice(0, 3)} />;
      <Footer />
    </>
  );
}
