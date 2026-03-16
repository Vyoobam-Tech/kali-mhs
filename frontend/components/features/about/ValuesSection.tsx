import { Award, ShieldCheck, Globe, Users } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { GridContainer } from '@/components/shared/GridContainer';
import { FeatureCard } from '@/components/shared/FeatureCard';

const VALUE_ICONS = [
  <Award key="award" className="h-8 w-8 text-primary" />,
  <ShieldCheck key="shield" className="h-8 w-8 text-primary" />,
  <Globe key="globe" className="h-8 w-8 text-primary" />,
  <Users key="users" className="h-8 w-8 text-primary" />,
];

interface ValuesSectionProps {
  data: {
    badge: string;
    title: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
}

export function ValuesSection({ data }: ValuesSectionProps) {
  if (!data) return null;

  return (
    <section id="quality" className="py-24 bg-slate-900 text-white">
      <div className="container">
        <SectionHeader 
          badge={data.badge} 
          title={data.title} 
          lightText={true} 
          badgeStyle="text"
        />
        
        <GridContainer cols={4} gap="lg">
          {(data.items ?? []).map((v, i) => (
            <FeatureCard 
              key={v.title}
              icon={VALUE_ICONS[i % VALUE_ICONS.length]}
              title={v.title}
              description={v.desc}
              variant="outline"
            />
          ))}
        </GridContainer>
      </div>
    </section>
  );
}
