export type FurmeetEventType = "MEET" | "OTHER";
export type FurmeetActivityType = "ACTIVITY" | "RESTAURANT" | "BAR" | "OTHER";

export type FurmeetActivity = {
  id?: string;
  order?: number;
  type?: FurmeetActivityType;
  date: string;
  title: string;
  description: string;
};

export type Furmeet = {
  id: string;
  title: string;
  description: string;
  type?: FurmeetEventType;
  eventDate: string | null;
  published: boolean;
  opened?: boolean;
  createdAt: string;
  updatedAt: string;
  eventActivities?: FurmeetActivity[];
};

export type FurmeetCard = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  imageURL?: string;
};
