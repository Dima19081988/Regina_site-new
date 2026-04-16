import { db } from "../config/db";
import { Service } from "../models/types/Services";

export const getAllServices = async (categoryId?: number): Promise<Service[]> => {
    if (categoryId) {
        const result = await db.query(
            'SELECT * FROM services WHERE category_id = $1 ORDER BY created_at DESC',
            [categoryId]
        );
        return result.rows;
    }
    const result = await db.query(
        'SELECT * FROM services ORDER BY created_at DESC'
    );
    return result.rows;
};

export const getServiceBySlug = async (slug: string): Promise<Service | null> => {
    const result = await db.query(
        'SELECT * FROM services WHERE slug = $1',
        [slug]
    );
    return result.rows[0] || null;
};

export const createService = async (data: Pick<Service,
        'slug' | 'title' | 'short_description' |
    'long_description' | 'base_price' | 'price_note' | 'image_url' | 'category_id'>
): Promise<Service> => {
    const result = await db.query(`
        INSERT INTO services
            (slug, title, short_description, long_description,
            base_price, price_note, image_url, category_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `, [
            data.slug, 
            data.title, 
            data.short_description ?? null,
            data.long_description ?? null, 
            data.base_price ?? null, 
            data.price_note ?? null, 
            data.image_url ?? null,
            data.category_id ?? null,
        ]
    );
    return result.rows[0];
};

export const updateService = async (
    id: number,
    data: Partial<
    Pick<Service, 'slug' | 'title' | 'short_description' | 'long_description' | 'base_price' | 'price_note' | 'image_url'>
    >
): Promise<Service | null> => {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let i = 1

    if (data.slug != undefined) {
        fields.push(`slug = $${i++}`);
        values.push(data.slug);
    }

    if (data.title != undefined) {
        fields.push(`title = $${i++}`);
        values.push(data.title);
    }

    if (data.short_description != undefined) {
        fields.push(`short_description = $${i++}`);
        values.push(data.short_description || null);
    }

    if (data.long_description != undefined) {
        fields.push(`long_description = $${i++}`);
        values.push(data.long_description || null);
    } 

    if (data.base_price != undefined) {
        fields.push(`base_price = $${i++}`);
        values.push(data.base_price || null);
    }
    
    if (data.price_note != undefined) {
        fields.push(`price_note = $${i++}`);
        values.push(data.price_note || null);
    }   

    if (data.image_url != undefined) {
        fields.push(`image_url = $${i++}`);
        values.push(data.image_url || null);
    }

    if (fields.length === 0) {
        throw new Error('Нет полей для обновления Service');
    }

    values.push(id);

    const result = await db.query(
        `UPDATE services
         SET ${fields.join(', ')}
         WHERE id = $${i}
         RETURNING *;
        `,
        values
    );
    return result.rows[0] ?? null;
};

export const deleteService = async (id: number): Promise<boolean> => {
    const result = await db.query('DELETE FROM services WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
};