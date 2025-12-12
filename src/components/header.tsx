"use client";

import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';


const navLinks = [
  { name: 'Reporters', href: '/reporters' },
  { name: 'Donate', href: '/donate' },
];

function AuthButton({ lang, isMobile }: { lang: string, isMobile?: boolean }) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />;
  }
  
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/${lang}/profile`}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          {user.role === 'owner' && (
            <Link href="/admin">
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (isMobile) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/${lang}/login`}>
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Login</span>
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild>
      <Link href={`/${lang}/login`}>Login</Link>
    </Button>
  );
}

export function Header({ lang }: { lang: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <Image src="/logo.png" alt="JD News Logo" width={100} height={40} className="h-10 w-auto" />
          </Link>
        
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href={`/${lang}`} className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={`/${lang}${link.href}`}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 w-32 lg:w-48"
              />
            </div>
          </div>
          
          <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>
                        <VisuallyHidden>Mobile Navigation Menu</VisuallyHidden>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  <Link href={`/${lang}`} className="flex items-center space-x-2 mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image src="/logo.png" alt="JD News Logo" width={100} height={40} className="h-10 w-auto" />
                  </Link>
                  <nav className="flex flex-col gap-4">
                    <Link href={`/${lang}`} className="text-lg font-medium text-foreground/80 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={`/${lang}${link.href}`}
                        className="text-lg font-medium text-foreground/80 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex">
              <LanguageToggle />
              <ThemeToggle />
              <Separator orientation="vertical" className="h-6" />
            </div>
            <AuthButton lang={lang} />
          </div>
        </div>
      </div>
    </header>
  );
}
