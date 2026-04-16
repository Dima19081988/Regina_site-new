export interface Appointment {
  id: number;
  client_name: string | null;
  service: string;
  service_id: number | null;
  appointment_time: string;
  price: number | null;
  created_at: string;
}
