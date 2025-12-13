
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
import { Users, DollarSign, LayoutDashboard, ExternalLink, User, Megaphone } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useFirebase } from "@/firebase";

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/articles', icon: Newspaper, label: 'Articles' },
    { href: '/admin/team', icon: Users, label: 'Team' },
    { href: '/admin/donations', icon: DollarSign, label: 'Donations' },
    { href: '/admin/advertise', icon: Megaphone, label: 'Advertise' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, isLoading } = useUserRole();
  const { auth } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
        router.push(`/en/login?redirect=${pathname}`);
    } else if (!isLoading && user && !isAdmin) {
        // If the user is logged in but not an admin, redirect them away.
        // You can redirect them to their profile or the homepage.
        router.push(`/en/profile`);
    }
  }, [user, isLoading, isAdmin, router, pathname]);

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
      router.push('/en/login');
    }
  };

  if (isLoading || !user || !isAdmin) {
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
            <Image src="/logo.png" alt="JD News Logo" width={120} height="0" style={{height: 'auto'}} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
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
                  <p className="text-sm font-medium text-sidebar-foreground">{user.displayName || "Admin"}</p>
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
          <Button variant="ghost" size="sm" onClick={handleLogout}>
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
