import type { Metadata } from 'next';
import { FileDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Product Catalogue | Content Hub | Kali MHS',
  description: 'Browse the full Kali MHS product catalogue of bulk material handling equipment, conveyors, stackers, feeders, and more.',
};

const categories = [
  {
    name: 'Belt Conveyors',
    products: [
      { name: 'Troughed Belt Conveyors', capacity: 'Up to 30,000 TPH', distance: 'Up to 20 km' },
      { name: 'Pipe Conveyors', capacity: 'Up to 5,000 TPH', distance: 'Up to 15 km' },
      { name: 'Chevron Belt Conveyors', capacity: 'Up to 1,000 TPH', distance: 'Up to 5 km' },
      { name: 'Overland Conveyors', capacity: 'Up to 20,000 TPH', distance: 'Up to 30 km' },
    ]
  },
  {
    name: 'Bucket Elevators',
    products: [
      { name: 'Centrifugal Discharge Elevators', capacity: 'Up to 500 TPH', distance: 'Up to 80m' },
      { name: 'Continuous Discharge Elevators', capacity: 'Up to 2,000 TPH', distance: 'Up to 120m' },
      { name: 'High-Capacity Grain Elevators', capacity: 'Up to 1,500 TPH', distance: 'Up to 60m' },
    ]
  },
  {
    name: 'Stackers & Reclaimers',
    products: [
      { name: 'Tripper Car Stackers', capacity: 'Up to 8,000 TPH', distance: '—' },
      { name: 'Slewing Boom Stackers', capacity: 'Up to 12,000 TPH', distance: '—' },
      { name: 'Bucket Wheel Reclaimers', capacity: 'Up to 10,000 TPH', distance: '—' },
      { name: 'Chain Scraper Reclaimers', capacity: 'Up to 5,000 TPH', distance: '—' },
      { name: 'Combined Stacker-Reclaimer', capacity: 'Up to 8,000 TPH', distance: '—' },
    ]
  },
  {
    name: 'Feeders & Hoppers',
    products: [
      { name: 'Apron Feeders', capacity: 'Up to 4,000 TPH', distance: '—' },
      { name: 'Vibrating Feeders', capacity: 'Up to 2,000 TPH', distance: '—' },
      { name: 'Belt Feeders', capacity: 'Up to 1,500 TPH', distance: '—' },
      { name: 'Track Hoppers', capacity: 'Up to 1,000 TPH', distance: '—' },
    ]
  },
  {
    name: 'Screw Equipment',
    products: [
      { name: 'Horizontal Screw Conveyors', capacity: 'Up to 100 TPH', distance: 'Up to 50m' },
      { name: 'Inclined Screw Conveyors', capacity: 'Up to 80 TPH', distance: 'Up to 30m' },
      { name: 'Screw Feeders', capacity: 'Up to 120 TPH', distance: '—' },
    ]
  },
  {
    name: 'Ship Loaders & Unloaders',
    products: [
      { name: 'Radial Shiploader', capacity: 'Up to 10,000 TPH', distance: '—' },
      { name: 'Travelling Luffing Shiploader', capacity: 'Up to 12,000 TPH', distance: '—' },
      { name: 'Continuous Ship Unloader', capacity: 'Up to 3,000 TPH', distance: '—' },
      { name: 'Crane-Mounted Grab Unloader', capacity: 'Up to 1,500 TPH', distance: '—' },
    ]
  },
];

export default function CataloguePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary/20 z-0" />
        <div className="container relative z-10 max-w-3xl">
          <Link href="/resources" className="text-primary text-sm font-semibold hover:underline mb-6 flex items-center gap-1">← Back to Resources</Link>
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Content Hub</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mt-3 mb-6">Product <span className="text-primary">Catalogue</span></h1>
          <p className="text-xl text-slate-300 leading-relaxed">Browse our full range of bulk material handling equipment, covering everything from conveyors to ship loaders.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button asChild className="rounded-full px-8 h-12 font-bold gap-2">
              <Link href="/resources/brochures">
                <FileDown className="h-4 w-4" />
                Download Full Catalogue PDF
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-8 h-12 font-bold border-white/30 text-white hover:bg-white/10">
              <Link href="/rfq">Get a Custom Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Catalogue Table */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container space-y-12">
          {categories.map((cat) => (
            <div key={cat.name} className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-900 text-white px-8 py-5">
                <h2 className="text-lg font-black uppercase tracking-wider">{cat.name}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left px-8 py-4 font-bold text-muted-foreground uppercase text-xs tracking-wider">Product</th>
                      <th className="text-left px-8 py-4 font-bold text-muted-foreground uppercase text-xs tracking-wider">Capacity</th>
                      <th className="text-left px-8 py-4 font-bold text-muted-foreground uppercase text-xs tracking-wider">Max Distance / Height</th>
                      <th className="text-right px-8 py-4 font-bold text-muted-foreground uppercase text-xs tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.products.map((product, i) => (
                      <tr key={product.name} className={`border-b border-slate-100 dark:border-slate-800 hover:bg-primary/5 transition-colors ${i === cat.products.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-8 py-5 font-bold">{product.name}</td>
                        <td className="px-8 py-5 text-muted-foreground">{product.capacity}</td>
                        <td className="px-8 py-5 text-muted-foreground">{product.distance}</td>
                        <td className="px-8 py-5 text-right">
                          <Button asChild size="sm" variant="ghost" className="rounded-full text-primary hover:text-primary hover:bg-primary/10 text-xs font-bold">
                            <Link href="/rfq">Enquire →</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center space-y-6">
          <h2 className="text-4xl font-black">Don't See What You Need?</h2>
          <p className="text-white/80 max-w-xl mx-auto">We engineer custom solutions. Tell us your requirements and our team will design the optimal system for your application.</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 font-black text-base mt-2">
            <Link href="/rfq">Submit an RFQ</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
