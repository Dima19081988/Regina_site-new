import { useState, useEffect } from 'react';
import type { FileItem } from '../../types';
import styles from './AdminFilesPage.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/files`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Нет доступа к файлам');
        const data: FileItem[] = await response.json();
        setFiles(data);
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Ошибка подключения');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      alert('Заполни название и выбери файл');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    if (description) formData.append('description', description);
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/api/files`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const newFile: FileItem = await response.json();
        setFiles((prev) => [newFile, ...prev]);
        setTitle('');
        setDescription('');
        setFile(null);
      } else {
        const err = await response.json();
        alert(err.error || 'Ошибка загрузки');
      }
    } catch {
      alert('Ошибка подключения к серверу');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить файл?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/files/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert('Не удалось удалить файл');
      }
    } catch {
      alert('Ошибка подключения');
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const getFileIcon = (type: string | null) => {
    if (!type) return '📄';
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'txt':
        return '📝';
      case 'doc':
      case 'docx':
        return '📘';
      default:
        return '📄';
    }
  };

  return (
    <div className={styles.container}>
      <h1>Файлы</h1>

      <form onSubmit={handleUpload} className={styles.uploadForm}>
        <h2>Загрузить новый файл</h2>
        <div className={styles.formGroup}>
          <label>Название *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Описание</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Файл (PDF, TXT, DOC, DOCX) *</label>
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
          {file && <div className={styles.filePreview}>Выбрано {file.name}</div>}
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Загрузка' : 'Загрузить файл'}
        </button>
      </form>

      <div className={styles.filesList}>
        {loading ? (
          <p>Загрузка файлов...</p>
        ) : error ? (
          <p className={styles.error}>Ошибка: {error}</p>
        ) : files.length === 0 ? (
          <p>Нет файлов</p>
        ) : (
          files.map((file) => (
            <div key={file.id} className={styles.fileCard}>
              <div className={styles.fileHeader}>
                <span className={styles.fileIcon}>{getFileIcon(file.file_type)}</span>
                <h3>{file.title}</h3>
                <span className={styles.fileType}>{file.file_type?.toUpperCase()}</span>
              </div>
              {file.description && <p>{file.description}</p>}
              <div className={styles.fileActions}>
                <button
                  onClick={() => handleDownload(file.file_url)}
                  className={styles.downloadButton}
                >
                  Скачать
                </button>
                <button onClick={() => handleDelete(file.id)} className={styles.deleteButton}>
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
