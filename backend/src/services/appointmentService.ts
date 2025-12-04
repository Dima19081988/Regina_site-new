import { db } from '../config/db';
import { Appointment } from '../models/types/Apointments';

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
  const result = await db.query(
    `
        SELECT * FROM appointments
        WHERE appointment_time::date = $1
        ORDER BY appointment_time ASC`,
    [date]
  );
  return result.rows;
};

export const getAppointmentCountsByMonth = async (
  year: number,
  month: number
): Promise<Record<string, number>> => {
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
    paramIndex++;
  }

  if (data.service != undefined) {
    fields.push(`service = $${paramIndex}`);
    values.push(data.service);
    paramIndex++;
  }

  if (data.appointment_time != undefined) {
    fields.push(`appointment_time = $${paramIndex}`);
    values.push(data.appointment_time);
    paramIndex++;
  }

  if (data.price != undefined) {
    fields.push(`price = $${paramIndex}`);
    values.push(data.price);
    paramIndex++;
  }

  if (fields.length === 0) {
    throw new Error('Нет полей для update Appointment');
  }

  values.push(id);
  const queryText = `UPDATE appointments
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

// import { getYdbSession } from '../config/ydb-client';
// import { Appointment } from '../models/types/Apointments';

// // Вспомогательная функция: преобразовать YDB-строку в JS-объект
// const mapRowToAppointment = (row: any): Appointment => ({
//   id: row.id.toNumber(),
//   client_name: row.client_name?.toString() || '',
//   service: row.service?.toString() || '',
//   appointment_time: row.appointment_time?.toDate(),
//   price: row.price != null ? Number(row.price) : null,
//   created_at: row.created_at?.toDate(),
// });

// export const getAllAppointments = async (): Promise<Appointment[]> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     'SELECT * FROM appointments ORDER BY appointment_time ASC',
//     []
//   );
//   await session.delete();

//   return result.resultSets[0].rows.map(mapRowToAppointment);
// };

// export const createAppointment = async (
//   data: Pick<Appointment, 'client_name' | 'service' | 'appointment_time' | 'price'>
// ): Promise<Appointment> => {
//   const { client_name, service, appointment_time, price } = data;
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     `INSERT INTO appointments (client_name, service, appointment_time, price)
//      VALUES ($1, $2, $3, $4)
//      RETURNING *`,
//     [client_name, service, appointment_time, price]
//   );
//   await session.delete();

//   return mapRowToAppointment(result.resultSets[0].rows[0]);
// };

// export const getAppointmentById = async (id: number): Promise<Appointment | null> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     'SELECT * FROM appointments WHERE id = $1',
//     [id]
//   );
//   await session.delete();

//   const rows = result.resultSets[0].rows;
//   return rows.length > 0 ? mapRowToAppointment(rows[0]) : null;
// };

// export const getAllAppointmentByDate = async (date: string): Promise<Appointment[]> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     `SELECT * FROM appointments
//      WHERE CAST(appointment_time AS DATE) = CAST($1 AS DATE)
//      ORDER BY appointment_time ASC`,
//     [date]
//   );
//   await session.delete();

//   return result.resultSets[0].rows.map(mapRowToAppointment);
// };

// export const getAppointmentCountsByMonth = async (
//   year: number,
//   month: number
// ): Promise<Record<string, number>> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     `SELECT
//         CAST(appointment_time AS DATE) AS day,
//         COUNT(*) AS count
//       FROM appointments
//       WHERE EXTRACT(YEAR FROM appointment_time) = $1
//         AND EXTRACT(MONTH FROM appointment_time) = $2
//       GROUP BY day
//       ORDER BY day`,
//     [year, month]
//   );
//   await session.delete();

//   const counts: Record<string, number> = {};
//   for (const row of result.resultSets[0].rows) {
//     const day = row.day?.toDate();
//     if (day) {
//       const dayStr = day.toISOString().split('T')[0];
//       counts[dayStr] = Number(row.count);
//     }
//   }
//   return counts;
// };

// export const updateAppointment = async (
//   id: number,
//   data: Partial<Pick<Appointment, 'client_name' | 'service' | 'appointment_time' | 'price'>>
// ): Promise<Appointment | null> => {
//   const fields: string[] = [];
//   const values: any[] = [];
//   let paramIndex = 1;

//   if (data.client_name !== undefined) {
//     fields.push(`client_name = $${paramIndex}`);
//     values.push(data.client_name);
//     paramIndex++;
//   }
//   if (data.service !== undefined) {
//     fields.push(`service = $${paramIndex}`);
//     values.push(data.service);
//     paramIndex++;
//   }
//   if (data.appointment_time !== undefined) {
//     fields.push(`appointment_time = $${paramIndex}`);
//     values.push(data.appointment_time);
//     paramIndex++;
//   }
//   if (data.price !== undefined) {
//     fields.push(`price = $${paramIndex}`);
//     values.push(data.price);
//     paramIndex++;
//   }

//   if (fields.length === 0) {
//     throw new Error('Нет полей для update Appointment');
//   }

//   values.push(id);
//   const queryText = `
//     UPDATE appointments
//     SET ${fields.join(', ')}
//     WHERE id = $${paramIndex}
//     RETURNING *
//   `;

//   const session = await getYdbSession();
//   const result = await session.executeQuery(queryText, values);
//   await session.delete();

//   const rows = result.resultSets[0].rows;
//   return rows.length > 0 ? mapRowToAppointment(rows[0]) : null;
// };

// export const deleteAppointment = async (id: number): Promise<boolean> => {
//   const session = await getYdbSession();
//   // YDB не возвращает rowCount, поэтому сначала проверим, существует ли запись
//   const check = await session.executeQuery(
//     'SELECT 1 FROM appointments WHERE id = $1',
//     [id]
//   );
//   const exists = check.resultSets[0].rows.length > 0;

//   if (exists) {
//     await session.executeQuery('DELETE FROM appointments WHERE id = $1', [id]);
//   }
//   await session.delete();

//   return exists;
// };
