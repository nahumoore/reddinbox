import Benefits from "@/components/landing/Benefits";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import SocialProof from "@/components/landing/SocialProof";
import Link from "next/link";

// please work vercel
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <Link
        href="https://fazier.com/launches/reddinbox.com"
        target="_blank"
        className="opacity-0 hidden"
      >
        <img
          src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=dark"
          alt="Fazier badge"
        />
      </Link>
    </div>
  );
}
