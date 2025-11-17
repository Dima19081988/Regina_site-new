import { db } from "../config/db";
import { FileItem } from "../models/types/Files";
import { deleteFileFromS3 } from "./fileService";
import { extractKeyFromUrl } from "../utils/s3";

export const getAllFiles = async(): Promise<FileItem[]> => {
    const result = await db.query('SELECT * FROM files ORDER BY created_at DESC');
    return result.rows;
};

export const createFileItem = async (
    Data: Pick<FileItem, 'title' | 'description' | 'file_url'> & { file_type: string }
): Promise<FileItem> => {
    const ext = Data.file_url.split('.').pop()?.toLowerCase() || null;
    const fileType = ext;

    const result = await db.query(
        `INSERT INTO files (title, description, file_url, file_type)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [Data.title, Data.description || null, Data.file_url, fileType]
    );

    return result.rows[0];
};

export const getFileItemById = async (id: number): Promise<FileItem | null> => {
    const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
    return result.rows[0] || null;
};

export const deleteFileItem = async (id: number): Promise<boolean> => {
    const existing = await getFileItemById(id);
    if (!existing) return false;

    const result = await db.query('DELETE FROM files WHERE id = $1', [id]);
    const deleted = (result.rowCount || 0) > 0;

    if (deleted && existing.file_url) {
        try {
            const key = extractKeyFromUrl(existing.file_url, process.env.S3_BUCKET!.trim());
            await deleteFileFromS3(key);
        } catch (err) {
            console.warn('Не удалось удалить файл из облака:', err);
        }
    }

    return deleted;
};