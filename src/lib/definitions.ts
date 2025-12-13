export type Article = {
  title: string;
  slug: string;
  content: string;
  category: string;
  lang: string;
  coverImage: string;
  authorName: string;
  authorId: string;
  published: boolean;
  featured: boolean;
  createdAt: any; // Firestore Timestamp
};

export type Reporter = {
  id: string;
  name: string;
  title: string;
  imageId?: string;
  dob: string;
  contact: string;
  officeLocation: string;
  verified: boolean;
  profilePictureUrl?: string;
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

export type ImagePlaceholder = {
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
};

export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'member' | 'reporter' | 'editor' | 'director';
    profilePictureUrl?: string;
};
