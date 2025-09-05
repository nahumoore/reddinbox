import Navbar from './components/navbar';
import Hero from './components/hero';
import Features from './components/features';
import Footer from './components/footer';

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
