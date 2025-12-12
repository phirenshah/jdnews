import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={params.lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={params.lang} />
    </div>
  );
}
