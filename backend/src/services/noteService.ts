import { db } from "../config/db";
import { Note } from "../models/types/Notes";

export const getAllNotes = async () : Promise<Note[]> => {
    const result = await db.query('SELECT * FROM notes ORDER BY created_at DESC');
    return result.rows;
};

export const createNote = async (
    data: Pick<Note, 'title' | 'content' >
): Promise<Note> => {
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
) : Promise<Note | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title != undefined) {
        fields.push(`title = $${paramIndex}`);
        values.push(data.title);
        paramIndex ++;
    }

    if (data.content != undefined) {
        fields.push(`content = $${paramIndex}`);
        values.push(data.content);
        paramIndex ++;
    }

    if (fields.length === 0) {
        throw new Error('Нет полей для update Note');
    }

    values.push(id);

    const queryText = `
        UPDATE notes
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
    `;

    const result = await db.query(queryText, values);
    return result.rows[0] || null;
};

export const deleteNote = async (id: number) : Promise<boolean> => {
    const result = await db.query('DELETE FROM notes WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
};