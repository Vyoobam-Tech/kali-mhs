import { Settings, HardHat, Ship, HomeIcon, Zap, Tractor, Package } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { GridContainer } from '@/components/shared/GridContainer';

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  'Mining & Minerals': <HardHat className="h-6 w-6" />,
  'Ports & Terminals': <Ship className="h-6 w-6" />,
  'Cement & Construction': <HomeIcon className="h-6 w-6" />,
  'Power Generation': <Zap className="h-6 w-6" />,
  'Food & Agriculture': <Tractor className="h-6 w-6" />,
  'Warehousing & Logistics': <Package className="h-6 w-6" />,
};

interface SectorsSectionProps {
  data: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
}

export function SectorsSection({ data }: SectorsSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 bg-slate-950 text-white">
      <div className="container">
        <SectionHeader 
          badge={data.badge} 
          title={data.title} 
          subtitle={data.subtitle} 
          lightText={true}
          badgeStyle="pill"
        />
        
        <GridContainer cols={3} gap="md">
          {(data.items ?? []).map((sector, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all block cursor-pointer transform-gpu">
              <div className="h-40 bg-slate-800/50 relative overflow-hidden group-hover:scale-105 transition-transform duration-500 transform-gpu">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              </div>
              <div className="p-6 relative z-10 flex gap-4 -mt-10">
                <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl border-2 border-slate-900">
                  {SECTOR_ICONS[sector.title] ?? <Settings className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">{sector.title}</h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">{sector.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </GridContainer>
      </div>
    </section>
  );
}
