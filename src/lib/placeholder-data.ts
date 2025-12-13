
import type { Article, Reporter, Donation } from '@/lib/definitions';

export const placeholderArticles: Article[] = [
  {
    id: '1',
    slug: 'major-political-summit-concludes-with-historic-agreement',
    title: {
      en: 'Major Political Summit Concludes with Historic Agreement',
      gu: 'મુખ્ય રાજકીય શિખર સંમેલન ઐતિહાસિક સમજૂતી સાથે સમાપ્ત થયું',
    },
    excerpt: {
      en: 'World leaders have signed a landmark agreement on climate change and trade, marking a new era of global cooperation.',
      gu: 'વિશ્વના નેતાઓએ આબોહવા પરિવર્તન અને વેપાર પર એક સીમાચિહ્નરૂપ કરાર પર હસ્તાક્ષર કર્યા છે, જે વૈશ્વિક સહયોગના નવા યુગની નિશાની છે.',
    },
    content: {
      en: 'After weeks of intense negotiations, the summit concluded today. The agreement, hailed as a monumental achievement, addresses key issues such as carbon emissions, international trade tariffs, and sustainable development goals. Analysts believe this could reshape international relations for decades to come.',
      gu: 'અઠવાડિયાની તીવ્ર વાટાઘાટો પછી, શિખર સંમેલન આજે સમાપ્ત થયું. આ કરાર, જેને એક સ્મારક સિદ્ધિ તરીકે ઓળખવામાં આવે છે, તે કાર્બન ઉત્સર્જન, આંતરરાષ્ટ્રીય વેપાર ટેરિફ અને ટકાઉ વિકાસ લક્ષ્યો જેવા મુખ્ય મુદ્દાઓને સંબોધિત કરે છે. વિશ્લેષકો માને છે કે આ આવનારા દાયકાઓ સુધી આંતરરાષ્ટ્રીય સંબંધોને ફરીથી આકાર આપી શકે છે.',
    },
    author: 'Aarav Sharma',
    category: 'Politics',
    publishedAt: '2024-07-28',
    imageId: 'hero-article',
  },
  {
    id: '2',
    slug: 'tech-giant-unveils-revolutionary-ai-chip',
    title: {
      en: 'Tech Giant Unveils Revolutionary AI Chip',
      gu: 'ટેક જાયન્ટે ક્રાંતિકારી AI ચિપનું અનાવરણ કર્યું',
    },
    excerpt: {
      en: 'The new "QuantumCore" chip promises to be 1000x faster than current generation processors, enabling real-time complex AI.',
      gu: 'નવી "ક્વોન્ટમકોર" ચિપ વર્તમાન પેઢીના પ્રોસેસરો કરતાં 1000x વધુ ઝડપી હોવાનું વચન આપે છે, જે રીઅલ-ટાઇમ જટિલ AI ને સક્ષમ બનાવે છે.',
    },
    content: {
      en: 'The tech world is buzzing after the announcement. The QuantumCore chip utilizes novel architecture that could power everything from autonomous vehicles to advanced medical diagnostics. The company plans to release developer kits by the end of the year.',
      gu: 'જાહેરાત પછી ટેક જગતમાં ઉત્સાહ છે. ક્વોન્ટમકોર ચિપ નવીન આર્કિટેક્ચરનો ઉપયોગ કરે છે જે સ્વાયત્ત વાહનોથી લઈને અદ્યતન તબીબી નિદાન સુધીની દરેક વસ્તુને શક્તિ આપી શકે છે. કંપની વર્ષના અંત સુધીમાં ડેવલપર કિટ્સ બહાર પાડવાની યોજના ધરાવે છે.',
    },
    author: 'Priya Patel',
    category: 'Technology',
    publishedAt: '2024-07-27',
    imageId: 'article-1',
  },
    {
    id: '3',
    slug: 'national-cricket-team-wins-world-championship',
    title: {
      en: 'National Cricket Team Wins World Championship in Thriller Final',
      gu: 'રાષ્ટ્રીય ક્રિકેટ ટીમે રોમાંચક ફાઇનલમાં વર્લ્ડ ચેમ્પિયનશિપ જીતી',
    },
    excerpt: {
      en: 'A last-ball six secured a dramatic victory against arch-rivals, bringing the trophy home after 12 years.',
      gu: 'છેલ્લા બોલ પર છગ્ગાએ કટ્ટર હરીફો સામે નાટકીય વિજય સુનિશ્ચિત કર્યો, 12 વર્ષ પછી ટ્રોફી ઘરે લાવી.',
    },
    content: {
      en: 'In a match that will be remembered for generations, the team chased down a mammoth total. The captain was named player of the tournament for his outstanding performance with both bat and ball.',
      gu: 'પેઢીઓ સુધી યાદ રહે તેવી મેચમાં, ટીમે એક વિશાળ ટોટલનો પીછો કર્યો. કેપ્ટનને બેટ અને બોલ બંને સાથેના તેના ઉત્કૃષ્ટ પ્રદર્શન માટે પ્લેયર ઓફ ધ ટુર્નામેન્ટ જાહેર કરવામાં આવ્યો હતો.',
    },
    author: 'Rohan Mehta',
    category: 'Sports',
    publishedAt: '2024-07-26',
    imageId: 'article-2',
  },
  {
    id: '4',
    slug: 'archaeologists-uncover-lost-city-in-dense-jungle',
    title: {
      en: 'Archaeologists Uncover Lost City in Dense Jungle',
      gu: 'પુરાતત્વવિદોએ ગાઢ જંગલમાં ખોવાયેલું શહેર શોધી કાઢ્યું',
    },
    excerpt: {
      en: 'The newly discovered city, believed to be over 2000 years old, could rewrite the history of the region.',
      gu: 'નવું શોધાયેલું શહેર, જે 2000 વર્ષથી વધુ જૂનું હોવાનું માનવામાં આવે છે, તે આ પ્રદેશના ઇતિહાસને ફરીથી લખી શકે છે.',
    },
    content: {
      en: 'Using advanced satellite imagery, the team was able to locate the ruins. Initial findings include a large pyramid, residential complexes, and intricate pottery. The discovery is being called the most significant archaeological find of the century.',
      gu: 'અદ્યતન સેટેલાઇટ ઇમેજરીનો ઉપયોગ કરીને, ટીમ ખંડેરોને શોધી શકી. પ્રારંભિક તારણોમાં એક મોટો પિરામિડ, રહેણાંક સંકુલો અને જટિલ માટીકામનો સમાવેશ થાય છે. આ શોધને સદીની સૌથી મહત્વપૂર્ણ પુરાતત્વીય શોધ કહેવામાં આવી રહી છે.',
    },
    author: 'Isha Singh',
    category: 'World',
    publishedAt: '2024-07-25',
    imageId: 'article-3',
  },
];

