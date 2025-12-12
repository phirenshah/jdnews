import Link from 'next/link';
import { Twitter, Facebook, Instagram, Heart } from 'lucide-react';
import Image from 'next/image';

export function Footer({ lang }: { lang: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Link href={`/${lang}`} className="flex items-center space-x-2 text-foreground">
              <Image src="/logo.png" alt="JD News Logo" width={100} height={40} className="h-10 w-auto" />
            </Link>
            <p className="text-sm">
              Your trusted source for news.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary"><Twitter /></Link>
              <Link href="#" className="hover:text-primary"><Facebook /></Link>
              <Link href="#" className="hover:text-primary"><Instagram /></Link>
            </div>
          </div>
          <div className="sm:col-start-2 md:col-start-auto">
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
              <li>
                <Link href={`/${lang}/donate`} className="hover:text-primary flex items-center gap-1.5">
                  Donate <Heart className="w-4 h-4 text-red-500" />
                </Link>
              </li>
              <li><Link href="#" className="hover:text-primary">Advertise</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm">
          <p>&copy; {currentYear} JD News. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
