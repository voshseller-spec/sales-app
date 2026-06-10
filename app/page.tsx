import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { SocialProof } from "@/components/marketing/SocialProof";
import { CTASection } from "@/components/marketing/CTASection";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { BadgeCheck, Filter, MessageCircle, Mic, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeatureGrid
        eyebrow="Why Closer"
        title="Hire and get hired without the guesswork"
        description="Every interaction on the platform is anchored to verified skill — not pedigree, not vibes."
        features={[
          {
            icon: Mic,
            title: "Recorded mock call",
            body: "Sell to our AI buyer. We score you on what actually matters.",
          },
          {
            icon: BadgeCheck,
            title: "Verified Closer Score",
            body: "A four-dimension breakdown plus a shareable badge for LinkedIn.",
          },
          {
            icon: Filter,
            title: "Filter by skill",
            body: "Agencies filter reps by sub-score, vertical, ticket size, and motion.",
          },
          {
            icon: Zap,
            title: "Two-sided matching",
            body: "Swipe to express interest. Both sides accept, then jump on a call.",
          },
          {
            icon: ShieldCheck,
            title: "Vetted both ways",
            body: "Agencies are background-checked. Offers and pay-outs are reviewed.",
          },
          {
            icon: MessageCircle,
            title: "Community that closes",
            body: "Scripts, objections, wins. Learn from reps who scored 90+.",
          },
        ]}
      />
      <SocialProof />
      <CTASection />
    </>
  );
}
