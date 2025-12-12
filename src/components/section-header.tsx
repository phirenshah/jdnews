'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const sections = [
  { name: 'Politics', href: '#' },
  { name: 'Business', href: '#' },
  { name: 'Technology', href: '#' },
  { name: 'Sports', href: '#' },
  { name: 'World', href: '#' },
  { name: 'Entertainment', href: '#' },
  { name: 'Health', href: '#' },
  { name: 'Science', href: '#' },
];

export function SectionHeader({ lang }: { lang: string }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    // Logic to determine active section from pathname
    const currentPath = pathname.split('/')[2];
    const section = sections.find(
      (s) => s.href.substring(1) === currentPath
    );
    if (section) {
      setActiveSection(section.name);
    } else {
        // Default to first section if no match, or handle as needed
        setActiveSection(null);
    }
  }, [pathname]);

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-14 z-40">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-center h-12">
          <ul className="flex items-center space-x-6 md:space-x-8 overflow-x-auto py-2">
            {sections.map((section) => (
              <li key={section.name}>
                <Link
                  href={`/${lang}${section.href}`}
                  className={cn(
                    'relative whitespace-nowrap px-1 py-2 text-sm font-medium transition-colors duration-200 ease-in-out',
                    activeSection === section.name
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onMouseEnter={() => setActiveSection(section.name)}
                  onMouseLeave={() => {/* optional: reset to actual active section on leave */}}
                >
                  {section.name}
                  {activeSection === section.name && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform transition-transform duration-300 ease-out" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
