import { Metadata } from "next";
import SubredditFinderClientPage from "./clientPage";

export const metadata: Metadata = {
  title: "Free Reddit Subreddit Finder - Discover Relevant Communities",
  description:
    "Find the best subreddits for your niche instantly. Enter your website URL and discover relevant Reddit communities where your target audience engages. Free subreddit discovery tool.",
  keywords:
    "reddit subreddit finder, find subreddits, discover subreddits, subreddit discovery tool, find relevant subreddits, best subreddits for niche, subreddit search, reddit community finder",
  openGraph: {
    title: "Reddit Subreddit Finder - Discover Relevant Communities",
    description:
      "Find the best subreddits for your niche instantly. Enter your website URL and discover relevant Reddit communities where your target audience engages.",
    url: "https://reddinbox.com/free-tools/reddit-subreddit-finder",
    siteName: "Reddinbox",
    type: "website",
    images: [
      {
        url: "https://reddinbox.com/icon.svg",
        width: 1200,
        height: 630,
        alt: "Reddit Subreddit Finder - Free Community Discovery Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reddit Subreddit Finder - Discover Relevant Communities",
    description:
      "Find the best subreddits for your niche instantly. Enter your website URL and discover relevant Reddit communities where your target audience engages.",
    images: ["https://reddinbox.com/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://reddinbox.com/free-tools/reddit-subreddit-finder",
  },
};

export default function SubredditFinderPage() {
  return <SubredditFinderClientPage />;
}
