"use client";

import Link from 'next/link';
import { Newspaper, Search } from 'lucide-react';
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

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Reporters', href: '/reporters' },
  { name: 'Donate', href: '/donate' },
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
    <Button asChild>
      <Link href={`/${lang}/login`}>Login</Link>
    </Button>
  );
}

export function Header({ lang }: { lang: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">
            JD News
          </span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
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
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 w-full md:w-48 lg:w-64"
              />
            </div>
          </div>
          <LanguageToggle />
          <ThemeToggle />
          <Separator orientation="vertical" className="h-6" />
          <AuthButton lang={lang} />
        </div>
      </div>
    </header>
  );
}
