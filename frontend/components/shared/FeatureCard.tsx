import { LucideIcon } from 'lucide-react';
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'solid' | 'outline' | 'ghost'; // Solid = primary bg hover, Outline = border hover, Ghost = transparent bg
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = 'solid',
}: FeatureCardProps) {
  
  if (variant === 'solid') {
    return (
      <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:bg-white transition-all group">
        <div className="mb-6 bg-red-100/50 w-14 h-14 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
      </div>
    );
  }

  if (variant === 'outline') {
    return (
      <div className="bg-slate-800/60 rounded-2xl p-8 border border-slate-700 hover:border-primary/40 transition-colors">
        <div className="mb-5">{icon}</div>
        <h3 className="text-lg font-black mb-2 text-white">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    );
  }

  // Ghost (Global Reach regions style)
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800">
      <div className="mb-3">{icon}</div>
      <p className="font-black">{title}</p>
      {description && <p className="text-sm text-slate-500 mt-2">{description}</p>}
    </div>
  );
}
