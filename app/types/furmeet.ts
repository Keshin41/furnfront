export type FurmeetEventType = 'MEET' | 'OTHER';
export type FurmeetActivityType = 'ACTIVITY' | 'RESTAURANT' | 'BAR' | 'OTHER';

export type FurmeetActivity = {
  id: string;
  order: number;
  type: FurmeetActivityType;
  date: string;
  title: string;
  description: string;
  activityQuestions?: FurmeetActivityQuestion[];
};

export type FurmeetActivityQuestion = {
  id: string;
  label: string;
  order?: number;
  type: FurmeetFieldType;
  required: boolean;
  choices?: FieldOption[];
};

export type FurmeetFieldType = 'TEXT' | 'NUMBER' | 'SELECT' | 'CHECKBOX' | 'RADIO';

export type FieldOption = {
  id: string;
  label: string;
  value: string;
};

export type MeetActivityQuestionUpsertPayload = {
  label: string;
  order?: number;
  type: FurmeetFieldType;
  required: boolean;
  choices?: FieldOption[];
};

export type Furmeet = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  type?: FurmeetEventType;
  eventDate: string | null;
  published: boolean;
  opened?: boolean;
  createdAt: string;
  updatedAt: string;
  eventActivities?: FurmeetActivity[];
  hasAttachedForm: boolean;
};

export type FurmeetResponse = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  type: FurmeetEventType;
  published: boolean;
  opened: boolean;
  createdAt: Date;
  updatedAt: Date;
  eventDate: Date | null;
  eventActivities: FurmeetActivity[];
};

export type FurmeetCard = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  imageURL?: string;
};

export type MeetActivityUpsertPayload = {
  title: string;
  description?: string;
  date: string;
  order?: number;
  type: FurmeetActivityType;
  activityQuestions?: MeetActivityQuestionUpsertPayload[];
};

export type MeetUpsertPayload = {
  title: string;
  description?: string;
  imageUrl?: string;
  published: boolean;
  opened: boolean;
  eventActivities: MeetActivityUpsertPayload[];
};
