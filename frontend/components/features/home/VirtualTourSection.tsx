import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VirtualTourSectionProps {
  data: {
    title: string;
    subtitle: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

export function VirtualTourSection({ data }: VirtualTourSectionProps) {
  if (!data) return null;

  return (
    <section className="py-20 bg-slate-900 text-center text-white">
      <div className="container">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold">{data.title}</h2>
          <p className="text-xl text-slate-300">{data.subtitle}</p>
          <Button size="lg" className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-full" asChild>
            <Link href={data.buttonHref ?? '#'}>
              {data.buttonLabel} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
