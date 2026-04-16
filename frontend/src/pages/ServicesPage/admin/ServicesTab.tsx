import React, { useState } from 'react';
import type { Service, ServicePayload, Category } from '../../../types';
import {
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
  uploadServiceImage,
} from '../../../api/servicesApi';
import styles from './AdminServicesPage.module.css';

interface ServicesTabProps {
  services: Service[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  onReload: () => void;
}

type SortField = 'title' | 'category' | 'base_price';
type SortDir = 'asc' | 'desc';

const emptyForm: ServicePayload = {
  slug: '',
  title: '',
  short_description: '',
  long_description: '',
  base_price: undefined,
  price_note: '',
  image_url: '',
  category_id: undefined,
};

export default function ServicesTab({
    services,
    categories,
    loading,
    error,
    onReload,
}: ServicesTabProps) {
    const [form, setForm] = useState<ServicePayload>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [sortField, setSortField] = useState<SortField>('title');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === 'base_price'
                ? value === '' ? undefined : Number(value.replace(',', '.'))
                : name === 'category_id'
                ? value === '' ? undefined : Number(value)
                : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageFile(e.target.files?.[0] || null);
    };

    const startEdit = (service: Service) => {
        setEditingId(service.id);
        setForm({
        slug: service.slug,
        title: service.title,
        short_description: service.short_description ?? '',
        long_description: service.long_description ?? '',
        base_price: service.base_price ?? undefined,
        price_note: service.price_note ?? '',
        image_url: service.image_url ?? '',
        category_id: service.category_id ?? undefined,
        });
        setImageFile(null);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
        setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
        setSortField(field);
        setSortDir('asc');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.slug || !form.title) {
            alert('Slug и название обязательны');
            return;
        }
        try {
            setSaving(true);
            let image_url = form.image_url || '';
            if (imageFile) {
                setUploadingImage(true);
                try {
                    image_url = await uploadServiceImage(imageFile);
                } finally {
                    setUploadingImage(false);
                }
            }
            const payload: ServicePayload = {
                ...form,
                short_description: form.short_description || null,
                long_description: form.long_description || null,
                price_note: form.price_note || null,
                image_url: image_url || null,
            };
            if (editingId === null) {
                await createServiceApi(payload);
            } else {
                await updateServiceApi(editingId, payload);
            }
            await onReload();
            setForm(emptyForm);
            setEditingId(null);
            setImageFile(null);
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            alert(message || 'Ошибка при сохранении');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Удалить услугу?')) return;
        try {
            await deleteServiceApi(id);
            await onReload();
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            alert(message || 'Ошибка при удалении');
        }
    };

    const sortedServices = [...services].sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';
        if (sortField === 'title') {
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
        } else if (sortField === 'category') {
            aVal = categories.find((c) => c.id === a.category_id)?.name.toLowerCase() ?? '';
            bVal = categories.find((c) => c.id === b.category_id)?.name.toLowerCase() ?? '';
        } else if (sortField === 'base_price') {
            aVal = a.base_price ?? 0;
            bVal = b.base_price ?? 0;
        }
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.list}>
                {loading && <div className={styles.state}>Загрузка...</div>}
                {error && <div className={styles.state}>{error}</div>}
                {!loading && !error && services.length === 0 && (
                    <div className={styles.state}>Услуги пока не добавлены</div>
                )}
                {!loading && !error && services.length > 0 && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.thSortable} onClick={() => handleSort('title')}>
                                    Название {sortField === 'title' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                                </th>
                                <th className={styles.thSortable} onClick={() => handleSort('category')}>
                                    Категория {sortField === 'category' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                                </th>
                                <th className={styles.thSortable} onClick={() => handleSort('base_price')}>
                                    Цена {sortField === 'base_price' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                                </th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                        {sortedServices.map((s) => (
                            <tr key={s.id}>
                                <td data-label="Название">{s.title}</td>
                                <td data-label="Категория">
                                    {categories.find((c) => c.id === s.category_id)?.name ?? '—'}
                                </td>
                                <td data-label="Цена">
                                    {s.base_price ? `от ${s.base_price.toLocaleString('ru-RU')} ₽` : '—'}
                                </td>
                                <td data-label="Действия">
                                    <div className={styles.actionsCell}>
                                        <button
                                            type="button"
                                            className={styles.buttonSmall}
                                            onClick={() => startEdit(s)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.buttonSmallDanger}
                                            onClick={() => handleDelete(s.id)}
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
                    {editingId === null ? 'Добавить услугу' : 'Редактировать услугу'}
                </h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span>Slug (для URL)</span>
                        <input
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        placeholder="biorevitalizaciya"
                        />
                    </label>
                    <label className={styles.field}>
                        <span>Название</span>
                        <input name="title" value={form.title} onChange={handleChange} />
                    </label>
                    <label className={styles.field}>
                        <span>Краткое описание</span>
                        <textarea
                        name="short_description"
                        value={form.short_description ?? ''}
                        onChange={handleChange}
                        rows={3}
                        />
                    </label>
                    <label className={styles.field}>
                        <span>Полное описание</span>
                        <textarea
                        name="long_description"
                        value={form.long_description ?? ''}
                        onChange={handleChange}
                        rows={6}
                        />
                    </label>
                    <label className={styles.fieldInline}>
                        <div>
                            <span>Базовая цена (от)</span>
                            <input
                                name="base_price"
                                type="number"
                                min={0}
                                step="100"
                                value={form.base_price ?? ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <span>Пояснение к цене</span>
                            <input
                                name="price_note"
                                value={form.price_note ?? ''}
                                onChange={handleChange}
                                placeholder="от 3 500 ₽ за зону"
                            />
                        </div>
                    </label>
                    <label className={styles.field}>
                        <span>Категория</span>
                        <select name="category_id" value={form.category_id ?? ''} onChange={handleChange}>
                            <option value="">— без категории —</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                        </select>
                    </label>
                    <label className={styles.field}>
                        <span>Картинка услуги</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {form.image_url && (
                        <div className={styles.imagePreview}>
                            <img src={form.image_url} alt="Превью" />
                        </div>
                        )}
                        <small className={styles.helpText}>
                            Можно загрузить новое изображение или оставить существующее.
                        </small>
                    </label>
                    <div className={styles.formButtons}>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={saving || uploadingImage}
                        >
                            {saving || uploadingImage ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        {editingId !== null && (
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => {
                                    setEditingId(null);
                                    setForm(emptyForm);
                                    setImageFile(null);
                                }}
                            >
                                Отмена
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}