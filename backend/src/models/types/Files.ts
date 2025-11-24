export interface FileItem {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  created_at: string;
}
