import type { Metadata } from "next";
import { HeroBanner } from "@/components/shared/HeroBanner";
import { StatsBar } from "@/components/shared/StatsBar";
import { TimelineSection } from "@/components/features/about/TimelineSection";
import { LeadershipSection } from "@/components/features/about/LeadershipSection";
import { ManufacturingSection } from "@/components/features/about/ManufacturingSection";
import { ValuesSection } from "@/components/features/about/ValuesSection";
import { GlobalReachSection } from "@/components/features/about/GlobalReachSection";
import { CtaSection } from "@/components/shared/CtaSection";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getCMSPage(slug: string) {
  try {
    const res = await fetch(`${API_URL}/cms/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const content = json?.data?.page?.content;
    return content ? JSON.parse(content) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Us | Kali MHS",
    description:
      "Learn about Kali Material Handling Solutions — our history, leadership, manufacturing capabilities, and global reach.",
  };
}

export default async function AboutPage() {
  const cms = await getCMSPage("about-page");

  const hero = cms?.hero ?? {
    badge: "About Kali MHS",
    title: "Built on a Legacy of",
    titleHighlight: "Engineering Excellence",
    subtitle:
      "Since 1972, Kali Material Handling Solutions has been at the forefront of the industry.",
    primaryButton: { label: "Request a Quote", href: "/rfq" },
    secondaryButton: { label: "Get in Touch", href: "/contact" },
  };
  const stats: { value: string; label: string }[] = cms?.stats ?? [
    { value: "50+", label: "Years of Excellence" },
    { value: "500+", label: "Projects Delivered" },
    { value: "30+", label: "Countries Served" },
    { value: "98%", label: "Client Satisfaction" },
  ];
  const cta = cms?.cta ?? {
    title: "Ready to Partner with Us?",
    subtitle: "",
    primaryButton: { label: "Request a Quote", href: "/rfq" },
    secondaryButton: { label: "Contact Us", href: "/contact" },
  };

  return (
    <div className="min-h-screen">
      <HeroBanner {...hero} variant="page" />
      <StatsBar stats={stats} />
      <TimelineSection data={cms?.timeline} />
      <LeadershipSection data={cms?.leadership} />
      <ManufacturingSection data={cms?.manufacturing} />
      <ValuesSection data={cms?.values} />
      <GlobalReachSection data={cms?.globalReach} />
      <CtaSection data={cta} />
    </div>
  );
}
