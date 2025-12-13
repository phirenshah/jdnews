
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const sections = [
  { name: 'Politics', href: '/category/politics' },
  { name: 'Business', href: '/category/business' },
  { name: 'Technology', href: '/category/technology' },
  { name: 'Sports', href: '/category/sports' },
  { name: 'World', href: '/category/world' },
  { name: 'Entertainment', href: '/category/entertainment' },
  { name: 'Health', href: '/category/health' },
  { name: 'Science', href: '/category/science' },
];

export function SectionHeader({ lang }: { lang: string }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    // Logic to determine active section from pathname
    const currentPath = pathname.split('/')[3]; // e.g. /en/category/politics -> politics
    const section = sections.find(
      (s) => s.href.split('/')[2] === currentPath
    );
    if (section) {
      setActiveSection(section.name);
    } else {
        // Default to null if no match
        setActiveSection(null);
    }
  }, [pathname]);

  const displaySection = hoveredSection || activeSection;

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-14 z-40">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-center h-12">
          <ul 
            className="flex items-center space-x-6 md:space-x-8 overflow-x-auto py-2"
            onMouseLeave={() => setHoveredSection(null)}
          >
            {sections.map((section) => (
              <li key={section.name}>
                <Link
                  href={`/${lang}${section.href}`}
                  className={cn(
                    'relative whitespace-nowrap px-1 py-2 text-sm font-medium transition-colors duration-200 ease-in-out',
                    displaySection === section.name
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onMouseEnter={() => setHoveredSection(section.name)}
                >
                  {section.name}
                  {displaySection === section.name && (
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

    