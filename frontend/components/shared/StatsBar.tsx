interface StatsBarProps {
  stats: { value: string; label: string }[];
}

export function StatsBar({ stats }: StatsBarProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="bg-primary py-10">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-4xl font-black">{s.value}</div>
            <div className="text-sm font-semibold text-white/80 mt-1 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
