import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  primaryButton?: { label: string; href: string };
  secondaryButton?: { label: string; href: string };
  variant?: 'home' | 'page'; // 'home' has larger text and different gradient
}

export function HeroBanner({
  badge,
  title,
  titleHighlight,
  subtitle,
  primaryButton,
  secondaryButton,
  variant = 'page',
}: HeroBannerProps) {
  const isHome = variant === 'home';

  return (
    <section className={`relative overflow-hidden bg-slate-900 text-white ${isHome ? 'pt-32 pb-24 md:py-48' : 'pt-32 pb-24'}`}>
      {/* Background Gradients */}
      {isHome ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/40 z-10" />
          <div className="absolute inset-0 bg-slate-800/80 z-0" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-primary/20 z-0" />
      )}

      <div className={`container relative ${isHome ? 'z-20' : 'z-10'}`}>
        <div className={isHome ? 'max-w-3xl space-y-8' : 'max-w-3xl space-y-6'}>
          
          {/* Badge */}
          {badge && isHome ? (
             <div className="inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm text-primary-foreground backdrop-blur-sm">
               <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
               {badge}
             </div>
          ) : badge && !isHome ? (
             <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest">
               <span className="h-px w-8 bg-primary"></span>
               {badge}
               <span className="h-px w-8 bg-primary"></span>
             </span>
          ) : null}

          {/* Title */}
          <h1 className={`${isHome ? 'text-5xl md:text-7xl font-extrabold leading-[1.1]' : 'text-5xl md:text-7xl font-black leading-none'} tracking-tight text-white`}>
            {title} {titleHighlight && <span className="text-primary">{titleHighlight}</span>}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          {/* Buttons */}
          {(primaryButton || secondaryButton) && (
            <div className={`flex ${isHome ? 'flex-col sm:flex-row' : 'flex-wrap'} gap-4 pt-4`}>
              {primaryButton && (
                <Button size="lg" className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-full transition-all hover:scale-105" asChild>
                  <Link href={primaryButton.href}>
                    {primaryButton.label} {isHome && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Link>
                </Button>
              )}
              {secondaryButton && (
                <Button variant="outline" size="lg" className="h-14 px-8 text-base font-bold text-white border-white/20 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm transition-all" asChild>
                  <Link href={secondaryButton.href}>{secondaryButton.label}</Link>
                </Button>
              )}
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
