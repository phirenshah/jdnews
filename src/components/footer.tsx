import Link from 'next/link';
import { Newspaper, Twitter, Facebook, Instagram } from 'lucide-react';

export function Footer({ lang }: { lang: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href={`/${lang}`} className="flex items-center space-x-2 text-foreground">
              <Newspaper className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">
                Bilingual News Hub
              </span>
            </Link>
            <p className="text-sm">
              Your trusted source for news in English and Gujarati.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary"><Twitter /></Link>
              <Link href="#" className="hover:text-primary"><Facebook /></Link>
              <Link href="#" className="hover:text-primary"><Instagram /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Sections</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary">Politics</Link></li>
              <li><Link href="#" className="hover:text-primary">Business</Link></li>
              <li><Link href="#" className="hover:text-primary">Technology</Link></li>
              <li><Link href="#" className="hover:text-primary">Sports</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href={`/${lang}/reporters`} className="hover:text-primary">Our Reporters</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href={`/${lang}/donate`} className="hover:text-primary">Donate</Link></li>
              <li><Link href="#" className="hover:text-primary">Advertise</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm">
          <p>&copy; {currentYear} Bilingual News Hub. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
