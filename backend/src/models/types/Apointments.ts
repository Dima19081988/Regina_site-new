export interface Appointment {
    id: number;
    client_name: string;
    service: string;
    appointment_time: string;
    status: 'pending' | 'confirmed' | 'cancelled'
    price: number | null;
    created_at: string;
}