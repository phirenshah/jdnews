
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { sections } from '@/lib/categories';

export function SectionHeader() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    // For category pages like /category/national
    const categoryMatch = pathname.match(/\/category\/([^/]+)/);
    if (categoryMatch) {
      const categoryName = categoryMatch[1];
      // Find the section where the href ends with the category name for an exact match
      const section = sections.find(s => s.href.endsWith(`/${categoryName}`));
      setActiveSection(section ? section.name : null);
      return;
    }

    // For the homepage
    if (pathname === `/`) {
        setActiveSection('Top Stories');
        return;
    }
    
    // For other top-level pages
    const topLevelMatch = sections.find(s => s.href === pathname);
    if(topLevelMatch) {
      setActiveSection(topLevelMatch.name);
    } else {
      setActiveSection(null);
    }

  }, [pathname]);

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-center h-12">
          <ul 
            className="flex items-center space-x-6 md:space-x-8 overflow-x-auto py-2"
          >
            {sections.map((section) => {
              const href = section.href;
              return (
                <li key={section.name}>
                  <Link
                    href={href}
                    className={cn(
                      'relative whitespace-nowrap px-1 py-2 text-sm font-medium transition-colors duration-200 ease-in-out',
                      activeSection === section.name
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {section.name}
                    {activeSection === section.name && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform transition-transform duration-300 ease-out" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
