import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Case Studies | Content Hub | Kali MHS',
  description: 'Explore Kali MHS project case studies across mining, ports, steel, cement, and power sectors worldwide.',
};

const caseStudies = [
  {
    id: 1, tag: 'Mining', region: 'South Africa',
    title: '12 MTPA In-Pit Crushing & Conveying System',
    client: 'A Major Iron Ore Producer',
    summary: 'Designed and delivered a fully integrated IPCC solution with a 3.2 km overland conveyor, reducing haul truck fleet by 60% and operational costs by 35% annually.',
    impact: ['35% reduction in operating cost', '60% fewer haul trucks', '12 MTPA throughput achieved'],
  },
  {
    id: 2, tag: 'Ports & Terminals', region: 'UAE',
    title: 'Automated Coal Import Terminal — 8,000 TPH',
    client: 'Abu Dhabi Ports Authority',
    summary: 'Turnkey coal unloading terminal featuring twin ship unloaders, 6 km of conveyor systems, a stacker-reclaimer, and a fully automated SCADA-controlled stockyard.',
    impact: ['8,000 TPH ship unloading rate', 'SCADA-integrated stockyard', '100% automation achieved'],
  },
  {
    id: 3, tag: 'Cement', region: 'India',
    title: 'Limestone Extraction to Kiln Feed System',
    client: 'A Leading Cement Manufacturer',
    summary: 'End-to-end material flow from quarry face to kiln feed with four-stage crushing, bucket elevators, and a 2.4 km gallery conveyor system across challenging terrain.',
    impact: ['7,500 TPD kiln capacity matched', '98% system availability', 'ISO 9001 certified erection'],
  },
  {
    id: 4, tag: 'Steel', region: 'Vietnam',
    title: '5 MTPA Integrated Steel Plant Logistics',
    client: 'Vietnam Steel Corporation',
    summary: 'Complete raw material handling covering iron ore, coal, and limestone flow paths with stockyard machines, belt feeders, and transfer towers throughout the plant.',
    impact: ['5 MTPA integrated flow', '3 stockyard machines supplied', 'Project delivered ahead of schedule'],
  },
  {
    id: 5, tag: 'Power', region: 'Indonesia',
    title: 'Coal Handling Plant — 2×660 MW Thermal Power',
    client: 'PT Energy Nusantara',
    summary: 'Full coal handling plant including unloading hoppers, conveyor networks, stacker-reclaimer, and bunker feeding system for a greenfield 2×660 MW ultra-supercritical plant.',
    impact: ['1,320 MW power station served', '2×2,500 TPH stacker-reclaimers', 'Zone III seismic design'],
  },
  {
    id: 6, tag: 'Agriculture', region: 'Brazil',
    title: 'Grain Export Terminal — Santos Port',
    client: 'Agro Export Partners S.A.',
    summary: 'Soybean and maize handling terminal with enclosed conveyors, ship loading arms, and silo automation for a major Brazilian agricultural export hub.',
    impact: ['4,000 TPH ship loading rate', 'Dust-free enclosed design', 'Silo automation integrated'],
  },
];

const tagColors: Record<string, string> = {
  'Mining': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Ports & Terminals': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Cement': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Steel': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  'Power': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Agriculture': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary/20 z-0" />
        <div className="container relative z-10 max-w-3xl">
          <Link href="/resources" className="text-primary text-sm font-semibold hover:underline mb-6 flex items-center gap-1">← Back to Resources</Link>
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Content Hub</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mt-3 mb-6">Case <span className="text-primary">Studies</span></h1>
          <p className="text-xl text-slate-300 leading-relaxed">Explore how Kali MHS has delivered transformative bulk material handling solutions across the world's most demanding industries.</p>
        </div>
      </section>

      {/* Case Study Cards */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((cs) => (
              <div key={cs.id} className="group rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 flex flex-col overflow-hidden">
                <div className="h-3 bg-primary w-full"></div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${tagColors[cs.tag] || 'bg-slate-100 text-slate-600'}`}>{cs.tag}</span>
                    <span className="text-xs text-muted-foreground">· {cs.region}</span>
                  </div>
                  <h3 className="font-black text-lg mb-1 leading-tight group-hover:text-primary transition-colors">{cs.title}</h3>
                  <p className="text-xs text-muted-foreground font-semibold mb-4 uppercase tracking-wider">Client: {cs.client}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{cs.summary}</p>
                  <ul className="space-y-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {cs.impact.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center space-y-6">
          <h2 className="text-4xl font-black">Have a Similar Challenge?</h2>
          <p className="text-white/80 max-w-xl mx-auto">Our engineers are ready to analyse your project and propose the most cost-efficient material handling solution.</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 font-black text-base mt-2">
            <Link href="/rfq">Request a Technical Proposal <ArrowRight className="ml-2 h-5 w-5 inline" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
