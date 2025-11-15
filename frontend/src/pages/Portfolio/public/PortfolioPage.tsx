import type { PortfolioItem } from "../../../types";
import { useState, useEffect } from "react";
import PortfolioCard from "../../../components/Portfolio/PortfolioCard/PortfolioCard";
import styles from './PortfolioPage.module.css';

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolio = async() => {
            try {
                const response = await fetch('http://localhost:3000/api/portfolio');
                if (!response.ok) {
                    throw new Error('Не удалось загрузить портфолио');
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
        return <div className="page-container">Загрузка портфолио...</div>;
    }

    if (error) {
        return <div className="page-container">Ошибка загрузки: {error}</div>;
    }

    return (
        <div className={styles['page-container']}>
            <h1 className={styles['page-title']}>Портфолио</h1>
            {portfolio.length === 0 ? (
                <p>Пока нет работ в портфолио.</p>
            ) : (
                <div className={styles['portfolio-grid']}>
                    {portfolio.map((item) => (
                        <PortfolioCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}