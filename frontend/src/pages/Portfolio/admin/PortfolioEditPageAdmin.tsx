import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PortfolioItem } from '../../../types';
import styles from './PortfolioEditPageAdmin.module.css';

export default function PortfolioEditPageAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/api/portfolio/${id}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((item: PortfolioItem) => {
        setTitle(item.title);
        setCategory(item.category || '');
        setDescription(item.description || '');
        setLoading(false);
      })
      .catch(() => {
        alert('Не удалось загрузить данные');
        navigate('/admin/portfolio');
      });
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    if (description) formData.append('description', description);
    if (file) formData.append('image', file);

    try {
      const response = await fetch(`http://localhost:3000/api/portfolio/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        alert('Работа успешно обновлена');
        navigate(`/admin/portfolio/${id}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка обновления');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения к серверу');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.container}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <h1>Редактировать работу</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Название *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          <label>Категория</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Описание</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Новое изображение (необязательно)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && <div className={styles.preview}>Выбрано: {file.name}</div>}
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
