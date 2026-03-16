import { Globe } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { GridContainer } from '@/components/shared/GridContainer';
import { FeatureCard } from '@/components/shared/FeatureCard';

interface GlobalReachSectionProps {
  data: {
    badge: string;
    title: string;
    titleHighlight: string;
    body: string;
    regions: string[];
  };
}

export function GlobalReachSection({ data }: GlobalReachSectionProps) {
  if (!data) return null;

  return (
    <section id="global" className="py-24 bg-white dark:bg-slate-950">
      <div className="container text-center space-y-6">
        <SectionHeader 
          badge={data.badge} 
          title={data.title} 
          titleHighlight={data.titleHighlight} 
          subtitle={data.body}
          badgeStyle="text"
        />
        
        <div className="pt-8 text-left">
          <GridContainer cols={4} gap="md">
            {(data.regions ?? []).map((region) => (
              <FeatureCard 
                key={region}
                icon={<Globe className="h-6 w-6 text-primary" />}
                title={region}
                description=""
                variant="ghost"
              />
            ))}
          </GridContainer>
        </div>
      </div>
    </section>
  );
}
