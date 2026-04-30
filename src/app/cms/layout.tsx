'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Calculator, Menu, Shield, LayoutDashboard, Database } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('cms_auth');
    if (!auth) {
      router.push('/');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('cms_auth');
    router.push('/');
  };

  const navItems = [
    { label: 'Dashboard (Saved Projects)', href: '/cms/dashboard', icon: LayoutDashboard },
    { label: 'Project Calculator', href: '/cms/calculator', icon: Calculator },
    { label: 'Master Data', href: '/cms/master-data', icon: Database },
  ];

  const SidebarMenu = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-sm">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-sm">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Workspace</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 rounded-sm ${!isActive && 'text-muted-foreground hover:text-foreground'}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 rounded-sm text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-40">
        <SidebarMenu />
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-border">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <SidebarMenu />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wider uppercase text-foreground">
                {navItems.find(i => i.href === pathname)?.label || 'CMS'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
