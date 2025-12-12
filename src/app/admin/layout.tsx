"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Newspaper, Users, DollarSign, CreditCard, LayoutDashboard, ExternalLink, User } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/articles', icon: Newspaper, label: 'Articles' },
    { href: '/admin/reporters', icon: Users, label: 'Reporters' },
    { href: '/admin/press-cards', icon: CreditCard, label: 'Press Cards' },
    { href: '/admin/donations', icon: DollarSign, label: 'Donations' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'owner') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'owner') {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Newspaper className="w-8 h-8 text-primary"/>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-sidebar-foreground font-headline">News Hub</h2>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                        <SidebarMenuButton
                            isActive={pathname === item.href}
                            tooltip={{ children: item.label, side: "right" }}
                        >
                            <item.icon/>
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="p-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-sidebar-accent">
                <User className="w-6 h-6 text-sidebar-foreground"/>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
                </div>
              </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <h1 className="flex-1 text-xl font-semibold font-headline tracking-wider">
            {navItems.find(item => item.href === pathname)?.label || 'Admin'}
          </h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/en">
              <ExternalLink className="mr-2 h-4 w-4"/>
              View Site
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
              Log Out
          </Button>
        </header>
        <main className="flex-1 p-6 bg-muted/40">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
