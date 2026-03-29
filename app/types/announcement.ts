export type Announcement = {
  id: string;
  title: string;
  message: string;
  active: boolean;
  actionLabel?: string;
  actionUrl?: string;
};