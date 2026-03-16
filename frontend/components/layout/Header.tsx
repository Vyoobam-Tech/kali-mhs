'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Factory, BookOpen, ChevronRight } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useQuery } from '@tanstack/react-query';
import { cmsApi } from '@/lib/api/cms';

const aboutItems = [
  { title: "Company History", href: "/about#history", description: "Our legacy of engineering excellence over 50 years." },
  { title: "Leadership", href: "/about#leadership", description: "Meet the minds driving our global operations." },
  { title: "Manufacturing Facilities", href: "/about#manufacturing", description: "State-of-the-art ISO certified fabrication hubs." },
  { title: "Quality Assurance", href: "/about#quality", description: "Rigorous standards and safety protocols." },
  { title: "Global Reach", href: "/about#global", description: "Serving heavy industries worldwide." },
]

const resourceItems = [
  { title: "Brochures", href: "/resources/brochures", description: "Downloadable product specifications and guides." },
  { title: "Case Studies", href: "/resources/case-studies", description: "Success stories from our global partners." },
  { title: "Catalogue", href: "/resources/catalogue", description: "Complete inventory of our material handling solutions." },
]

export function Header() {
  const pathname = usePathname();

  // Fetch navigation links from CMS
  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'nav-links'],
    queryFn: () => cmsApi.getBySlug('nav-links'),
  });

  const cms = (() => {
    try {
      const raw = cmsData?.data?.page?.content;
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const defaultLinks = [
    { label: 'Products', href: '/products' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Resources', href: '/resources' },
    { label: 'Careers', href: '/careers' },
  ];

  const links: { label: string; href: string }[] = cms?.links ?? defaultLinks;

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string }
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
              className
            )}
            {...props}
          >
            <div className="text-sm font-bold leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-slate-500 dark:text-slate-400 mt-1">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  })
  ListItem.displayName = "ListItem"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex shrink-0">
          <Link href="/" className="flex items-center space-x-2 font-black text-2xl tracking-tighter hover:opacity-90 transition-opacity">
            <span className="text-primary text-3xl">kali</span>
            <span className="text-foreground text-sm font-bold tracking-widest mt-1">MHS</span>
          </Link>
        </div>

        {/* Desktop Nav - Hidden on small screens, shown on lg screens */}
        <div className="hidden lg:flex flex-1 justify-center items-center px-4">
          <NavigationMenu>
            <NavigationMenuList className="gap-1 xl:gap-2">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-sm font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-3 xl:px-4")}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {links.map((link) => {
                // Specialized Mega Menu for About
                if (link.label.toLowerCase().includes('about')) {
                  return (
                    <NavigationMenuItem key={link.label}>
                      <NavigationMenuTrigger className="text-sm font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-3 xl:px-4">{link.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="flex w-[800px] lg:w-[1000px] gap-6 p-6 md:p-8">
                          {/* Featured Branding Box */}
                          <div className="w-[320px] shrink-0 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
                            <div className="relative z-10 space-y-4">
                              <Factory className="h-10 w-10 text-primary" />
                              <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Pioneering<br />Excellence</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Over 50 years of engineering expertise driving bulk material handling solutions worldwide across primary industry sectors.</p>
                            </div>
                            <Link href={link.href} className="relative z-10 mt-8 flex items-center text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">
                              Discover Our Legacy <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>

                          {/* Multi-column Navigation Links */}
                          <div className="flex-1 py-4">
                            <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 px-3">Company Overview</h5>
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {aboutItems.map((component) => (
                                <ListItem
                                  key={component.title}
                                  title={component.title}
                                  href={component.href}
                                >
                                  {component.description}
                                </ListItem>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                }

                // Specialized Mega Menu for Resources / Content Hub
                if (link.label.toLowerCase().includes('resource') || link.label.toLowerCase().includes('content')) {
                  return (
                    <NavigationMenuItem key={link.label}>
                      <NavigationMenuTrigger className="text-sm font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-3 xl:px-4">{link.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="flex w-[800px] lg:w-[900px] gap-6 p-6 md:p-8">
                          {/* Multi-column Navigation Links */}
                          <div className="flex-1 py-4 pl-2">
                            <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 px-3">Resource Center</h5>
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {resourceItems.map((component) => (
                                <ListItem
                                  key={component.title}
                                  title={component.title}
                                  href={component.href}
                                >
                                  {component.description}
                                </ListItem>
                              ))}
                            </ul>
                          </div>

                          {/* Featured Resource Box */}
                          <div className="w-[320px] shrink-0 bg-primary border text-white rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group shadow-lg shadow-primary/20">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 z-0"></div>
                            <div className="relative z-10 space-y-4">
                              <BookOpen className="h-10 w-10 text-white/90" />
                              <h4 className="text-2xl font-black tracking-tight">Technical<br />Library</h4>
                              <p className="text-sm text-white/80 leading-relaxed">Explore our comprehensive documentation, project data sheets, and detailed technical specifications.</p>
                            </div>
                            <Link href={link.href} className="relative z-10 mt-8 flex w-max items-center bg-white text-primary text-sm font-bold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow group-hover:scale-105 transform-gpu">
                              View Full Catalogue
                            </Link>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                }

                // Standard Link for everything else
                return (
                  <NavigationMenuItem key={link.label}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-sm font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-3 xl:px-4")}>
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}

              {/* Force RFQ and Contact at the end */}
              <NavigationMenuItem>
                <Link href="/rfq" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-sm font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-primary hover:text-primary/80 px-3 xl:px-4")}>
                    RFQ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-sm font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent px-3 xl:px-4")}>
                    Contact Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-4">
          {/* Mobile Menu - Hidden on large screens */}
          <div className="lg:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="font-bold text-lg uppercase tracking-wider">Home</Link>

                  {links.map(link => {
                    if (link.label.toLowerCase().includes('about')) {
                      return (
                        <div key={link.label} className="space-y-4 border-b border-t py-6">
                          <h4 className="font-bold text-lg text-primary uppercase tracking-wider">{link.label}</h4>
                          <div className="flex flex-col gap-3 pl-4">
                            {aboutItems.map(item => (
                              <Link key={item.href} href={item.href} className="text-base font-medium text-slate-600 dark:text-slate-300">
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (link.label.toLowerCase().includes('resource') || link.label.toLowerCase().includes('content')) {
                      return (
                        <div key={link.label} className="space-y-4 border-b border-t py-6">
                          <h4 className="font-bold text-lg text-primary uppercase tracking-wider">{link.label}</h4>
                          <div className="flex flex-col gap-3 pl-4">
                            {resourceItems.map(item => (
                              <Link key={item.href} href={item.href} className="text-base font-medium text-slate-600 dark:text-slate-300">
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <Link key={link.label} href={link.href} className="font-bold text-lg uppercase tracking-wider">{link.label}</Link>
                    );
                  })}

                  <Link href="/rfq" className="font-bold text-lg uppercase tracking-wider text-primary">RFQ</Link>
                  <Link href="/contact" className="font-bold text-lg uppercase tracking-wider">Contact Us</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
