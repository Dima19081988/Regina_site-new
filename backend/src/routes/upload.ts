import { Router } from "express";
import multer from "multer";
import { uploadFileToS3 } from "../services/fileService";
import { error } from "console";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл обязателен, используйте поле "file"'})
        }

        let folder: 'portfolio/images' | 'portfolio/documents' = 'portfolio/images';
        if (req.query.folder === 'portfolio/documents') {
        folder = 'portfolio/documents';
        }

        const publicUrl = await uploadFileToS3(
            req.file.buffer,
            req.file.originalname,
            folder
        );
        res.json({ publicUrl })
    } catch (err: any) {
        console.error('Ошибка загрузки:', err.message);
        res.status(400).json({ error: err.message || 'Не удалось загрузить файл' });
    }
});

export default router;