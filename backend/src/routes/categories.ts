import { Router } from "express";
import { 
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
 } from "../services/categoryService"; 
 import { requireAuth } from "../middleware/authMiddleware";
 import type { Category } from "../models/types/Category";

 const router = Router();

 router.get('/', async (req, res) => {
    try {
        const categories: Category[] = await getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error('Ошибка получения категорий:', error);
        res.status(500).json({ error: 'Не удалось загрузить категории' });
    }
 });

 router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const category = await getCategoryById(id);
        if (!category) {
            return res.status(404).json({ error: 'Категория не найдена' });
        }
        res.json(category);
    } catch (error) {
        console.error('Ошибка получения категории:', error);
        res.status(500).json({ error: 'Не удалось загрузить категорию' });
    }
 });

 router.post('/', requireAuth, async (req, res) => {
    const { name, slug, sort_order } = req.body;
    if (!name || !slug) {
        return res.status(400).json({ error: 'Поля name и slug обязательны' });
    }

    try {
        const category = await createCategory({
            name,
            slug,
            sort_order: sort_order ? Number(sort_order) : 0,
        });
        res.status(201).json(category);
    } catch (error) {
        console.error('Ошибка создания категории:', error);
        res.status(500).json({ error: 'Не удалось создать категорию' });
    }
 });

 router.put('/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const category = await updateCategory(id, req.body);
        if (!category) {
            return res.status(404).json({ error: 'Категория не найдена' });
        }
        res.json(category);
    } catch (error) {
        console.error('Ошибка обновления категории:', error);
        res.status(500).json({ error: 'Не удалось обновить категорию' });
    }
 });

 router.delete('/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const deleted = await deleteCategory(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Категория не найдена' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка удаления категории:', error);
        res.status(500).json({ error: 'Не удалось удалить категорию' });
    }
 });

 export default router;

