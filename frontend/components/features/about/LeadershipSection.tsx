import { Users } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { GridContainer } from '@/components/shared/GridContainer';

interface LeadershipSectionProps {
  data: {
    badge: string;
    title: string;
    titleHighlight: string;
    members: {
      name: string;
      role: string;
      bio: string;
    }[];
  };
}

export function LeadershipSection({ data }: LeadershipSectionProps) {
  if (!data) return null;

  return (
    <section id="leadership" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container">
        <SectionHeader 
          badge={data.badge} 
          title={data.title} 
          titleHighlight={data.titleHighlight} 
          badgeStyle="text" 
        />
        
        <GridContainer cols={4} gap="lg">
          {(data.members ?? []).map((person) => (
            <div key={person.name} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-black">{person.name}</h3>
              <p className="text-primary text-sm font-semibold mb-3">{person.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{person.bio}</p>
            </div>
          ))}
        </GridContainer>
      </div>
    </section>
  );
}
