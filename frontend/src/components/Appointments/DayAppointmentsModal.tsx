import React, { useState, useEffect } from "react";
import type { Appointment } from "../../types";
import styles from './DayAppointmentsModal.module.css';

interface DayAppointmentsModalProps {
    date: string,
    onClose: () => void
};

export default function DayAppointmentsModal({ date, onClose }: DayAppointmentsModalProps) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null)
    const [currentAppointment, setCurrentAppointment] = useState({
        time: '',
        client_name: '',
        service: '',
        price: ''
    });

    useEffect(() => {
        const loadAppointments = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/appointments/date/${date}`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data: Appointment[] = await response.json();
                    setAppointments(data);
                } else {
                    setError('Не удалось загрузить записи');
                }
            } catch (err: any) {
                setError('Ошибка подключения');
            } finally {
                setLoading(false);
            }
        }
        loadAppointments();
    }, [date]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Отправка формы:', { date, currentAppointment });
        const appointmentTime = `${date} ${currentAppointment.time}:00`;
        const priceNum = currentAppointment.price ? parseFloat(currentAppointment.price) : null;

        try {
            const response = await fetch(`http://localhost:3000/api/appointments`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    client_name: currentAppointment.client_name,
                    service: currentAppointment.service,
                    appointment_time: appointmentTime,
                    price: priceNum
                 })
            });

            if (response.ok) {
                const newAppointment: Appointment = await response.json();
                setAppointments(prev => [...prev, newAppointment]);
                //сброс формы
                setCurrentAppointment({ time: '', client_name: '', service: '', price: '' });
            } else {
                alert('Не удалось добавить запись');
            }
        } catch (err) {
            alert('Ошибка подключения');
        }
    };

    const startEditing = (appointment: Appointment) => {
        const time = new Date(appointment.appointment_time).toTimeString().slice(0, 5);
        setCurrentAppointment({
            time: time,
            client_name: currentAppointment.client_name,
            service: currentAppointment.service,
            price: appointment.price ? String(appointment.price) : ''
        })
        setEditingId(appointment.id);
    };

    const handleUpdate = async(e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;

        const appointmentTime = `${date} ${currentAppointment.time}:00`;
        const priceNum = currentAppointment.price ? parseFloat(currentAppointment.price) : null;

        try {
            const response = await fetch(`http://localhost:3000/api/appointments/${editingId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    client_name: currentAppointment.client_name,
                    service: currentAppointment.service,
                    appointment_time: appointmentTime,
                    price: priceNum
                })
            });

            if (response.ok) {
                const updated: Appointment = await response.json();
                setAppointments(prev => 
                    prev.map(a => (a.id === editingId ? updated : a))
                );
                setEditingId(null);
                setCurrentAppointment({ time: '', client_name: '', service: '', price: '' })
            } else {
                alert('Не удалось обновить запись')
            }
        } catch (err) {
            alert('Ошибка подключения');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить запись?')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setAppointments(prev => prev.filter(a => a.id !== id));
            } else {
                alert('Не удалось удалить запись');
            }
        } catch (err) {
            alert('Ошибка подключения');
        }
    };

    const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>
                <div className={styles.header}>
                    <h2>Записи на {formattedDate}</h2>
                </div>

                {/* Форма добавления */}
                <form onSubmit={editingId ? handleUpdate : handleAdd} className={styles.addForm}>
                    <h3>{editingId ? 'Редактировать запись' : 'Добавить запись'}</h3>
                    <div className={styles.formGroup}>
                        <label>Время (ЧЧ:ММ)</label>
                        <input 
                            type="time"
                            value={currentAppointment.time}
                            onChange={e => setCurrentAppointment(prev => ({ ...prev, time: e.target.value }))}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Имя клиента *</label>
                        <input 
                            value={currentAppointment.client_name}
                            onChange={e => setCurrentAppointment(prev => ({ ...prev, client_name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Услуга *</label>
                        <input 
                            value={currentAppointment.service}
                            onChange={e => setCurrentAppointment(prev =>({ ...prev, service: e.target.value }))}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Цена (руб.)</label>
                        <input 
                            type="number"
                            value={currentAppointment.price}
                            onChange={e => setCurrentAppointment(prev => ({ ...prev, price: e.target.value }))} 
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit">
                            {editingId ? 'Сохранить' : 'Добавить'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setCurrentAppointment({ time: '', client_name: '', service: '', price: '' });
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
                            {appointments.map(a => (
                                <li key={a.id} className={styles.appointmentItem}>
                                    <strong>
                                        {new Date(a.appointment_time).toLocaleTimeString('ru-RU', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </strong>
                                    — {a.client_name}, {a.service}
                                    {a.price && ` (${a.price} ₽)`}
                                    <div className={styles.appointmentActions}>
                                        <button 
                                            onClick={() => startEditing(a)} 
                                            className={styles.editButton}
                                        >
                                            Изменить запись
                                        </button>
                                        <button 
                                            onClick={() => {handleDelete(a.id)}} 
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