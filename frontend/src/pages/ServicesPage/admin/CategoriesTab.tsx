import React, { useState } from "react";
import type { Category } from "../../../types";
import {
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi,
    type CategoryPayload,
} from "../../../api/categoriesApi";
import styles from './AdminServicesPage.module.css';

interface CategoriesTabProps {
    categories: Category[];
    onReload: () => void;
};

type CatForm = { name: string; slug: string; sort_order: string };
const emptyCatForm: CatForm = { name: '', slug: '', sort_order: '' };

export default function CategoriesTab({ categories, onReload }: CategoriesTabProps) {
    const [form, setForm] = useState<CatForm>(emptyCatForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));  
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setForm({
            name: cat.name,
            slug: cat.slug,
            sort_order: cat.sort_order.toString(),
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm(emptyCatForm);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.slug) {
            alert('Название и slug обязательны');
            return;
        }
        const payload: CategoryPayload = {
            name: form.name,
            slug: form.slug,
            sort_order: form.sort_order ? Number(form.sort_order) : 0,
        };

        try {
            setSaving(true);
            if (editingId === null) {
                await createCategoryApi(payload);
            } else {
                await updateCategoryApi(editingId!, payload);
            }
            await onReload();
            setForm(emptyCatForm);
            setEditingId(null);
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            alert(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Удалить категорию? Услуги останутся без категории.')) return;
        try {
            await deleteCategoryApi(id);
            await onReload();
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            alert(message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.list}>
                {categories.length === 0 ?(
                    <div className={styles.state}>Категории пока не добавлены</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Slug</th>
                                <th>Сортировка</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...categories]
                              .sort((a, b) => a.sort_order - b.sort_order)
                              .map((c) => (
                                <tr key={c.id}>
                                    <td data-label="Название">{c.name}</td>
                                    <td data-label="Slug">{c.slug}</td>
                                    <td data-label="Порядок">{c.sort_order}</td>
                                    <td data-label="Действия">
                                        <div className={styles.actionsCell}>
                                            <button
                                                type="button"
                                                className={styles.buttonSmall}
                                                onClick={() => startEdit(c)}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.buttonSmallDanger}
                                                onClick={() => handleDelete(c.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                              ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className={styles.formWrapper}>
                <h2 className={styles.formTitle}>
                    {editingId === null ? 'Добавить категорию' : 'Редактировать категорию'}
                </h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span>Название</span>
                        <input name="name" value={form.name} onChange={handleChange} />
                    </label>
                    <label className={styles.field}>
                        <span>Slug (для URL)</span>
                        <input name="slug" value={form.slug} onChange={handleChange} placeholder="biorevitalizaciya" />
                    </label>
                    <label className={styles.field}>
                        <span>Порядок сортировки</span>
                        <input name="sort_order" type="number" min={0} value={form.sort_order} onChange={handleChange} placeholder="0" />
                    </label>
                    <button type="submit" className={styles.saveButton} disabled={saving}>
                        {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    {editingId !== null && (
                        <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                            Отмена
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}