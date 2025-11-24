export interface Portfolio {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  file_hash: string | null;
  created_at: string;
}
