import { Router } from "express";
import { getAllServices, getServiceBySlug, createService, updateService, deleteService } from "../services/serviceService";
import { requireAuth } from "../middleware/authMiddleware";
import type { Service } from "../models/types/Services";

const router = Router();

router.get('/', async (req, res) => {
    const categoryId = req.query.category_id
        ? Number(req.query.category_id)
        : undefined;
    try {
        const services = await getAllServices(categoryId);
        res.json(services);
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        res.status(500).json({ error: 'Не удалось загрузить услуги' });
    }
});

router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return res.status(400).json({ error: 'Не указан slug' });
    }

    try {
        const service = await getServiceBySlug(slug);
        if (!service) {
            return res.status(400).json({ error: 'Услуга не найдена' });
        }
        res.json(service);
    } catch (error) {
        console.error('Ошибка при получении услуги:', error);
        res.status(500).json({ error: 'Не удалось загрузить услугу' });
    }
});

router.post('/', requireAuth, async (req, res) => {
    const { slug, title, short_description, long_description, base_price, price_note, image_url, category_id } = req.body;
    
    if (!slug || !title) {
        return res.status(400).json({ error: 'Поля slug и title обязательны' });
    }

    try {
        const service = await createService({
            slug,
            title,
            short_description: short_description ?? null,
            long_description: long_description ?? null,
            base_price: base_price ? Number(base_price) : null,
            price_note: price_note ?? null,
            image_url: image_url ?? null,
            category_id: category_id ? Number(category_id) : null,
        });
        res.status(201).json(service);
    } catch (error) {
        console.error('Ошибка создания услуги:', error);
        res.status(500).json({ error: 'Не удалось создать услугу' });
    }
});

router.put('/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const service = await updateService(id, req.body);
        if (!service) {
            return res.status(404).json({ error: 'Услуга не найдена' });
        }
        res.json(service);
    } catch (error) {
        console.error('Ошибка обновления услуги:', error);
        const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
        return res.status(500).json({ error: message });
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }
    try {
        const deleted = await deleteService(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Услуга не найдена' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка удаления услуги:', error);
        res.status(500).json({ error: 'Не удалось удалить услугу' });
    }
});

export default router;