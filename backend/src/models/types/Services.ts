export interface Service {
  id: number;
  slug: string;
  title: string;
  short_description: string | null;
  long_description: string | null;
  base_price: number | null;
  price_note: string | null;
  image_url: string | null;
  category_id: number | null;
  created_at: string;
}