import React, { useState } from 'react';
import styles from './PortfolioUploadForm.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface PortfolioUploadFormProps {
  onUploadSuccess: () => void;
}

export default function PortfolioUploadForm({ onUploadSuccess }: PortfolioUploadFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescriptiom] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category) {
      alert('Заполни все обязательные поля и добавь файл');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    if (description) formData.append('description', description);
    formData.append('image', file);

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/portfolio`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (response.ok) {
        alert('Работа успешно добавлена в портфолио');
        setTitle('');
        setCategory('');
        setDescriptiom('');
        setFile(null);
        onUploadSuccess();
      } else {
        const data = await response.json();
        alert(data.error || 'Не удалось добавить работу');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Добавить новую работу</h2>
      <div className={styles.formGroup}>
        <label>Название *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className={styles.formGroup}>
        <label>Категория</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>
      <div className={styles.formGroup}>
        <label>Описание</label>
        <textarea value={description} onChange={(e) => setDescriptiom(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label>Изображение</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        {file && <div className={styles.preview}>Файл: {file.name}</div>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Загрузка...' : 'Добавить работу'}
      </button>
    </form>
  );
}
