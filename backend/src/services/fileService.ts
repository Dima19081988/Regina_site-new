import { PutObjectCommand, GetObjectAclCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../config/s3Client";
import path from "path";
import { send } from "process";

const BUCKET_NAME = process.env.S3_BUCKET!;

const ALLOWED_EXTENSIONS = new Set([
    '.jpg', '.jpeg', '.png', '.webp', '.gif',
    '.txt', '.pdf', '.doc', '.docx'
]);

const ALLOWED_FOLDERS = new Set([
    'portfolio/images',
    'portfolio/documents'
]);
//функция определения расширения
const getMimeType = (ext: string): string => {
    switch(ext) {
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.webp': return 'image/webp';
        case '.gif': return 'image/gif';
        case '.txt': return 'text/plain';
        case '.pdf': return 'application/pdf';
        case '.doc': return 'application/msword';
        case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        default: return 'application/octet-stream'
    }
};
//функция загрузки
export const uploadFileToS3 = async (
    fileBuffer: Buffer,
    originalName: string,
    folder: 'portfolio/images' | 'portfolio/documents' = 'portfolio/images'
) : Promise<string> => {
//проверка расширения
    const fileExtension = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(fileExtension)) {
        throw new Error(`Недопустимый тип файла ${fileExtension}. Разрешены ${[...ALLOWED_EXTENSIONS].join(', ')}`);
    }
//проверка папки
    if(!ALLOWED_FOLDERS.has(folder)) {
        throw new Error(`Недопустимая папка ${folder}`);
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
//публичная ссылка
    return `https://${BUCKET_NAME}.storage.yandexcloud.net/${key}`;
};

