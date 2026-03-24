import { Metadata } from "next";
import { HeroBanner } from "@/components/shared/HeroBanner";
import { PioneeringSection } from "@/components/features/home/PioneeringSection";
import { ProductsSection } from "@/components/features/home/ProductsSection";
import { VirtualTourSection } from "@/components/features/home/VirtualTourSection";
import { SectorsSection } from "@/components/features/home/SectorsSection";
import { SolutionsSection } from "@/components/features/home/SolutionsSection";
import { CtaSection } from "@/components/shared/CtaSection";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kalimhs.com";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1`;

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
    title: "Kali MHS | Engineering Excellence in Bulk Material Handling",
    description:
      "Robotic-enhanced intelligent conveyor systems and bulk handling solutions.",
    alternates: { canonical: BASE_URL },
    openGraph: {
      type: "website",
      url: BASE_URL,
      title: "Kali MHS | Bulk Material Handling Solutions",
      description:
        "India's trusted manufacturer of premium material handling systems.",
      images: [
        { url: "/og-default.jpg", width: 1200, height: 630, alt: "Kali MHS" },
      ],
    },
  };
}

export default async function Home() {
  const cms = await getCMSPage("homepage");

  // Fallback defaults mapping
  const hero = cms?.hero ?? {
    badge: "Pioneering Material Handling",
    title: "Engineering Excellence in Bulk Material Handling",
    subtitle:
      "Robotic-enhanced intelligent conveyor systems and bulk handling solutions.",
    primaryButton: { label: "Explore Products", href: "/products" },
    secondaryButton: { label: "Contact Our Experts", href: "/contact" },
  };

  const cta = cms?.cta ?? {
    title: "Ready to Optimize Your Material Handling?",
    subtitle: "",
    primaryButton: { label: "Request a Quote", href: "/rfq" },
    secondaryButton: { label: "View Case Studies", href: "/contact" },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner {...hero} variant="home" />

      {/* We pass the inline stats down as a prop if we want, or render them in HeroBanner. 
          Given our new architecture, let's render them in a quick grid below Hero or let Pioneering handle it. 
          For perfect backwards compatibility, we add the Stats bar inline here for now. */}
      {cms?.stats && (
        <div className="bg-slate-900 border-t border-white/10 pb-16">
          <div className="container">
            <div className="grid grid-cols-3 gap-8">
              {cms.stats.map((s: any) => (
                <div key={s.label}>
                  <h4 className="text-4xl font-black text-white">{s.value}</h4>
                  <p className="text-slate-400 mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <PioneeringSection data={cms?.pioneering} />
      <ProductsSection data={cms?.productsSection} />
      <VirtualTourSection data={cms?.virtualTour} />
      <SectorsSection data={cms?.sectors} />
      <SolutionsSection data={cms?.solutions} />
      <CtaSection data={cta} />
    </div>
  );
}
