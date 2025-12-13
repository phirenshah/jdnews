export type Article = {
  id: string;
  slug: string;
  titleEnglish: string;
  titleGujarati: string;
  excerptEnglish: string;
  excerptGujarati: string;
  contentEnglish: string;
  contentGujarati: string;
  authorId: string;
  author: string;
  category: string;
  publicationDate: any;
  imageUrl: string;
};

export type Reporter = {
  id: string;
  name: string;
  title: string;
  imageId?: string; // Made optional as it might not always be there
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

    