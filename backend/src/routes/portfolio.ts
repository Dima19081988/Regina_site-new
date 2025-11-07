import { Router } from "express";
import multer from "multer";
import { getAllPortfolioImages, 
        getPortfolioById, 
        getPortfolioByCategory, 
        createPortfolio, 
        updatePortfolio, 
        deletePortfolio } from "../services/portfolioService";
import { uploadFileToS3 } from "../services/fileService";
import { Portfolio } from "../models/types/Portfolio";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
    const { category } = req.query;

    try {
        let portfolio: Portfolio[];
        if (category && typeof category === 'string') {
            portfolio = await getPortfolioByCategory(category)
        } else {
            portfolio = await getAllPortfolioImages();
        }
        res.json(portfolio);
    } catch (err: any) {
        console.error('Ошибка при получении портфолио: ', err);
        res.status(500).json({ error: err.message || 'Не удалось загрузить портфолио' });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
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

        const portfolioEntry = await createPortfolio({
            title,
            description: description || null,
            image_url: uploadUrl,
            category,
        });
        
        res.status(201).json(portfolioEntry);
    } catch (err: any) {
        console.error('Ошибка при создании портфолио:', err);
        res.status(500).json({ error: err.message || 'Не удалось создать запись портфолио' });
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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const portfolioId = Number(id);

    if (isNaN(portfolioId) || portfolioId <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const portfolio = await updatePortfolio(portfolioId, req.body);
        if (!portfolio) {
            return res.status(404).json({ error: 'Портфолио по ID не найдено' });
        }
        res.json(portfolio)
    } catch (err: any) {
        console.error('Ошибка при обновлении портфолио: ', err);
        res.status(500).json({ error: err.message || 'Не удалось обновить портфолио' });
    }
});

router.delete('/:id', async (req, res) => {
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
