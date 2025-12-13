
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SectionHeader } from '@/components/section-header';
import * as React from 'react';

export default function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = React.use(params);
  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} />
      <SectionHeader lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
