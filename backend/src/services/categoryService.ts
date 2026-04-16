import { db } from "../config/db";
import { Category } from "../models/types/Category"; 

export const getAllCategories = async (): Promise<Category[]> => {
    const result = await db.query(
        'SELECT * FROM categories ORDER BY sort_order ASC'
    );
    return result.rows;
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
    const result = await db.query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

export const createCategory = async (
    data: Pick<Category, 'name' | 'slug' | 'sort_order'>
): Promise<Category> => {
    const result = await db.query(
        `INSERT INTO categories (name, slug, sort_order) 
        VALUES ($1, $2, $3) 
        RETURNING *`,
        [data.name, data.slug, data.sort_order ?? 0]
    );
    return result.rows[0];
};

export const updateCategory = async(
    id: number,
    data: Partial<Pick<Category, 'name' | 'slug' | 'sort_order'>>
): Promise<Category | null> => {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let i = 1;

    if (data.name !== undefined) {
        fields.push(`name = $${i++}`);
        values.push(data.name);
    }

    if (data.slug !== undefined) {
        fields.push(`slug = $${i++}`);
        values.push(data.slug);
    }

    if (data.sort_order !== undefined) {
        fields.push(`sort_order = $${i++}`);
        values.push(data.sort_order);
    }

    if (fields.length === 0) {
        throw new Error('Нет полей для обновления Category');
    }

    values.push(id);

    const result = await db.query(
        `UPDATE categories SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
        values
    )
    return result.rows[0] || null;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
    const result = await db.query('DELETE FROM categories WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
};