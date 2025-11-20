import { db } from "../config/db";
import { Appointment } from "../models/types/Apointments";

export const getAllAppointments = async (): Promise<Appointment[]> => {
    const result = await db.query('SELECT * FROM appointments ORDER BY appointment_time ASC');
    return result.rows;
};

export const createAppointment = async (
    data: Pick<Appointment, 'client_name' | 'service' | 'appointment_time' | 'price'>
): Promise<Appointment> => {
    const { client_name, service, appointment_time, price } = data;
    const result = await db.query(
        `INSERT INTO appointments (client_name, service, appointment_time, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [client_name, service, appointment_time, price]
    );

    return result.rows[0];
};

export const getAppointmentById = async (id: number): Promise<Appointment | null> => {
    const result = await db.query('SELECT * FROM appointments WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const getAllAppointmentByDate = async (date: string): Promise<Appointment[]> => {
    const result = await db.query(`
        SELECT * FROM appointments
        WHERE appointment_time::date = $1
        ORDER BY appointment_time ASC`,
        [date]
    );
    return result.rows;
};

export const getAppointmentCountsByMonth = async (year: number, month: number): Promise<Record<string, number>> => {
    const result = await db.query(
        `SELECT
            appointment_time::date AS day,
            COUNT(*)::int AS count
        FROM appointments
        WHERE EXTRACT(YEAR FROM appointment_time) = $1
          AND EXTRACT(MONTH FROM appointment_time) = $2
        GROUP BY day
        ORDER BY day`,
        [year, month]
    );

    const counts: Record<string, number> = {};
    for (const row of result.rows) {
        const dayStr = row.day.toISOString().split('T')[0];
        counts[dayStr] = row.count;
        console.log('Row:', row);
    }
    return counts;
};

export const updateAppointment = async (
    id: number,
    data: Partial<Pick<Appointment, 'client_name' | 'service' | 'appointment_time' | 'price'>>
): Promise<Appointment | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.client_name != undefined) {
        fields.push(`client_name = $${paramIndex}`);
        values.push(data.client_name);
        paramIndex ++;
    }

    if (data.service != undefined) {
        fields.push(`service = $${paramIndex}`);
        values.push(data.service);
        paramIndex ++;
    }

    if (data.appointment_time != undefined) {
        fields.push(`appointment_time = $${paramIndex}`);
        values.push(data.appointment_time);
        paramIndex ++;
    }

    if (data.price != undefined) {
        fields.push(`price = $${paramIndex}`);
        values.push(data.price);
        paramIndex ++;
    }

    if (fields.length === 0) {
        throw new Error('Нет полей для update Appointment');
    }

    values.push(id);
    const queryText = 
        `UPDATE appointments
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *`;

    const result = await db.query(queryText, values);
    return result.rows[0] || null;
};

export const deleteAppointment = async (id: number): Promise<boolean> => {
    const result = await db.query('DELETE FROM appointments WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
};