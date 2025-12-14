
import type { Reporter, Donation } from '@/lib/definitions';

// Simplified Article type for placeholder
export type PlaceholderArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  publicationDate: string;
  imageUrl: string;
};


export const placeholderArticles: PlaceholderArticle[] = [
  {
    id: '1',
    slug: 'major-political-summit-concludes-with-historic-agreement',
    title: 'Major Political Summit Concludes with Historic Agreement',
    excerpt: 'World leaders have signed a landmark agreement on climate change and trade, marking a new era of global cooperation.',
    author: 'Aarav Sharma',
    category: 'Politics',
    publicationDate: '2024-07-28',
    imageUrl: 'https://images.unsplash.com/photo-1678211626563-21f0c0751dc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwb2xpdGljcyUyMGNpdHl8ZW58MHx8fHwxNzY1NTU3NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    slug: 'tech-giant-unveils-revolutionary-ai-chip',
    title: 'Tech Giant Unveils Revolutionary AI Chip',
    excerpt: 'The new "QuantumCore" chip promises to be 1000x faster than current generation processors, enabling real-time complex AI.',
    author: 'Priya Patel',
    category: 'Technology',
    publicationDate: '2024-07-27',
    imageUrl: 'https://images.unsplash.com/photo-1613575998061-0f59337425f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx0ZWNobm9sb2d5JTIwYnVzaW5lc3N8ZW58MHx8fHwxNzY1NDc4Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
    {
    id: '3',
    slug: 'national-cricket-team-wins-world-championship',
    title: 'National Cricket Team Wins World Championship in Thriller Final',
    excerpt: 'A last-ball six secured a dramatic victory against arch-rivals, bringing the trophy home after 12 years.',
    author: 'Rohan Mehta',
    category: 'Sports',
    publicationDate: '2024-07-26',
    imageUrl: 'https://images.unsplash.com/photo-1480180566821-a7d525cdfc5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzcG9ydHMlMjBzdGFkaXVtfGVufDB8fHx8MTc2NTQ5ODE3MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    slug: 'archaeologists-uncover-lost-city-in-dense-jungle',
    title: 'Archaeologists Uncover Lost City in Dense Jungle',
    excerpt: 'The newly discovered city, believed to be over 2000 years old, could rewrite the history of the region.',
    author: 'Isha Singh',
    category: 'World',
    publicationDate: '2024-07-25',
    imageUrl: 'https://images.unsplash.com/photo-1503221043305-f7498f8b7888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3b3JsZCUyMHRyYXZlbHxlbnwwfHx8fDE3NjU1NTc2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '5',
    slug: 'local-food-festival-celebrates-cultural-diversity',
    title: 'Local Food Festival Celebrates Cultural Diversity',
    excerpt: 'Thousands gather to sample cuisines from around the world, showcasing the city\'s vibrant multicultural community.',
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
