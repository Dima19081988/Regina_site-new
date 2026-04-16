import React, { useState, useEffect } from 'react';
import type { Appointment, Service, Category} from '../../types';
import { getServices } from '../../api/servicesApi';
import { getCategories } from '../../api/categoriesApi';
import styles from './DayAppointmentsModal.module.css';

interface DayAppointmentsModalProps {
  date: string;
  onClose: () => void;
}
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const emptyForm = {
  time: '',
  client_name: '',
  service_id: '',
  price: '',
};

export default function DayAppointmentsModal({ date, onClose }: DayAppointmentsModalProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('null');

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/appointments/date/${date}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data: Appointment[] = await response.json();
          setAppointments(data);
        } else {
          setError('Не удалось загрузить записи');
        }
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Ошибка подключения');
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, [date]);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => console.error('Не удалось загрузить услуги:', err));

    getCategories()
      .then(setCategories)
      .catch((err) => console.error('Не удалось загрузить категории:', err));
  }, []);

  const filteredServices = selectedCategoryId
    ? services.filter((s) => s.category_id === Number(selectedCategoryId))
    : services;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
    setForm((prev) => ({ ...prev, service_id: '' }));
  };

  const selectedService = services.find((s) => s.id === Number(form.service_id));

  const buildPayload = () => {
    const appointmentTime = `${date} ${form.time}:00`;
    const priceNum = form.price ? parseFloat(form.price) : null;
    return {
      client_name: form.client_name || null,
      service: selectedService?.title || '',
      service_id: form.service_id ? Number(form.service_id) : null,
      appointment_time: appointmentTime,
      price: priceNum,
    };
  };
  
  const resetForm = () => {
    setForm(emptyForm);
    setSelectedCategoryId('');
    setEditingId(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });

      if (response.ok) {
        const newAppointment: Appointment = await response.json();
        setAppointments((prev) => [...prev, newAppointment]);
        setForm(emptyForm);
      } else {
        alert('Не удалось добавить запись');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения');
    }
  };

  const startEditing = (appointment: Appointment) => {
    const time = new Date(appointment.appointment_time).toTimeString().slice(0, 5);

    const service = services.find((s) => s.id === appointment.service_id) || null;
    setSelectedCategoryId(service?.category_id ? String(service.category_id) : '');
    setForm({
      time,
      client_name: appointment.client_name ?? '',
      service_id: appointment.service_id ? String(appointment.service_id) : '',
      price: appointment.price ? String(appointment.price) : '',
    });
    setEditingId(appointment.id);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;

    try {
      const response = await fetch(`${API_BASE}/api/appointments/${editingId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });

      if (response.ok) {
        const updated: Appointment = await response.json();
        setAppointments((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
        resetForm()
      } else {
        alert('Не удалось обновить запись');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить запись?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/appointments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert('Не удалось удалить запись');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения');
    }
  };

  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles['modal__overlay']} onClick={onClose}>
      <div className={styles['modal__content']} onClick={(e) => e.stopPropagation()}>
        <button className={styles['close-button']} onClick={onClose}>
          ✕
        </button>
        <div className={styles['modal__header']}>
          <h2>Записи на {formattedDate}</h2>
        </div>

        {/* Форма добавления */}
        <form onSubmit={editingId === null ? handleAdd : handleUpdate} className={styles.addForm}>
          <h3>{editingId === null ? 'Добавить запись' : 'Редактировать запись'}</h3>
          <div className={styles.formGroup}>
            <label>Время (ЧЧ:ММ)</label>
            <input
              type="time"
              name='time'
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Имя клиента / заметка (необязательно)</label>
            <input
              value={form.client_name}
              name='client_name'
              onChange={handleChange}
              placeholder="Мария, постоянный клиент..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>Категория</label>
            <select value={selectedCategoryId} onChange={handleCategoryChange}>
              <option value="">— все категории —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Услуга *</label>
            <select 
              name="service_id"
              value={form.service_id}
              onChange={handleChange}
              required
            >
              <option value="">— выберите услугу —</option>
              {filteredServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                  {s.price_note ? ` (${s.price_note})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Цена (руб.)</label>
            <input
              type="number"
              name='price'
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit">
              {editingId === null ? 'Добавить' : 'Сохранить'}
            </button>
            {editingId !==null && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            )}
          </div>
        </form>

        {/* Список записей */}
        <div className={styles.appointmentsList}>
          <h3>Существующие записи</h3>
          {loading ? (
            <p>Загрузка...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : appointments.length === 0 ? (
            <p>Нет записей</p>
          ) : (
            <ul>
              {appointments.map((a) => (
                <li key={a.id} className={styles.appointmentItem}>
                  <strong>
                    {new Date(a.appointment_time).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                  {' — '}{a.service}
                  {a.client_name && ` (${a.client_name})`}
                  {a.price && ` — ${a.price} ₽`}
                  <div className={styles.appointmentActions}>
                    <button onClick={() => startEditing(a)} className={styles.editButton}>
                      Изменить запись
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(a.id);
                      }}
                      className={styles.deleteButton}
                    >
                      Удалить запись
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
