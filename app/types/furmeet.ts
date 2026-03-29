export type Furmeet = {
  id: number;
  title: string;
  description: string;
  content: string;
  date: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FurmeetCard = {
  id: string;
  title: string;
  description: string;
  date: string;
  imageURL?: string;
};
