import type { Metadata } from 'next';
import { FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Brochures | Content Hub | Kali MHS',
  description: 'Download product brochures, technical datasheets, and company overviews from Kali Material Handling Solutions.',
};

const brochures = [
  { title: 'Belt Conveyor Systems', category: 'Product Line', desc: 'Comprehensive overview of our belt conveyor technology including troughed, flat, pipe, and chevron belt variants.', pages: 24, year: 2024 },
  { title: 'Bucket Elevators', category: 'Product Line', desc: 'Technical specifications, capacity charts, and configuration options for our complete bucket elevator range.', pages: 18, year: 2024 },
  { title: 'Stacker-Reclaimers', category: 'Product Line', desc: 'Detailed overview of slewing, rail-mounted, and portal reclaimers for bulk terminal applications.', pages: 32, year: 2024 },
  { title: 'Screw Conveyors & Feeders', category: 'Product Line', desc: 'Full product range including enclosed, horizontal, inclined, and vertical screw conveyor configurations.', pages: 16, year: 2023 },
  { title: 'Company Profile 2024', category: 'Corporate', desc: 'An executive overview of Kali MHS — our history, capabilities, global footprint, and client portfolio.', pages: 48, year: 2024 },
  { title: 'Quality & Certifications Overview', category: 'Corporate', desc: 'Details of our ISO 9001, CE, and other international certifications, plus our quality assurance process.', pages: 12, year: 2024 },
  { title: 'Mining Sector Solutions', category: 'Sector Guide', desc: 'Tailored solutions for underground and open-pit mining material transport, crushing, and stockyard systems.', pages: 28, year: 2023 },
  { title: 'Port & Terminal Handling', category: 'Sector Guide', desc: 'Ship loaders, unloaders, and port-side bulk handling systems for container and dry bulk terminals.', pages: 30, year: 2023 },
];

const categoryColors: Record<string, string> = {
  'Product Line': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Corporate': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'Sector Guide': 'bg-primary/10 text-primary',
};

export default function BrochuresPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary/20 z-0" />
        <div className="container relative z-10 max-w-3xl">
          <Link href="/resources" className="text-primary text-sm font-semibold hover:underline mb-6 flex items-center gap-1">← Back to Resources</Link>
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Content Hub</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mt-3 mb-6">Product <span className="text-primary">Brochures</span></h1>
          <p className="text-xl text-slate-300 leading-relaxed">Download detailed product literature, technical specifications, and corporate documentation.</p>
        </div>
      </section>

      {/* Brochures Grid */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brochures.map((b) => (
              <div key={b.title} className="group rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col">
                <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded-t-2xl flex items-center justify-center">
                  <FileText className="h-16 w-16 text-slate-200 dark:text-slate-600 group-hover:text-primary/30 transition-colors" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md w-max mb-3 ${categoryColors[b.category]}`}>{b.category}</span>
                  <h3 className="font-black text-base mb-2 leading-tight">{b.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed flex-1">{b.desc}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-muted-foreground">{b.pages} pages · {b.year}</span>
                    <Button size="sm" variant="outline" className="rounded-full gap-2 text-xs h-8">
                      <FileDown className="h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
