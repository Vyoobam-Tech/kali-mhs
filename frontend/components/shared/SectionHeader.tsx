interface SectionHeaderProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  centered?: boolean;
  lightText?: boolean; // For dark backgrounds
  badgeStyle?: 'pill' | 'text'; // pill style used on home, text style used on inner pages
}

export function SectionHeader({
  badge,
  title,
  titleHighlight,
  subtitle,
  centered = true,
  lightText = false,
  badgeStyle = 'pill',
}: SectionHeaderProps) {
  const isPill = badgeStyle === 'pill';
  
  return (
    <div className={`${centered ? 'text-center mx-auto' : ''} max-w-3xl mb-16 space-y-4`}>
      {badge && isPill && (
        <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold mb-2 ${lightText ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-primary/10 text-primary'}`}>
          {badge}
        </div>
      )}
      
      {badge && !isPill && (
        <span className="text-primary font-semibold text-sm uppercase tracking-widest block">
          {badge}
        </span>
      )}
      
      <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${lightText ? 'text-white' : 'text-slate-900'} leading-tight`}>
        {title} {titleHighlight && <span className="text-primary"><br className="hidden md:block" />{titleHighlight}</span>}
      </h2>
      
      {subtitle && (
        <p className={`text-lg ${lightText ? 'text-slate-400' : 'text-slate-600'} leading-relaxed mt-4`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
