import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './LoginPage.module.css';

export default function LoginPage() {
    
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] =useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/admin/portfolio');
            } else {
                setError(data.error || 'Неверный пароль')
            }
        } catch (err) {
            console.error('Ошибка:', err);
            setError('Не удалось подключиться к серверу');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <h2>Вход для администратора</h2>
                {error && <div className={styles.loginError}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Пароль</label>
                        <input 
                            id="password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus 
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
}