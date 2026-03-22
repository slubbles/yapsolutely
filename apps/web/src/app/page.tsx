import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import Workflow from "@/components/landing/Workflow";
import ProductShowcase from "@/components/landing/ProductShowcase";
import ClosingCTA from "@/components/landing/ClosingCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <Hero />
      <TrustStrip />
      <Workflow />
      <ProductShowcase />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
