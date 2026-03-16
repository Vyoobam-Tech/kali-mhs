import { SectionHeader } from '@/components/shared/SectionHeader';

interface TimelineSectionProps {
  data: {
    badge: string;
    title: string;
    items: {
      year: string;
      title: string;
      desc: string;
    }[];
  };
}

export function TimelineSection({ data }: TimelineSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container max-w-5xl">
        <SectionHeader badge={data.badge} title={data.title} badgeStyle="text" />
        
        <div className="relative border-l-2 border-primary/20 pl-8 md:pl-16 space-y-14">
          {(data.items ?? []).map((item) => (
            <div key={item.year} className="relative">
              <div className="absolute -left-[2.6rem] md:-left-[4.6rem] top-1.5 w-5 h-5 rounded-full bg-primary border-4 border-white dark:border-slate-950 shadow-lg"></div>
              <span className="text-primary font-black text-sm uppercase tracking-widest">{item.year}</span>
              <h3 className="text-xl font-black mt-1 mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
