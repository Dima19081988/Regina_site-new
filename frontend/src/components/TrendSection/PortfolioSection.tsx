import { useState, useEffect } from "react";
import type { PortfolioItem } from "../../types";
import PortfolioCard from "../Portfolio/PortfolioCard/PortfolioCard";
import styles from './PortfolioSection.module.css';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Props {
    category: string;
}

export default function PortfolioSection({ category }: Props) {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolioCategory = async() => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE}/api/portfolio?category=${encodeURIComponent(category)}`);
                if (!response.ok) {
                    throw new Error('Не удалось загрузить категорию портфолио');
                }
                const data: PortfolioItem[] = await response.json();
                setItems(data);
            } catch (err) {
                console.error('Ошибка:', err);
                setError('Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolioCategory();

    }, [category]);

    if (loading) return <div className={styles.loading}>Загрузка работ...</div>;
    if (error) return <div className={styles.error}>{error}</div>; 
    if (!items.length) return <p className={styles.empty}>Работ в категории "{category}" пока нет</p>;

    return (
        <div className={styles.grid}>
            {items.map(item => (
                <PortfolioCard key={item.id} item={item} />
            ))}
        </div>
    );
}