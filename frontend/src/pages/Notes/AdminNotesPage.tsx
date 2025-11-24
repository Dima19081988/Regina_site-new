import React, { useState, useEffect } from "react";
import type { Note } from "../../types";
import styles from './AdminNotesPage.module.css';

export default function AdminNotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/notes', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Нет доступа к заметкам');
                }
                const data: Note[] = await response.json();
                setNotes(data);
            } catch (err) {
                console.error('Ошибка:', err);
                setError('Ошибка подключения');
            } finally {
                setLoading(false);
            }
        }
        fetchNotes();
    }, []);

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId
            ? `http://localhost:3000/api/notes/${editingId}`
            : 'http://localhost:3000/api/notes';

        try {
            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            
            if (response.ok) {
                const note: Note = await response.json();
                if (editingId) {
                    setNotes(prev => prev.map(n => (n.id === editingId ? note : n)));
                } else {
                    setNotes(prev => [note, ...prev]);
                }
                setTitle('');
                setContent('');
                setEditingId(null);
            } else {
                const err = await response.json();
                alert(err.error || 'Ошибка сохранения');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            alert('Ошибка подключения к серверу');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить заметку?')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setNotes(prev => prev.filter(n => n.id !== id));
            } else {
                alert('Не удалось удалить заметку');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            alert('Ошибка подключения');
        }
    };

    const handleEdit = async (note: Note) => {
        setTitle(note.title);
        setContent(note.content || '');
        setEditingId(note.id);
    };

    return (
        <div className={styles.container}>
            <h1>Заметки</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>{editingId ? 'Редактировать заметку' : 'Добавить заметку'}</h2>
                <div className={styles.formGroup}>
                    <input 
                        type="text"
                        placeholder="Заголовок *"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <textarea 
                        placeholder="Содержание *"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                        rows={4}
                    />
                </div>
                <div className={styles.formActions}>
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Сохранение...' : editingId ? 'Сохранить' : 'Добавить'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setTitle('');
                                setContent('');
                                setEditingId(null);
                            }}
                            className={styles.cancelButton}    
                        >
                            Отмена                               
                        </button>
                    )}
                </div>
            </form>
            <div className={styles.notesList}>
                {loading ? (
                    <p>Загрузка заметок</p>
                ) : error ? (
                    <p className={styles.error}>Ошибка: {error}</p>
                ) : notes.length === 0 ? (
                    <p>Нет заметок</p>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className={styles.noteCard}>
                            <h3>{note.title}</h3>
                            <p>{note.content}</p>
                            <div className={styles.noteActions}>
                                <button onClick={() => handleEdit(note)} className={styles.editButton}>
                                    Редактировать
                                </button>
                                <button onClick={() => handleDelete(note.id)} className={styles.deleteButton}>
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