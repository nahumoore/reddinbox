import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

export default function PlaybooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
      <Footer />
    </>
  );
}