export const placeholderReporters: Reporter[] = [
    {
      id: 'aarav-sharma',
      name: 'Aarav Sharma',
      title: 'Senior Political Correspondent',
      imageId: 'reporter-1',
      dob: '15/05/1988',
      contact: '+91 98765 43210',
      officeLocation: 'Mumbai Bureau',
      verified: true,
    },
    {
      id: 'priya-patel',
      name: 'Priya Patel',
      title: 'Technology Editor',
      imageId: 'reporter-2',
      dob: '22/09/1992',
      contact: '+91 98765 43211',
      officeLocation: 'Bengaluru Bureau',
      verified: true,
    },
    {
      id: 'rohan-mehta',
      name: 'Rohan Mehta',
      title: 'Sports Journalist',
      imageId: 'reporter-3',
      dob: '11/02/1995',
      contact: '+91 98765 43212',
      officeLocation: 'Delhi Bureau',
      verified: false,
    },
    {
      id: 'isha-singh',
      name: 'Isha Singh',
      title: 'Investigative Reporter',
      imageId: 'reporter-4',
      dob: '30/07/1990',
      contact: '+91 98765 43213',
      officeLocation: 'Headquarters',
      verified: true,
    },
  ];

export const placeholderDonations: Donation[] = [
  { id: 'don-1', donorName: 'Rajesh Kumar', amount: 5000, currency: 'INR', date: '2024-07-28', type: 'One-time', status: 'Completed' },
  { id: 'don-2', donorName: 'Anita Desai', amount: 100, currency: 'USD', date: '2024-07-27', type: 'Recurring', status: 'Completed' },
  { id: 'don-3', donorName: 'Vikram Singh', amount: 2500, currency: 'INR', date: '2024-07-27', type: 'One-time', status: 'Pending' },
  { id: 'don-4', donorName: 'John Smith', amount: 50, currency: 'USD', date: '2024-07-26', type: 'One-time', status: 'Completed' },
  { id: 'don-5', donorName: 'Meera Iyer', amount: 10000, currency: 'INR', date: '2024-07-25', type: 'One-time', status: 'Failed' },
];

export const rssFeeds = {
  "From The Wire": [
      { title: "Global Markets React to New Policies", link: "#"},
      { title: "The Future of Renewable Energy", link: "#"},
      { title: "A Deep Dive into Modern Cinema", link: "#"},
  ],
  "Hindustan Times": [
      { title: "Monsoon Session of Parliament Begins", link: "#"},
      { title: "Startup Ecosystem Sees Record Funding", link: "#"},
      { title: "New Metro Line to Open Next Month", link: "#"},
  ],
};

    