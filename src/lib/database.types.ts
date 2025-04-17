export interface Profile {
  id: string;
  role: 'camper' | 'parent' | 'admin';
  full_name: string;
  date_of_birth?: string | null;
  created_at?: string;
  updated_at?: string;
}