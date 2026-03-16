import { Factory } from 'lucide-react';
import { ListBlock } from '@/components/shared/ListBlock';

interface PioneeringSectionProps {
  data: {
    badge: string;
    title: string;
    body: string;
    highlights: string[];
    statValue: string;
    statLabel: string;
  };
}

export function PioneeringSection({ data }: PioneeringSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-xl">
            <Factory className="absolute inset-0 m-auto h-32 w-32 text-slate-300" />
            <div className="absolute bottom-6 left-6 bg-white max-w-[200px] p-4 rounded-xl shadow-lg border-l-4 border-primary">
              <span className="text-3xl font-black text-slate-900 block">{data.statValue}</span>
              <span className="text-sm font-semibold text-slate-500">{data.statLabel}</span>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-sm bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 uppercase tracking-widest">
              {data.badge}
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              {data.title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {data.body}
            </p>
            <ListBlock items={data.highlights} bulletColor="primary" />
          </div>
          
        </div>
      </div>
    </section>
  );
}
