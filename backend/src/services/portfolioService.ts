import { db } from '../config/db';
import { Portfolio } from '../models/types/Portfolio';
import { deleteFileFromS3, uploadFileToS3 } from './fileService';
import { extractKeyFromUrl } from '../utils/s3';

export const getAllPortfolioImages = async (): Promise<Portfolio[]> => {
  const result = await db.query('SELECT * FROM portfolio ORDER BY created_at DESC');
  return result.rows;
};

export const getPortfolioByCategory = async (category: string): Promise<Portfolio[]> => {
  const result = await db.query(
    'SELECT * FROM portfolio WHERE category ILIKE $1 ORDER BY created_at DESC',
    [category]
  );
  return result.rows;
};

export const createPortfolio = async (
  data: Pick<Portfolio, 'title' | 'description' | 'image_url' | 'category' | 'file_hash'>
): Promise<Portfolio> => {
  const { title, description, image_url, category, file_hash } = data;

  const result = await db.query(
    `INSERT INTO portfolio (title, description, image_url, category, file_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
    [title, description, image_url, category, file_hash]
  );
  return result.rows[0];
};

export const getPortfolioById = async (id: number): Promise<Portfolio | null> => {
  const result = await db.query('SELECT * FROM portfolio WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updatePortfolio = async (
  id: number,
  data: Partial<Pick<Portfolio, 'title' | 'description' | 'image_url' | 'category'>>
): Promise<Portfolio | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.title != undefined) {
    fields.push(`title = $${paramIndex}`);
    values.push(data.title);
    paramIndex++;
  }

  if (data.description != undefined) {
    fields.push(`description = $${paramIndex}`);
    values.push(data.description);
    paramIndex++;
  }

  if (data.image_url != undefined) {
    fields.push(`image_url = $${paramIndex}`);
    values.push(data.image_url);
    paramIndex++;
  }

  if (data.category != undefined) {
    fields.push(`category = $${paramIndex}`);
    values.push(data.category);
    paramIndex++;
  }

  values.push(id);

  const queryTEXT = `UPDATE portfolio
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *`;

  const result = await db.query(queryTEXT, values);
  return result.rows[0] || null;
};

export const updatePortfolioWithImage = async (
  id: number,
  data: Partial<Pick<Portfolio, 'title' | 'description' | 'category'>>,
  newFileBuffer?: Buffer,
  originalFileName?: string
): Promise<Portfolio | null> => {
  const existing = await getPortfolioById(id);
  if (!existing) return null;

  let image_url = existing.image_url;

  if (newFileBuffer && originalFileName) {
    if (existing.image_url) {
      try {
        const oldKey = extractKeyFromUrl(existing.image_url, process.env.S3_BUCKET!.trim());
        await deleteFileFromS3(oldKey);
      } catch (err) {
        console.warn('Не удалось удалить старый файл:', err);
      }
    }
    image_url = await uploadFileToS3(newFileBuffer, originalFileName, 'portfolio/images');
  }
  return await updatePortfolio(id, { ...data, image_url });
};

export const deletePortfolio = async (id: number): Promise<boolean> => {
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
      if (existing.file_hash) {
        await db.query('DELETE FROM file_hashes WHERE hash = $1', [existing.file_hash]);
      }
    } catch (err) {
      console.error('⚠️ Не удалось удалить файл из облака:', err);
    }
  }
  return deleted;
};
// import { getYdbSession } from '../config/ydb-client';
// import { Portfolio } from '../models/types/Portfolio';
// import { deleteFileFromS3, uploadFileToS3 } from './fileService';
// import { extractKeyFromUrl } from '../utils/s3';

// // Вспомогательная функция: преобразовать строку YDB в Portfolio
// const mapRowToPortfolio = (row: any): Portfolio => ({
//   id: row.id.toNumber(),
//   title: row.title?.toString() || '',
//   description: row.description?.toString() || null,
//   image_url: row.image_url?.toString() || '',
//   category: row.category?.toString() || null,
//   file_hash: row.file_hash?.toString() || null,
//   created_at: row.created_at?.toDate(),
// });

// export const getAllPortfolioImages = async (): Promise<Portfolio[]> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     'SELECT * FROM portfolio ORDER BY created_at DESC',
//     []
//   );
//   await session.delete();
//   return result.resultSets[0].rows.map(mapRowToPortfolio);
// };

// export const getPortfolioByCategory = async (category: string): Promise<Portfolio[]> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     'SELECT * FROM portfolio WHERE category ILIKE $1 ORDER BY created_at DESC',
//     [category]
//   );
//   await session.delete();
//   return result.resultSets[0].rows.map(mapRowToPortfolio);
// };

// export const createPortfolio = async (
//   data: Pick<Portfolio, 'title' | 'description' | 'image_url' | 'category' | 'file_hash'>
// ): Promise<Portfolio> => {
//   const { title, description, image_url, category, file_hash } = data;
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     `INSERT INTO portfolio (title, description, image_url, category, file_hash)
//      VALUES ($1, $2, $3, $4, $5)
//      RETURNING *`,
//     [title, description, image_url, category, file_hash]
//   );
//   await session.delete();
//   return mapRowToPortfolio(result.resultSets[0].rows[0]);
// };

// export const getPortfolioById = async (id: number): Promise<Portfolio | null> => {
//   const session = await getYdbSession();
//   const result = await session.executeQuery(
//     'SELECT * FROM portfolio WHERE id = $1',
//     [id]
//   );
//   await session.delete();
//   const rows = result.resultSets[0].rows;
//   return rows.length > 0 ? mapRowToPortfolio(rows[0]) : null;
// };

// export const updatePortfolio = async (
//   id: number,
//   data: Partial<Pick<Portfolio, 'title' | 'description' | 'image_url' | 'category'>>
// ): Promise<Portfolio | null> => {
//   const fields: string[] = [];
//   const values: any[] = [];
//   let paramIndex = 1;

//   if (data.title !== undefined) {
//     fields.push(`title = $${paramIndex}`);
//     values.push(data.title);
//     paramIndex++;
//   }
//   if (data.description !== undefined) {
//     fields.push(`description = $${paramIndex}`);
//     values.push(data.description);
//     paramIndex++;
//   }
//   if (data.image_url !== undefined) {
//     fields.push(`image_url = $${paramIndex}`);
//     values.push(data.image_url);
//     paramIndex++;
//   }
//   if (data.category !== undefined) {
//     fields.push(`category = $${paramIndex}`);
//     values.push(data.category);
//     paramIndex++;
//   }

//   if (fields.length === 0) {
//     // Нечего обновлять
//     return await getPortfolioById(id);
//   }

//   values.push(id);
//   const queryText = `
//     UPDATE portfolio
//     SET ${fields.join(', ')}
//     WHERE id = $${paramIndex}
//     RETURNING *
//   `;

//   const session = await getYdbSession();
//   const result = await session.executeQuery(queryText, values);
//   await session.delete();
//   const rows = result.resultSets[0].rows;
//   return rows.length > 0 ? mapRowToPortfolio(rows[0]) : null;
// };

// export const updatePortfolioWithImage = async (
//   id: number,
//   data: Partial<Pick<Portfolio, 'title' | 'description' | 'category'>>,
//   newFileBuffer?: Buffer,
//   originalFileName?: string
// ): Promise<Portfolio | null> => {
//   const existing = await getPortfolioById(id);
//   if (!existing) return null;

//   let image_url = existing.image_url;

//   if (newFileBuffer && originalFileName) {
//     const bucket = process.env.S3_BUCKET?.trim();
//     if (!bucket) {
//       throw new Error('S3_BUCKET is not defined in environment variables');
//     }

//     if (existing.image_url) {
//       try {
//         const oldKey = extractKeyFromUrl(existing.image_url, bucket);
//         await deleteFileFromS3(oldKey);
//       } catch (err) {
//         console.warn('Не удалось удалить старый файл:', err);
//       }
//     }
//     image_url = await uploadFileToS3(newFileBuffer, originalFileName, 'portfolio/images');
//   }

//   return await updatePortfolio(id, { ...data, image_url });
// };

// export const deletePortfolio = async (id: number): Promise<boolean> => {
//   const existing = await getPortfolioById(id);
//   if (!existing) {
//     return false;
//   }

//   const session = await getYdbSession();
//   const check = await session.executeQuery(
//     'SELECT 1 FROM portfolio WHERE id = $1',
//     [id]
//   );
//   const exists = check.resultSets[0].rows.length > 0;

//   if (exists) {
//     await session.executeQuery('DELETE FROM portfolio WHERE id = $1', [id]);
//     if (existing.file_hash) {
//       await session.executeQuery('DELETE FROM file_hashes WHERE hash = $1', [existing.file_hash]);
//     }
//   }
//   await session.delete();

//   const deleted = exists;

//   if (deleted && existing.image_url) {
//     const bucket = process.env.S3_BUCKET?.trim();
//     if (bucket) {
//       try {
//         const key = extractKeyFromUrl(existing.image_url, bucket);
//         await deleteFileFromS3(key);
//       } catch (err) {
//         console.error('⚠️ Не удалось удалить файл из облака:', err);
//       }
//     } else {
//       console.error('⚠️ S3_BUCKET не задан, пропускаю удаление файла из облака');
//     }
//   }

//   return deleted;
// };
