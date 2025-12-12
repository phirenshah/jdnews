"use client";

import Link from 'next/link';
import { Menu, Search, User, X } from 'lucide-react';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';


const navLinks = [
  { name: 'Home', href: '' },
  { name: 'Reporters', href: '/reporters' },
  { name: 'Subscribe', href: '#' },
  { name: 'Donate', href: '/donate' },
  { name: 'Advertise', href: '/advertise' },
];

function AuthButton({ lang }: { lang: string }) {
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

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href={`/${lang}/login`}>
        <User className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Login</span>
      </Link>
    </Button>
  );
}

export function Header({ lang }: { lang: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        
        <div className="mr-6 flex items-center">
          <Link href={`/${lang}`} className="flex items-center">
            <Image src="/logo.png" alt="JD News Logo" width={120} height={0} style={{height: 'auto'}} />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href.startsWith('#') ? link.href : `/${lang}${link.href}`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
            <div className={cn("relative hidden sm:block", isSearchOpen && "w-full max-w-xs")}>
                <div className={cn("relative transition-all duration-300", isSearchOpen ? "w-full" : "w-auto")}>
                    <div className={cn("absolute inset-y-0 left-0 flex items-center pl-3", isSearchOpen ? "pointer-events-none" : "pointer-events-auto")}>
                         <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Open search"
                        >
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                    <Input
                        type="search"
                        placeholder="Search..."
                        className={cn(
                            "pl-9 w-full transition-all duration-300 ease-in-out",
                            isSearchOpen ? "opacity-100" : "opacity-0 w-0"
                        )}
                        onBlur={() => setIsSearchOpen(false)}
                    />
                    {isSearchOpen && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setIsSearchOpen(false)}
                            aria-label="Close search"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
          
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <AuthButton lang={lang} />
          </div>

          <div className="flex items-center md:hidden">
              <LanguageToggle />
              <ThemeToggle />
              <AuthButton lang={lang} />
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
                      <Image src="/logo.png" alt="JD News Logo" width={120} height={0} style={{height: 'auto'}} />
                    </Link>
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href.startsWith('#') ? link.href : `/${lang}${link.href}`}
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
        </div>
      </div>
    </header>
  );
}
