'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Briefcase,
  Settings,
  ShieldAlert,
  FolderOpen
} from 'lucide-react';

const sidebarRoutes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Products',
    icon: Package,
    href: '/dashboard/products',
    color: 'text-violet-500',
  },
  {
    label: 'RFQs & Orders',
    icon: ShoppingCart,
    href: '/dashboard/rfq',
    color: 'text-pink-700',
  },
  {
    label: 'Leads (CRM)',
    icon: Users,
    href: '/dashboard/leads',
    color: 'text-orange-700',
  },
  {
    label: 'Projects',
    icon: FolderOpen,
    href: '/dashboard/projects',
    color: 'text-emerald-500',
  },
  {
    label: 'Careers (ATS)',
    icon: Briefcase,
    href: '/dashboard/careers',
    color: 'text-blue-700',
  },
  {
    label: 'Content (CMS)',
    icon: FileText,
    href: '/dashboard/cms',
    color: 'text-green-700',
  },
  // TODO: Uncomment once /dashboard/audit and /dashboard/settings pages are created
  // { label: 'Audit Logs', icon: ShieldAlert, href: '/dashboard/audit', color: 'text-red-700' },
  // { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
             {/* Logo placeholder */}
             <div className="bg-white rounded-full w-full h-full flex items-center justify-center text-slate-900 font-bold">K</div>
          </div>
          <h1 className="text-2xl font-bold">Kali Admin</h1>
        </Link>
        <div className="space-y-1">
          {sidebarRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
