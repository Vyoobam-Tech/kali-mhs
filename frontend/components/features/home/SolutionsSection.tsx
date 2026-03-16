import { PenTool, Factory, ShieldCheck, CheckCircle2, Wrench, Lightbulb } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { GridContainer } from '@/components/shared/GridContainer';
import { FeatureCard } from '@/components/shared/FeatureCard';

const SOLUTION_ICONS: React.ReactNode[] = [
  <PenTool className="h-6 w-6" key="pen" />,
  <Factory className="h-6 w-6" key="factory" />,
  <ShieldCheck className="h-6 w-6" key="shield" />,
  <CheckCircle2 className="h-6 w-6" key="check2" />,
  <Wrench className="h-6 w-6" key="wrench" />,
  <Lightbulb className="h-6 w-6" key="lightbulb" />,
];

interface SolutionsSectionProps {
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

export function SolutionsSection({ data }: SolutionsSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container">
        <SectionHeader 
          badge={data.badge} 
          title={data.title} 
          subtitle={data.subtitle} 
        />
        
        <GridContainer cols={3}>
          {(data.items ?? []).map((sol, i) => (
            <FeatureCard 
              key={i}
              icon={SOLUTION_ICONS[i % SOLUTION_ICONS.length]}
              title={sol.title}
              description={sol.desc}
              variant="solid"
            />
          ))}
        </GridContainer>
      </div>
    </section>
  );
}
