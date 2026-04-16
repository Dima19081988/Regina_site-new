import { Router } from "express";
import multer from "multer";
import { uploadFileToS3 } from "../services/fileService";
import { requireAuth } from "../middleware/authMiddleware"; 

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Разрешены только изображения JPG, PNG, WebP, GIF'));
        }
        cb(null, true);
    },
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл обязателен (поле "image")' });
        }

        const url = await uploadFileToS3(
            req.file.buffer,
            req.file.originalname,
            'services/images',
        );

        res.status(201).json({ url });
    } catch (error) {
        console.error('Ошибка загрузки изображения услуги:', error);

        const message =
            error instanceof Error ? error.message : 'Неизвестная ошибка';

        if (message.includes('Недопустимый тип файла')) {
            return res.status(400).json({ error: message });
        }

        return res.status(500).json({ error: 'Не удалось загрузить изображение' });
    }
});

export default router;