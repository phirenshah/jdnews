
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

export const fullPlaceholderArticles = [
    {
        slug: 'major-political-summit-concludes-with-historic-agreement',
        contentEnglish: 'In a significant development, world leaders gathered at the global summit have officially signed a landmark pact aimed at tackling climate change and reforming international trade policies. The agreement, which came after days of intense negotiations, is being hailed as a monumental step towards a more sustainable and cooperative global future. Key provisions include stricter emissions targets, a multi-billion dollar fund to support developing nations in their green transition, and the removal of several long-standing trade barriers. Analysts believe this could usher in a new era of global diplomacy and economic stability.',
        contentGujarati: 'એક મહત્વપૂર્ણ વિકાસમાં, વૈશ્વિક શિખર સંમેલનમાં ભેગા થયેલા વિશ્વ નેતાઓએ આબોહવા પરિવર્તનનો સામનો કરવા અને આંતરરાષ્ટ્રીય વેપાર નીતિઓમાં સુધારો કરવાના ઉદ્દેશ્યથી એક સીમાચિહ્નરૂપ કરાર પર સત્તાવાર રીતે હસ્તાક્ષર કર્યા છે. કેટલાય દિવસોની તીવ્ર વાટાઘાટો પછી આવેલી આ સમજૂતીને વધુ ટકાઉ અને સહકારી વૈશ્વિક ભવિષ્ય તરફના એક સ્મારક પગલા તરીકે બિરદાવવામાં આવી રહી છે. મુખ્ય જોગવાઈઓમાં કડક ઉત્સર્જન લક્ષ્યો, વિકાસશીલ રાષ્ટ્રોને તેમના હરિયાળા સંક્રમણમાં ટેકો આપવા માટેનું બહુ-અબજ ડોલરનું ભંડોળ અને કેટલાય લાંબા સમયથી ચાલતા વેપાર અવરોધોને દૂર કરવાનો સમાવેશ થાય છે. વિશ્લેષકો માને છે કે આ વૈશ્વિક કૂટનીતિ અને આર્થિક સ્થિરતાના નવા યુગની શરૂઆત કરી શકે છે.',
    },
    {
        slug: 'tech-giant-unveils-revolutionary-ai-chip',
        contentEnglish: 'The technology world is buzzing with the announcement of the "QuantumCore" AI chip. Developed in secrecy over five years, the chip utilizes novel quantum-inspired architecture to achieve processing speeds previously thought to be theoretical. During a live demonstration, the chip outperformed the leading supercomputer in a complex protein-folding simulation by a factor of over 1000. The company stated that QuantumCore will initially be available to research institutions to accelerate scientific discovery, with a consumer-grade version planned for release within the next three years, potentially revolutionizing everything from personal computing to autonomous vehicles.',
        contentGujarati: 'ટેકનોલોજીની દુનિયા "ક્વોન્ટમકોર" AI ચિપની જાહેરાતથી ગુંજી રહી છે. પાંચ વર્ષથી ગુપ્ત રીતે વિકસાવવામાં આવેલી આ ચિપ, પ્રوسેસિંગ ગતિ પ્રાપ્ત કરવા માટે નવલકથા ક્વોન્ટમ-પ્રેરિત આર્કિટેક્ચરનો ઉપયોગ કરે છે જે અગાઉ સૈદ્ધાંતિક માનવામાં આવતી હતી. જીવંત પ્રદર્શન દરમિયાન, ચિપે એક જટિલ પ્રોટીન-ફોल्डिंग સિમ્યુલેશનમાં અગ્રણી સુપર કોમ્પ્યુટરને 1000 થી વધુના પરિબળથી પાછળ છોડી દીધું. કંપનીએ જણાવ્યું હતું કે ક્વોન્ટમકોર શરૂઆતમાં વૈજ્ઞાનિક શોધને વેગ આપવા માટે સંશોધન સંસ્થાઓ માટે ઉપલબ્ધ થશે, આગામી ત્રણ વર્ષમાં ઉપભોક્તા-ગ્રેડ સંસ્કરણ બહાર પાડવાની યોજના છે, જે પર્સનલ કમ્પ્યુટિંગથી લઈને સ્વાયત્ત વાહનો સુધીની દરેક બાબતમાં ક્રાંતિ લાવી શકે છે.',
    },
    {
        slug: 'national-cricket-team-wins-world-championship',
        contentEnglish: 'The nation erupted in celebration tonight as the national cricket team clinched the World Championship title in a nail-biting final against their fiercest rivals. Chasing a formidable target of 288, the team found themselves needing 15 runs off the final over. It all came down to the last ball, with 4 runs required to win. The star batsman, previously struggling for form, smashed a towering six over long-on, sealing a historic victory and ending a 12-year drought for the coveted trophy. Fireworks lit up the sky in major cities as fans poured into the streets to celebrate the dramatic win.',
        contentGujarati: 'આજે રાત્રે રાષ્ટ્રીય ક્રિકેટ ટીમે તેમના સૌથી કટ્ટર હરીફો સામેની રોમાંચક ફાઇનલમાં વર્લ્ડ ચેમ્પિયનશિપનો ખિતાબ જીતી લેતા સમગ્ર દેશ ઉજવણીમાં ડૂબી ગયો હતો. 288 ના મુશ્કેલ લક્ષ્યનો પીછો કરતા, ટીમને અંતિમ ઓવરમાં 15 રનની જરૂર હતી. બધું છેલ્લા બોલ પર આવી ગયું, જેમાં જીતવા માટે 4 રનની જરૂર હતી. અગાઉ ફોર્મ માટે સંઘર્ષ કરી રહેલા સ્ટાર બેટ્સમેને લોંગ-ઓન પર એક ઊંચો છગ્ગો ફટકારીને ઐતિહાસિક વિજય સુનિશ્ચિત કર્યો અને પ્રતિષ્ઠિત ટ્રોફી માટેના 12 વર્ષના દુકાળનો અંત આણ્યો. નાટકીય જીતની ઉજવણી કરવા માટે ચાહકો શેરીઓમાં ઉમટી પડતાં મુખ્ય શહેરોમાં આકાશ આતશબાજીથી ઝળહળી ઉઠ્યું હતું.',
    },
    {
        slug: 'archaeologists-uncover-lost-city-in-dense-jungle',
        contentEnglish: 'A team of international archaeologists has made a groundbreaking discovery deep within the Amazon rainforest, uncovering the ruins of a sprawling ancient city. Using advanced LiDAR technology to map the terrain beneath the dense jungle canopy, the team identified a vast network of pyramids, plazas, and residential complexes connected by a sophisticated system of causeways. Initial estimates suggest the city was inhabited from 500 BC to 1000 AD and may have supported a population of over 100,000 people. "This changes everything we thought we knew about pre-Columbian civilizations in this region," stated the lead archaeologist. "We are looking at a highly organized, urban society that thrived in the heart of the jungle for centuries."',
        contentGujarati: 'આંતરરાષ્ટ્રીય પુરાતत्वविદોની એક ટીમે એમેઝોન वर्षावनની ઊંડાઈમાં एक अभूतपूर्व શોધ કરી છે, જેમાં એક વિસ્તൃത પ્રાચીન શહેરના ખંડેરોનો પર્દાફાશ થયો છે. ગાઢ જંગલની છتری નીચે ભૂપ્રદેશનો નકશો બનાવવા માટે અદ્યતન LiDAR ટેકનોલોજીનો ઉપયોગ કરીને, ટીમે પિરાमिડો, પ્લાઝાઓ અને રહેણાંક સંકુલોના વિશાળ નેટવર્કને ઓળખી કાઢ્યું જે કોઝવેની એક అధునాతన પ્રણાલી દ્વારા જોડાયેલું હતું. પ્રારંભિક અંદાજો સૂચવે છે કે આ શહેર 500 BC થી 1000 AD સુધી વસવાટ કરતું હતું અને 100,000 થી વધુ લોકોની વસ્તીને ટેકો આપી શક્યું હોત. "આ આ પ્રદેશમાં પૂર્વ-કોલમ્બિયન સંસ્કૃતિઓ વિશે આપણે જે વિચાર્યું હતું તે બધું બદલી નાખે છે," મુખ્ય પુરાતત્વविદે જણાવ્યું. "અમે એક અત્યંત સંગઠિત, શહેરી સમાજને જોઈ રહ્યા છીએ જે સદીઓથી જંગલના હૃદયમાં વિકસ્યો હતો."',
    },
    {
        slug: 'local-food-festival-celebrates-cultural-diversity',
        contentEnglish: 'The annual City Food Festival drew record crowds over the weekend, transforming the downtown park into a global culinary village. Over 150 vendors representing more than 50 countries offered a dizzying array of dishes, from spicy Thai curries to savory Argentine empanadas. The event not only provided a feast for the senses but also a platform for cultural exchange, with traditional music and dance performances taking place throughout the day. "Food is a universal language," said the event organizer. "It brings people together and helps us celebrate the beautiful mosaic of cultures that makes our city so special."',
        contentGujarati: 'વાર્ષિક સિટી ફૂડ ફેસ્ટિવલે સપ્તાહના અંતે રેકોર્ડ ભીડ ખેંચੀ, ડાઉનટાઉન પાર્કને વૈશ્વिक पाक ગામમાં ફેરવી દીધું. 50 થી વધુ દેશોનું પ્રતિનિધિત્વ કરતા 150 થી વધુ વિક્રેતાઓએ મસાલેदार થાઈ કરીથી લઈને સ્વાદિષ્ટ આર્જેન્ટિનાના એમ્पानाडा સુધીની વાનગીઓની એક ચક્કર લગાવणारी શ્રેણી ઓફર કરી. આ કાર્યક્રમે માત્ર ઇન્દ્રિયો માટે જ તહેવાર પૂરો પાડ્યો ન હતો, પરંતુ સાંસ્કૃતિક આદાનપ્રदान માટેનું एक મંચ પણ પૂરું પાડ્યું હતું, જેમાં દિવસભર પરંપરાગત સંગીत અને નૃત્ય પ્રదర్శનો યોજાયા હતા. "ખોરાક એક સાર્વત્રિક ભાષા છે," ઇવેન્ટ આયોજકે કહ્યું. "તે લોકોને એકસાથે લાવે છે અને આપણને તે સુંદર સાંસ્કૃતિક મોઝેકની ઉજવણી કરવામાં મદદ કરે છે જે આપણા શહેરને इतना खास બનાવે છે."',
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
      profilePictureUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjU0NTgyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
      profilePictureUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjU0NTgyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
      profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjU0NTgyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
      profilePictureUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjU0NTgyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
