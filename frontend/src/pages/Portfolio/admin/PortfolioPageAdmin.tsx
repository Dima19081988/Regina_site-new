import { useState, useEffect } from "react";
import type { PortfolioItem } from "../../../types";
import styles from './PortfolioPageAdmin.module.css';

export default function PortfolioPageAdmin() {
    const [poortfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/portfolio', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Нет доступа к портфолио');
                }
                const data: PortfolioItem[] = await response.json();
                setPortfolio(data);
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, []);

    if (loading) {
        return <div className={styles.container}>Загрузка портфолио...</div>;
    }

    if (error) {
        return <div className={styles.container}>Ошибка загрузки: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Управление портфолио</h1>
            <div className={styles.cardGrid}>
                {poortfolio.map(item => (
                    <div key={item.id} className={styles.card}>
                        <img 
                            src={item.image_url} 
                            alt={item.title || 'Работа'}
                            className={styles.image} 
                        />
                        <div className={styles.cardContent}>
                            <h3>{item.title}</h3>
                            {item.category && <p>Категория: {item.category}</p>}
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(item.id)}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const handleDelete = (id: number) => {
    if (confirm('Удалить работу?')) {
        console.log('Удалить ID:', id);
    // Реализуем позже
    }
};