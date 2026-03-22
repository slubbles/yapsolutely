import { LandingClosingCta } from "@/components/landing/closing-cta";
import { LandingFooter } from "@/components/landing/footer";
import { LandingHero } from "@/components/landing/hero";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingProductShowcase } from "@/components/landing/product-showcase";
import { LandingTrustStrip } from "@/components/landing/trust-strip";
import { LandingWorkflow } from "@/components/landing/workflow";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--text-strong)]">
      <LandingNavbar />
      <LandingHero />
      <LandingTrustStrip />
      <LandingWorkflow />
      <LandingProductShowcase />
      <LandingClosingCta />
      <LandingFooter />
    </main>
  );
}
