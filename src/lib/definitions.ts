export type Article = {
  id: string;
  slug: string;
  title: {
    en: string;
    gu: string;
  };
  excerpt: {
    en: string;
gu: string;
  };
  content: {
    en: string;
    gu: string;
  };
  author: string;
  category: string;
  publishedAt: string;
  imageId: string;
};

export type Reporter = {
  id: string;
  name: string;
  title: string;
  imageId: string;
  dob: string;
  contact: string;
  officeLocation: string;
  verified: boolean;
};

export type Donation = {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  date: string;
  type: 'One-time' | 'Recurring';
  status: 'Completed' | 'Pending' | 'Failed';
};
