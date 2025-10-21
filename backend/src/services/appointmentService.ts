import { db } from "../config/db";
import { Appointment } from "../models/types/Apointments";

export const getAllAppointments = async () : Promise<Appointment[]> => {
    const result = await db.query('SELECT * FROM appointments ORDER BY appointment_time ASC');
    return result.rows
};

export const createAppointment = async (
    data: Pick<Appointment, 'client_name' | 'service' | 'appointment_time' | 'price'>
) : Promise<Appointment> => {
    const { client_name, service, appointment_time, price } = data;

    const result = await db.query(
        `INSERT INTO appointments (client_name, service, appointment_time, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [client_name, service, appointment_time, price]
    );

    return result.rows[0];
};