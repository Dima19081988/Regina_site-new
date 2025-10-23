import { QueryResult } from "pg";
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

export const getAppointmentById = async (id: number) : Promise<Appointment | null> => {
    const result = await db.query('SELECT * FROM appointments WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const updateAppointment = async (
    id: number,
    data: Pick<Appointment, 'client_name' | 'service' | 'appointment_time' | 'price'>
) : Promise<Appointment | null> => {
    const { client_name, service, appointment_time, price } = data;
    const result = await db.query(
        `UPDATE appointments
        SET client_name = $1, service = $2, appointment_time = $3, price = $4
        WHERE id = $5
        RETURNING *`,
        [client_name, service, appointment_time, price, id]
    );
    return result.rows[0] || null;
};

export const deleteAppointment = async (id: number): Promise<boolean> => {
    const result = await db.query('DELETE FROM appointments WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
};