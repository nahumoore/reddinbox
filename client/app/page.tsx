import Features from "../components/landing/features";
import Hero from "../components/landing/hero";
import Navbar from "../components/landing/navbar";
import Footer from "../components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
