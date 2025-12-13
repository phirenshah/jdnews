
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SectionHeader } from '@/components/section-header';
import { ArticlesProvider } from '@/contexts/ArticlesContext';

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = await params;
  return (
    <ArticlesProvider>
      <div className="flex min-h-screen flex-col">
        <Header lang={lang} />
        <SectionHeader lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
      </div>
    </ArticlesProvider>
  );
}
