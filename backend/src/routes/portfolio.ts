import { Router } from 'express';
import multer from 'multer';
import {
  getAllPortfolioImages,
  getPortfolioById,
  getPortfolioByCategory,
  createPortfolio,
  deletePortfolio,
  updatePortfolioWithImage,
} from '../services/portfolioService';
import { uploadFileToS3 } from '../services/fileService';
import { getFileHash } from '../services/fileService';
import { Portfolio } from '../models/types/Portfolio';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Разрешены только изображения: JPG, PNG, WebP, GIF'));
    }
    cb(null, true);
  },
});

router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    let portfolio: Portfolio[];
    if (category && typeof category === 'string') {
      portfolio = await getPortfolioByCategory(category);
    } else {
      portfolio = await getAllPortfolioImages();
    }
    res.json(portfolio);
  } catch (err: any) {
    console.error('Ошибка при получении портфолио: ', err);
    res.status(500).json({ error: err.message || 'Не удалось загрузить портфолио' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const portfolioId = Number(id);

  if (isNaN(portfolioId) || portfolioId <= 0) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }

  try {
    const portfolio = await getPortfolioById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Портфолио по ID не найдено' });
    }
    res.json(portfolio);
  } catch (err: any) {
    console.error('Ошибка при получении портфолио по ID: ', err);
    res.status(500).json({ error: err.message || 'Не удалось получить портфолио по ID' });
  }
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл обязателен, используйте поле "file"' });
    }

    const { title, description, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Поля "title" и "category" обязательны' });
    }

    const uploadUrl = await uploadFileToS3(
      req.file.buffer,
      req.file.originalname,
      'portfolio/images'
    );

    const fileHash = getFileHash(req.file.buffer);
    const portfolioEntry = await createPortfolio({
      title,
      description: description || null,
      image_url: uploadUrl,
      category,
      file_hash: fileHash,
    });

    res.status(201).json(portfolioEntry);
  } catch (err: any) {
    console.error('Ошибка при создании портфолио:', err);

    if (err.message === 'Файл с таким содержимым уже был загружен') {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message || 'Не удалось создать запись портфолио' });
  }
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const portfolioId = Number(id);

  if (isNaN(portfolioId) || portfolioId <= 0) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }

  try {
    const { title, description, category } = req.body;
    const updateData = { title, description, category };
    const portfolio = await updatePortfolioWithImage(
      portfolioId,
      updateData,
      req.file?.buffer,
      req.file?.originalname
    );

    if (!portfolio) {
      return res.status(404).json({ error: 'Портфолио по ID не найдено' });
    }

    res.json(portfolio);
  } catch (err: any) {
    console.error('Ошибка при обновлении портфолио: ', err);
    if (err.message?.includes('Разрешены только') || err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: err.message || 'Ошибка загрузки файла' });
    }
    res.status(500).json({ error: err.message || 'Не удалось обновить портфолио' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const portfolioId = Number(id);

  if (isNaN(portfolioId) || portfolioId <= 0) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }

  try {
    const deleted = await deletePortfolio(portfolioId);
    if (!deleted) {
      return res.status(404).json({ error: 'Портфолио по ID не найдено' });
    }
    res.status(204).send();
  } catch (err: any) {
    console.error('Ошибка при удалении портфолио: ', err);
    res.status(500).json({ error: err.message || 'Не удалось удалить портфолио' });
  }
});

export default router;
