import Link from 'next/link';
import { ArrowRight, Settings, HardHat, Zap, Tractor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { GridContainer } from '@/components/shared/GridContainer';

const PRODUCT_ICONS: React.ReactNode[] = [
  <Settings className="h-6 w-6" key="settings" />,
  <HardHat className="h-6 w-6" key="hard-hat" />,
  <Zap className="h-6 w-6" key="zap" />,
  <Tractor className="h-6 w-6" key="tractor" />,
];

interface ProductsSectionProps {
  data: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
      subItems: string[];
      learnMoreLabel: string;
      learnMoreHref: string;
    }[];
  };
}

export function ProductsSection({ data }: ProductsSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container">
        <SectionHeader 
          badge={data.badge} 
          title={data.title} 
          subtitle={data.subtitle} 
        />
        
        <GridContainer cols={2}>
          {(data.items ?? []).map((p, i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-white rounded-2xl group cursor-pointer">
              <div className="h-56 bg-slate-200 relative overflow-hidden transform-gpu">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
                <div className="absolute top-4 left-4 z-20 bg-primary w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-lg">
                  {PRODUCT_ICONS[i % PRODUCT_ICONS.length]}
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{p.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed h-20">{p.desc}</p>
                <ul className="space-y-2 mb-8">
                  {(p.subItems ?? []).map((item, j) => (
                    <li key={j} className="flex items-center text-sm font-medium text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={p.learnMoreHref ?? '/products'} className="inline-flex items-center font-bold text-primary hover:text-primary/80 transition-colors">
                  {p.learnMoreLabel ?? 'Learn More'} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </GridContainer>
      </div>
    </section>
  );
}
