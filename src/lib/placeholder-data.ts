
import type { Article, Reporter, Donation } from '@/lib/definitions';

export const placeholderArticles: Omit<Article, 'authorId' | 'contentEnglish' | 'contentGujarati'>[] = [
  {
    id: '1',
    slug: 'major-political-summit-concludes-with-historic-agreement',
    titleEnglish: 'Major Political Summit Concludes with Historic Agreement',
    titleGujarati: 'મુખ્ય રાજકીય શિખર સંમેલન ઐતિહાસિક સમજૂતી સાથે સમાપ્ત થયું',
    excerptEnglish: 'World leaders have signed a landmark agreement on climate change and trade, marking a new era of global cooperation.',
    excerptGujarati: 'વિશ્વના નેતાઓએ આબોહવા પરિવર્તન અને વેપાર પર એક સીમાચિહ્નરૂપ કરાર પર હસ્તાક્ષર કર્યા છે, જે વૈશ્વિક સહયોગના નવા યુગની નિશાની છે.',
    author: 'Aarav Sharma',
    category: 'Politics',
    publicationDate: '2024-07-28',
    imageUrl: 'https://images.unsplash.com/photo-1678211626563-21f0c0751dc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwb2xpdGljcyUyMGNpdHl8ZW58MHx8fHwxNzY1NTU3NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    slug: 'tech-giant-unveils-revolutionary-ai-chip',
    titleEnglish: 'Tech Giant Unveils Revolutionary AI Chip',
    titleGujarati: 'ટેક જાયન્ટે ક્રાંતિકારી AI ચિપનું અનાવરણ કર્યું',
    excerptEnglish: 'The new "QuantumCore" chip promises to be 1000x faster than current generation processors, enabling real-time complex AI.',
    excerptGujarati: 'નવી "ક્વોન્ટમકોર" ચિપ વર્તમાન પેઢીના પ્રોસેસરો કરતાં 1000x વધુ ઝડપી હોવાનું વચન આપે છે, જે રીઅલ-ટાઇમ જટિલ AI ને સક્ષમ બનાવે છે.',
    author: 'Priya Patel',
    category: 'Technology',
    publicationDate: '2024-07-27',
    imageUrl: 'https://images.unsplash.com/photo-1613575998061-0f59337425f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx0ZWNobm9sb2d5JTIwYnVzaW5lc3N8ZW58MHx8fHwxNzY1NDc4Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
    {
    id: '3',
    slug: 'national-cricket-team-wins-world-championship',
    titleEnglish: 'National Cricket Team Wins World Championship in Thriller Final',
    titleGujarati: 'રાષ્ટ્રીય ક્રિકેટ ટીમે રોમાંચક ફાઇનલમાં વર્લ્ડ ચેમ્પિયનશિપ જીતી',
    excerptEnglish: 'A last-ball six secured a dramatic victory against arch-rivals, bringing the trophy home after 12 years.',
    excerptGujarati: 'છેલ્લા બોલ પર છગ્ગાએ કટ્ટર હરીફો સામે નાટકીય વિજય સુનિશ્ચિત કર્યો, 12 વર્ષ પછી ટ્રોફી ઘરે લાવી.',
    author: 'Rohan Mehta',
    category: 'Sports',
    publicationDate: '2024-07-26',
    imageUrl: 'https://images.unsplash.com/photo-1480180566821-a7d525cdfc5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzcG9ydHMlMjBzdGFkaXVtfGVufDB8fHx8MTc2NTQ5ODE3MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    slug: 'archaeologists-uncover-lost-city-in-dense-jungle',
    titleEnglish: 'Archaeologists Uncover Lost City in Dense Jungle',
    titleGujarati: 'પુરાતત્વવિદોએ ગાઢ જંગલમાં ખોવાયેલું શહેર શોધી કાઢ્યું',
    excerptEnglish: 'The newly discovered city, believed to be over 2000 years old, could rewrite the history of the region.',
    excerptGujarati: 'નવું શોધાયેલું શહેર, જે 2000 વર્ષથી વધુ જૂનું હોવાનું માનવામાં આવે છે, તે આ પ્રદેશના ઇતિહાસને ફરીથી લખી શકે છે.',
    author: 'Isha Singh',
    category: 'World',
    publicationDate: '2024-07-25',
    imageUrl: 'https://images.unsplash.com/photo-1503221043305-f7498f8b7888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3b3JsZCUyMHRyYXZlbHxlbnwwfHx8fDE3NjU1NTc2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '5',
    slug: 'local-food-festival-celebrates-cultural-diversity',
    titleEnglish: 'Local Food Festival Celebrates Cultural Diversity',
    titleGujarati: 'સ્થાનિક ફૂડ ફેસ્ટિવલ સાંસ્કૃતિક વિવિધતાની ઉજવણી કરે છે',
    excerptEnglish: 'Thousands gather to sample cuisines from around the world, showcasing the city\'s vibrant multicultural community.',
    excerptGujarati: 'હજારો લોકો વિશ્વભરના વ્યંજનોનો સ્વાદ માણવા માટે ભેગા થાય છે, જે શહેરના જીવંત બહુસાંસ્કૃતિક સમુદાયને પ્રદર્શિત કરે છે.',
    author: 'Aarav Sharma',
    category: 'Entertainment',
    publicationDate: '2024-07-24',
    imageUrl: 'https://images.unsplash.com/photo-1764456247666-0012c5f0bd48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjdWx0dXJlJTIwZXZlbnR8ZW58MHx8fHwxNzY1NTU3NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  }
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

    