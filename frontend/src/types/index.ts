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