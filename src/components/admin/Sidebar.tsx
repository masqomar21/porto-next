'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Sparkles,
  User,
  Zap,
  Briefcase,
  FileText,
  Mail,
  Settings,
  Shield,
  Globe,
  LogOut
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/hero', label: 'Hero Section', icon: Sparkles },
  { href: '/admin/about', label: 'About', icon: User },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/contact', label: 'Contact', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col fixed top-0 left-0 z-50 hidden lg:flex">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-md flex items-center justify-center text-white shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground leading-tight">Admin CMS</h2>
            <p className="text-[10px] text-muted-foreground">Portfolio Manager</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
        >
          <Globe className="w-4 h-4" />
          View Site
        </a>
        <form action={logout} className="w-full">
          <Button type="submit" variant="destructive" className="w-full justify-start gap-3 bg-transparent text-destructive hover:bg-destructive/10 border-transparent shadow-none hover:text-destructive cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
