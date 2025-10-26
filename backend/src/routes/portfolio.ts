import { Router } from "express";
import { getAllPortfolioImages, 
        getPortfolioById, 
        getPortfolioByCategory, 
        createPortfolio, 
        updatePortfolio, 
        deletePortfolio } from "../services/portfolioService";
import { Portfolio } from "../models/types/Portfolio";

const router = Router();

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
    } catch (err) {
        console.error('Ошибка при получении портфолио: ', err);
        res.status(500).json({ error: 'Не удалось загрузить портфолио' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, image_url, category } = req.body;
    if (!title || !image_url || !category) {
        return res.status(400).json({ error: 'Поля title, image_url, category обязательны для заполнения' });
    }

    try {
        const portfolio: Portfolio = await createPortfolio({title, description, image_url, category});
        res.json(portfolio);
    } catch (err) {
        console.error('Ошибка при создании портфолио: ', err);
        res.status(500).json({ error: 'Не удалось создать портфолио' });
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
    } catch (err) {
        console.error('Ошибка при получении портфолио по ID: ', err);
        res.status(500).json({ error: 'Не удалось получить портфолио по ID' });
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
    } catch (err) {
        console.error('Ошибка при обновлении портфолио: ', err);
        res.status(500).json({ error: 'Не удалось обновить портфолио' });
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
    } catch (err) {
        console.error('Ошибка при удалении портфолио: ', err);
        res.status(500).json({ error: 'Не удалось удалить портфолио' });
    }
});

export default router;
