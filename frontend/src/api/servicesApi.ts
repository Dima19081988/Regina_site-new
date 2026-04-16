import type { Service, ServicePayload } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getServices = async (categoryId?: number): Promise<Service[]> => {
  const url =  categoryId
    ? `${API_BASE}/api/services?category_id=${categoryId}`
    : `${API_BASE}/api/services`;

  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Не удалось загрузить услуги');
  return res.json();
};

export const getServiceBySlug = async (slug: string): Promise<Service> => {
  const res = await fetch(`${API_BASE}/api/services/${slug}`);
  if (!res.ok) throw new Error('Услуга не найдена');
  return res.json();
};

export const createServiceApi = async (payload: ServicePayload): Promise<Service> => {
  const res = await fetch(`${API_BASE}/api/services`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Не удалось создать услугу');
  }

  return res.json();
};

export const updateServiceApi = async (
  id: number,
  payload: Partial<ServicePayload>,
): Promise<Service> => {
  const res = await fetch(`${API_BASE}/api/services/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Не удалось обновить услугу');
  }

  return res.json();
};

export const deleteServiceApi = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/services/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Не удалось удалить услугу');
  }
};

export const uploadServiceImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/api/service-images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Не удалось загрузить изображение');
  }

  const data = await res.json();
  return data.url as string;
};