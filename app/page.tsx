import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Features } from "@/components/sections/Features";
import { PlatformShowcase } from "@/components/sections/PlatformShowcase";
import { KnowledgeGraph } from "@/components/sections/KnowledgeGraph";
import { AIAgents } from "@/components/sections/AIAgents";
import { Integrations } from "@/components/sections/Integrations";
import { Security } from "@/components/sections/Security";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <PlatformShowcase />
        <KnowledgeGraph />
        <AIAgents />
        <Integrations />
        <Security />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
