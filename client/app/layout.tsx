import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

const mainFont = Lexend_Deca({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["400"],
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
      <body className={`${mainFont.variable} font-main antialiased`}>
        {children}
        <Toaster richColors />
        <Analytics />
      </body>
    </html>
  );
}
