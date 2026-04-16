export interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  created_at: string;
}

export interface Appointment {
  id: number;
  client_name: string;
  service: string;
  service_id: number | null;
  appointment_time: string;
  price: number | null;
  created_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string | null;
  created_at: string;
}

export interface FileItem {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

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

export interface ServicePayload {
  slug: string;
  title: string;
  short_description?: string | null;
  long_description?: string | null;
  base_price?: number | null;
  price_note?: string | null;
  image_url?: string | null;
  category_id?: number | null;
}

export interface Article {
  title: string;
  teaser: string;
  content: string;
  slug: string;
}