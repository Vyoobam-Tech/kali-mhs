import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface CtaSectionProps {
  data: {
    title: string;
    subtitle: string;
    primaryButton: { label: string; href: string };
    secondaryButton: { label: string; href: string };
  };
}

export function CtaSection({ data }: CtaSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 border-t-8 border-slate-900">
      <div className="container">
        <div className="bg-primary rounded-[2rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-white/20 to-transparent -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-radial from-slate-900/30 to-transparent -ml-20 -mb-20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{data.title}</h2>
            <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto font-medium">{data.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-lg font-bold bg-white text-primary hover:bg-slate-100 rounded-full" asChild>
                <Link href={data.primaryButton.href}>{data.primaryButton.label}</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/30 text-white hover:bg-white/10 rounded-full bg-transparent" asChild>
                <Link href={data.secondaryButton.href}>{data.secondaryButton.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
