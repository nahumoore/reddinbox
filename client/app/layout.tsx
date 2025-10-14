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
  title: "Reddinbox - Reddit Marketing Through Authority Building",
  description:
    "Build authentic authority in Reddit communities, then convert that trust into qualified leads for your startup. The anti-spam approach to Reddit marketing",
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
          </>
        )}
      </body>
    </html>
  );
}
