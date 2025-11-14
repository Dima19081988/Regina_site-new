import { Router } from "express";
import { getAllNotes, createNote, getNoteById, updateNote, deleteNote } from "../services/noteService";
import { Note } from "../models/types/Notes";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const notes: Note[] = await getAllNotes();
        res.json(notes)
    } catch (err) {
        console.error('Ошибка при получении заметок: ', err);
        res.status(500).json({ error: 'Не удалось загрузить заметки' })
    }
});

router.post('/', requireAuth, async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Поля title, content обязательны для заполнения' });
    }

    try {
        const note: Note = await createNote({ title, content });
        res.json(note);
    } catch (err) {
        console.error('Ошибка создания заметки: ', err);
        res.status(500).json({ error: 'Не удалось создать заметку' });
    }
});

router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const noteId = Number(id);

    if (isNaN(noteId) || noteId <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const note = await getNoteById(noteId);
        if(!note) {
            return res.status(404).json({ error: 'Заметка по ID не найдена' });
        }
        res.json(note);
    } catch (err) {
        console.error('Ошибка получения заметки по ID: ', err);
        res.status(500).json({ error: 'Не удалось получить заметку по ID' });
    }
});

router.put('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const noteId = Number(id);
    if (isNaN(noteId) || noteId <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const note = await updateNote(noteId, req.body);
        if(!note) {
            return res.status(404).json({ error: 'Заметка по ID не найдена' });
        }
        res.json(note);
    } catch (err) {
        console.error('Ошибка получения заметки по ID: ', err);
        res.status(500).json({ error: 'Не удалось получить заметку по ID' });
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const noteId = Number(id);
    if (isNaN(noteId) || noteId <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const deleted = await deleteNote(noteId);
        if(!deleted) {
            return res.status(404).json({ error: 'Заметка по ID не найдена' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Ошибка при удалении заметки: ', err);
        res.status(500).json({ error: 'Не удалось удалть заметку' });
    }
});

export default router;