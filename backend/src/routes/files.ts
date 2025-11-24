import { Router } from 'express';
import multer from 'multer';
import {
  getAllFiles,
  createFileItem,
  getFileItemById,
  deleteFileItem,
} from '../services/fileItemService';
import { uploadFileToS3 } from '../services/fileService';
import { FileItem } from '../models/types/Files';
import path from 'path';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.txt', '.doc', '.docx'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Разрешены только PDF, TXT, DOC, DOCX'));
    }
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Недопустимое расширение файла'));
    }

    cb(null, true);
  },
});

router.get('/', async (req, res) => {
  try {
    const files: FileItem[] = await getAllFiles();
    res.json(files);
  } catch (err) {
    console.error('Ошибка при получении файлов', err);
    res.status(500).json({ error: 'Не удалось загрузить файлы' });
  }
});

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл обязателен (поле "file")' });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Поле "title" обязательно' });
    }
    const fileExtension = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const fileUrl = await uploadFileToS3(req.file.buffer, req.file.originalname, 'files');
    const fileItem = await createFileItem({
      title,
      description,
      file_url: fileUrl,
      file_type: fileExtension,
    });

    res.status(201).json(fileItem);
  } catch (err: any) {
    console.error('Ошибка загрузки файла:', err);
    if (err.message === 'Файл с таким содержимым уже был загружен') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Не удалось загрузить файл' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }
  try {
    const fileItem = await getFileItemById(id);
    if (!fileItem) {
      return res.status(404).json({ error: 'Файл по ID не найден' });
    }
    res.json(fileItem);
  } catch (err) {
    console.error('Ошибка:', err);
    res.status(500).json({ error: 'Ошибка получения файла' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }
  try {
    const deleted = await deleteFileItem(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Файл не найден' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Ошибка:', err);
    res.status(500).json({ error: 'Ошибка удаления файла' });
  }
});

export default router;
