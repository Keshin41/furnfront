export type UserProfile = {
  id: string;
  firstname: string;
  lastname: string;
  nickname: string;
  email: string;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
};