import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddinbox - Your Reddit CRM Redefined",
  description:
    "The most powerful CRM platform designed specifically for Reddit marketing. Transform your Reddit outreach into measurable business results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
