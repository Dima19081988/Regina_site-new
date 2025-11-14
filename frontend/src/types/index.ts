export interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  created_at: string;
}