import { db } from '../config/db';
import { Note } from '../models/types/Notes';

export const getAllNotes = async (): Promise<Note[]> => {
  const result = await db.query('SELECT * FROM notes ORDER BY created_at DESC');
  return result.rows;
};

export const createNote = async (data: Pick<Note, 'title' | 'content'>): Promise<Note> => {
  const { title, content } = data;
  const result = await db.query(
    `INSERT INTO notes (title, content)
        VALUES ($1, $2)
        RETURNING *`,
    [title, content]
  );

  return result.rows[0];
};

export const getNoteById = async (id: number): Promise<Note | null> => {
  const result = await db.query('SELECT * FROM notes WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updateNote = async (
  id: number,
  data: Partial<Pick<Note, 'title' | 'content'>>
): Promise<Note | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.title != undefined) {
    fields.push(`title = $${paramIndex}`);
    values.push(data.title);
    paramIndex++;
  }

  if (data.content != undefined) {
    fields.push(`content = $${paramIndex}`);
    values.push(data.content);
    paramIndex++;
  }

  if (fields.length === 0) {
    throw new Error('Нет полей для update Note');
  }

  values.push(id);

  const queryText = `UPDATE notes
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *`;

  const result = await db.query(queryText, values);
  return result.rows[0] || null;
};

export const deleteNote = async (id: number): Promise<boolean> => {
  const result = await db.query('DELETE FROM notes WHERE id = $1', [id]);
  return (result.rowCount || 0) > 0;
};

// import { getYdbSession } from '../config/ydb-client';
// import { Note } from '../models/types/Notes';

// // Вспомогательная функция: преобразовать строку YDB в Note
// const mapRowToNote = (row: any): Note => ({
//   id: row.id.toNumber(),
//   title: row.title?.toString() || '',
//   content: row.content?.toString() || null,
//   created_at: row.created_at?.toDate(),
// });

// export const getAllNotes = async (): Promise<Note[]> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     'SELECT * FROM notes ORDER BY created_at DESC',
//     []
//   );
//   await session.delete();

//   return result.resultSets[0].rows.map(mapRowToNote);
// };

// export const createNote = async (
//   data: Pick<Note, 'title' | 'content'> // ✅ добавлено имя параметра `data`
// ): Promise<Note> => {
//   const { title, content } = data;
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     `INSERT INTO notes (title, content)
//      VALUES ($1, $2)
//      RETURNING *`,
//     [title, content]
//   );
//   await session.delete();

//   return mapRowToNote(result.resultSets[0].rows[0]);
// };

// export const getNoteById = async (id: number): Promise<Note | null> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     'SELECT * FROM notes WHERE id = $1',
//     [id]
//   );
//   await session.delete();

//   const rows = result.resultSets[0].rows;
//   return rows.length > 0 ? mapRowToNote(rows[0]) : null;
// };

// export const updateNote = async (
//   id: number,
//   data: Partial<Pick<Note, 'title' | 'content'>> // ✅ добавлено имя параметра `data`
// ): Promise<Note | null> => {
//   const fields: string[] = [];
//   const values: any[] = [];
//   let paramIndex = 1;

//   if (data.title !== undefined) {
//     fields.push(`title = $${paramIndex}`);
//     values.push(data.title);
//     paramIndex++;
//   }
//   if (data.content !== undefined) {
//     fields.push(`content = $${paramIndex}`);
//     values.push(data.content);
//     paramIndex++;
//   }

//   if (fields.length === 0) {
//     throw new Error('Нет полей для update Note');
//   }

//   values.push(id);
//   const queryText = `
//     UPDATE notes
//     SET ${fields.join(', ')}
//     WHERE id = $${paramIndex}
//     RETURNING *
//   `;

//   const session = await getYdbSession();
//   const result = await session.executeQuery(queryText, values);
//   await session.delete();

//   const rows = result.resultSets[0].rows;
//   return rows.length > 0 ? mapRowToNote(rows[0]) : null;
// };

// export const deleteNote = async (id: number): Promise<boolean> => {
//   const session = await getYdbSession();
//   const check = await session.executeQuery(
//     'SELECT 1 FROM notes WHERE id = $1',
//     [id]
//   );
//   const exists = check.resultSets[0].rows.length > 0;

//   if (exists) {
//     await session.executeQuery('DELETE FROM notes WHERE id = $1', [id]);
//   }
//   await session.delete();

//   return exists;
// };
