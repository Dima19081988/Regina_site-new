import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../config/s3Client';
import path from 'path';
import { db } from '../config/db';
import crypto from 'crypto';

const BUCKET_NAME = process.env.S3_BUCKET?.trim();
if (!BUCKET_NAME) {
  throw new Error('S3_BUCKET не задан в .env');
}

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.txt',
  '.pdf',
  '.doc',
  '.docx',
]);

const ALLOWED_FOLDERS = new Set(['portfolio/images', 'portfolio/documents', 'files']);
//функция определения расширения
const getMimeType = (ext: string): string => {
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.txt':
      return 'text/plain';
    case '.pdf':
      return 'application/pdf';
    case '.doc':
      return 'application/msword';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'application/octet-stream';
  }
};

export const getFileHash = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

//функция загрузки
export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  originalName: string,
  folder: string = 'portfolio/images'
): Promise<string> => {
  //проверка содержимого в файле
  if (fileBuffer.length === 0) {
    throw new Error('Файл не должен быть пустым');
  }
  //проверка originalName на пустоту
  if (!originalName || typeof originalName !== 'string') {
    throw new Error('Имя файла обязательно');
  }
  //проверка расширения
  const fileExtension = path.extname(originalName).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(fileExtension)) {
    throw new Error(
      `Недопустимый тип файла ${fileExtension}. Разрешены ${[...ALLOWED_EXTENSIONS].join(', ')}`
    );
  }
  //проверка папки
  if (!ALLOWED_FOLDERS.has(folder)) {
    throw new Error(`Недопустимая папка ${folder}. Разрешены: ${[...ALLOWED_FOLDERS].join(', ')}`);
  }

  //Проверка, был ли такой файл уже загружен
  const fileHash = getFileHash(fileBuffer);
  const existingHash = await db.query('SELECT 1 FROM file_hashes WHERE hash = $1', [fileHash]);
  if (existingHash.rows.length > 0) {
    throw new Error('Файл с таким содержимым уже был загружен');
  }

  //генерация уникального имени
  const uniqueFileName = `${uuidv4()}${fileExtension}`;
  const key = `${folder}/${uniqueFileName}`;

  //опредение MIME-типа
  const mimeType = getMimeType(fileExtension);

  //загрузка в Yandex Object Storage
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  //Сохранение хеша в базе, чтобы избежать будущих дублей
  await db.query('INSERT INTO file_hashes (hash) VALUES ($1) ON CONFLICT (hash) DO NOTHING', [
    fileHash,
  ]);

  //публичная ссылка
  return `https://${BUCKET_NAME}.storage.yandexcloud.net/${key}`;
};

export const deleteFileFromS3 = async (key: string): Promise<void> => {
  if (!key) {
    throw new Error('Ключ файла не может быть пустым');
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
  console.log(`✅ Файл удалён из облака: ${key}`);
};
