import type { Category } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getCategories = async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE}/api/categories`);
    if (!res.ok) {
        throw new Error('Ошибка при загрузке категорий');
    }
    return res.json();
};

export interface CategoryPayload {
    name: string;
    slug: string;
    sort_order?: number;
}

export const createCategoryApi = async (payload: CategoryPayload): Promise<Category> => {
    const res = await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Не удалось создать категорию');
    }
    return res.json();
};

export const updateCategoryApi = async (id: number, payload: Partial<CategoryPayload>): Promise<Category> => {
    const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Не удалось обновить категорию');
    }
    return res.json();
};

export const deleteCategoryApi = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Не удалось удалить категорию');
    }
};
