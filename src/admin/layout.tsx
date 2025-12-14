
"use client";

import { Users, DollarSign, ExternalLink, User, Megaphone, Menu, Newspaper, UserCog } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUserRole } from "@/hooks/use-user-role";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useFirebase } from "@/firebase";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
    { href: '/admin/articles', icon: Newspaper, label: 'Articles' },
    { href: '/admin/team', icon: Users, label: 'Team' },
    { href: '/admin/users', icon: UserCog, label: 'Users' },
    { href: '/admin/donations', icon: DollarSign, label: 'Donations' },
    { href: '/admin/advertise', icon: Megaphone, label: 'Advertise' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, isLoading } = useUserRole();
  const { auth } = useFirebase();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
        if (!user) {
            router.push(`/login?redirect=${pathname}`);
        } else if (!isAdmin) {
            router.push(`/profile`);
        }
    }
  }, [user, isLoading, isAdmin, router, pathname]);

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
      router.push('/login');
    }
  };

  const activeLabel = navItems.find(item => pathname.startsWith(item.href))?.label || 'Admin';

  if (isLoading || !user || !isAdmin) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                        <Image src="/logo.png" alt="JD News Logo" width={100} height={23} style={{ height: 'auto' }} />
                        <span className="sr-only">JD News</span>
                    </Link>
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "transition-colors hover:text-foreground",
                                pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                        {item.label}
                        </Link>
                    ))}
                </nav>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setIsSheetOpen(false)}>
                                <Image src="/logo.png" alt="JD News Logo" width={100} height={23} style={{ height: 'auto' }} />
                                <span className="sr-only">JD News</span>
                            </Link>
                            {navItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSheetOpen(false)}
                                    className={cn(
                                        "transition-colors hover:text-foreground",
                                        pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="ml-auto flex-1 sm:flex-initial">
                        <h1 className="text-xl font-semibold font-headline tracking-wider">{activeLabel}</h1>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/">
                            <ExternalLink className="mr-2 h-4 w-4"/>
                            View Site
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.email}.png`} alt={user.displayName || 'Admin'} />
                                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
            </main>
        </div>
  );
}
