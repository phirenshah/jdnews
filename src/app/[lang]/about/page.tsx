import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { placeholderReporters } from '@/lib/placeholder-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Award, Target, Users, Newspaper } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AboutPage({ params: { lang } }: { params: { lang: 'en' | 'gu' } }) {
  const translations = {
    en: {
      title: 'About JD News',
      subtitle: 'Transparency, Truth, and Tenacity in Journalism.',
      missionTitle: 'Our Mission',
      missionText: 'To deliver unbiased, fact-checked news that empowers citizens to make informed decisions. We are committed to journalistic integrity and holding power accountable.',
      valuesTitle: 'Our Core Values',
      values: [
        { icon: Award, title: 'Integrity', text: 'Upholding the highest standards of honesty and ethical conduct.' },
        { icon: Target, title: 'Accuracy', text: 'Ensuring every story is thoroughly researched and factually correct.' },
        { icon: Users, title: 'Community', text: 'Serving our readers by giving voice to diverse perspectives.' },
        { icon: Newspaper, title: 'Independence', text: 'Remaining free from political, corporate, or any external influence.' },
      ],
      teamTitle: 'Meet the Team',
      teamText: 'The dedicated individuals bringing you the news, day in and day out.',
    },
    gu: {
      title: 'જેડી ન્યૂઝ વિશે',
      subtitle: 'પત્રકારત્વમાં પારદર્શિતા, સત્ય અને દ્રઢતા.',
      missionTitle: 'અમારું મિશન',
      missionText: 'પક્ષપાત રહિત, તથ્ય-ચકાસાયેલ સમાચાર પહોંચાડવા જે નાગરિકોને જાણકાર નિર્ણયો લેવા માટે સશક્ત બનાવે છે. અમે પત્રકારત્વની અખંડિતતા અને સત્તાને જવાબદાર ઠેરવવા માટે પ્રતિબદ્ધ છીએ.',
      valuesTitle: 'અમારા મૂળભૂત મૂલ્યો',
      values: [
        { icon: Award, title: 'અખંડિતતા', text: 'પ્રામાણિકતા અને નૈતિક આચરણના ઉચ્ચતમ ધોરણોને જાળવી રાખવા.' },
        { icon: Target, title: 'ચોકસાઈ', text: 'દરેક વાર્તા સંપૂર્ણ સંશોધન અને તથ્યપૂર્ણ રીતે સાચી છે તેની ખાતરી કરવી.' },
        { icon: Users, title: 'સમુદાય', text: 'વિવિધ દ્રષ્ટિકોણને અવાજ આપીને અમારા વાચકોની સેવા કરવી.' },
        { icon: Newspaper, title: 'સ્વતંત્રતા', text: 'રાજકીય, કોર્પોરેટ અથવા કોઈપણ બાહ્ય પ્રભાવથી મુક્ત રહેવું.' },
      ],
      teamTitle: 'ટીમને મળો',
      teamText: 'જેઓ દિવસ-રાત તમારા સુધી સમાચાર પહોંચાડે છે તે સમર્પિત વ્યક્તિઓ.',
    },
  };

  const t = translations[lang];
  const aboutHeroImage = PlaceHolderImages.find((img) => img.id === 'about-hero');
  const aboutContentImage = PlaceHolderImages.find((img) => img.id === 'about-content');

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-80 bg-muted">
        {aboutHeroImage && (
            <Image
            src={aboutHeroImage.imageUrl}
            alt="Newsroom"
            fill
            className="object-cover"
            data-ai-hint={aboutHeroImage.imageHint}
            priority
            />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="font-headline text-5xl md:text-7xl font-bold">{t.title}</h1>
            <p className="mt-4 text-lg md:text-xl">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-16">
        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="font-headline text-4xl font-bold text-primary">{t.missionTitle}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{t.missionText}</p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            {aboutContentImage && (
                <Image
                src={aboutContentImage.imageUrl}
                alt="Journalist at work"
                width={600}
                height={400}
                className="object-cover"
                data-ai-hint={aboutContentImage.imageHint}
                />
            )}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Core Values Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">{t.valuesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-lg shadow-sm halo-effect">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-headline text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Meet the Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">{t.teamTitle}</h2>
            <p className="text-lg text-muted-foreground mt-2">{t.teamText}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {placeholderReporters.map((reporter) => {
              const reporterImage = PlaceHolderImages.find((img) => img.id === reporter.imageId);
              return (
                <Card key={reporter.id} className="text-center border-0 shadow-none">
                  <CardHeader className="p-0">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                      {reporterImage && (
                        <Image
                          src={reporterImage.imageUrl}
                          alt={reporter.name}
                          width={128}
                          height={128}
                          className="object-cover"
                          data-ai-hint={reporterImage.imageHint}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="mt-4">
                    <h3 className="text-lg font-bold font-headline">{reporter.name}</h3>
                    <p className="text-primary text-sm font-medium">{reporter.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
