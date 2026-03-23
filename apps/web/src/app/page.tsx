import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import BrandCarousel from "@/components/landing/BrandCarousel";
import Workflow from "@/components/landing/Workflow";
import Benefits from "@/components/landing/Benefits";
import ProductShowcase from "@/components/landing/ProductShowcase";
import Testimonials from "@/components/landing/Testimonials";
import ClosingCTA from "@/components/landing/ClosingCTA";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <Hero />
      <ScrollReveal variant="fade-up" delay={0}>
        <TrustStrip />
      </ScrollReveal>
      <ScrollReveal variant="fade-up" delay={80}>
        <BrandCarousel />
      </ScrollReveal>
      <ScrollReveal variant="slide-up" duration={800}>
        <Workflow />
      </ScrollReveal>
      <Benefits />
      <ScrollReveal variant="fade-up" duration={800}>
        <ProductShowcase />
      </ScrollReveal>
      <Testimonials />
      <ScrollReveal variant="scale-up" duration={800}>
        <ClosingCTA />
      </ScrollReveal>
      <Footer />
    </div>
  );
}
