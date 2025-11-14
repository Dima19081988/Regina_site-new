import { db } from "../config/db";
import { Portfolio } from "../models/types/Portfolio";
import { deleteFileFromS3, uploadFileToS3 } from "./fileService";
import { extractKeyFromUrl } from "../utils/s3";

export const getAllPortfolioImages = async () : Promise<Portfolio[]> => {
    const result = await db.query('SELECT * FROM portfolio ORDER BY created_at DESC');
    return result.rows;
};

export const getPortfolioByCategory = async (category: string) : Promise<Portfolio[]> => {
    const result = await db.query('SELECT * FROM portfolio WHERE category ILIKE $1 ORDER BY created_at DESC', [category]);
    return result.rows;
};

export const createPortfolio = async (
    data: Pick<Portfolio, 'title' | 'description' | 'image_url' | 'category'>
) : Promise<Portfolio> => {
    const { title, description, image_url, category } = data;

    const result = await db.query(
        `INSERT INTO portfolio (title, description, image_url, category)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [title, description, image_url, category]
    );
    return result.rows[0];
};

export const getPortfolioById = async (id: number) : Promise<Portfolio | null> => {
    const result = await db.query('SELECT * FROM portfolio WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const updatePortfolio = async(
    id: number,
    data: Partial<Pick<Portfolio, 'title' | 'description' | 'image_url' | 'category'>>
) : Promise<Portfolio | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title != undefined) {
        fields.push(`title = $${paramIndex}`);
        values.push(data.title);
        paramIndex ++;
    }

    if (data.description != undefined) {
        fields.push(`description = $${paramIndex}`);
        values.push(data.description);
        paramIndex ++;
    }

    if (data.image_url != undefined) {
        fields.push(`image_url = $${paramIndex}`);
        values.push(data.image_url);
        paramIndex ++;
    }

        if (data.category != undefined) {
        fields.push(`category = $${paramIndex}`);
        values.push(data.category);
        paramIndex ++;
    }

    values.push(id);

    const queryTEXT = 
        `UPDATE portfolio
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *`;
    
    const result = await db.query(queryTEXT, values);
    return result.rows[0] || null
};

export const updatePortfolioWithImage = async(
    id: number,
    data: Partial<Pick<Portfolio, 'title' | 'description' | 'category'>>,
    newFileBuffer?: Buffer,
    originalFileName?: string
) : Promise<Portfolio | null> => {
    const existing = await getPortfolioById(id);
    if (!existing) return null;

    let image_url = existing.image_url;

    if (newFileBuffer && originalFileName) {
        if (existing.image_url) {
            try { 
                const oldKey = extractKeyFromUrl(existing.image_url, process.env.S3_BUCKET!.trim());
                await deleteFileFromS3(oldKey);
            } catch (err) {
                console.warn('Не удалось удалить старый файл:', err)
            }
        }
        image_url = await uploadFileToS3(
            newFileBuffer,
            originalFileName,
            'portfolio/images'
        );
    }
    return await updatePortfolio(id, { ...data, image_url });
};

export const deletePortfolio = async(id: number) : Promise<boolean> => {
    const existing = await getPortfolioById(id);
    if (!existing) {
        return false;
    }

    const result = await db.query('DELETE FROM portfolio WHERE id = $1', [id]);
    const deleted = (result.rowCount || 0) > 0;

    if (deleted && existing.image_url) {
        try {
            const key = extractKeyFromUrl(existing.image_url, process.env.S3_BUCKET!.trim());
            await deleteFileFromS3(key);
        } catch (err) {
            console.error('⚠️ Не удалось удалить файл из облака:', err);
        }
    }
    return deleted;
};