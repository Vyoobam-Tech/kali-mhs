import { Building2 } from 'lucide-react';
import { ListBlock } from '@/components/shared/ListBlock';

interface ManufacturingSectionProps {
  data: {
    badge: string;
    title: string;
    titleHighlight: string;
    body: string;
    capabilities: string[];
    facilities: string[];
  };
}

export function ManufacturingSection({ data }: ManufacturingSectionProps) {
  if (!data) return null;

  return (
    <section id="manufacturing" className="py-24 bg-white dark:bg-slate-950">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest block">{data.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {data.title}<br /><span className="text-primary">{data.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{data.body}</p>
            
            <ListBlock 
              items={data.capabilities ?? []} 
              icon={<span className="h-2 w-2 rounded-full bg-primary shrink-0 mr-3"></span>}
              layout="col"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {(data.facilities ?? []).map((f: string, i: number) => (
              <div key={f} className={`rounded-2xl p-8 flex flex-col justify-end min-h-[180px] ${i % 2 === 0 ? 'bg-slate-900 text-white' : 'bg-primary text-white'}`}>
                <div className="text-2xl mb-1"><Building2 className="h-8 w-8 opacity-80" /></div>
                <p className="font-black text-base">{f}</p>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
