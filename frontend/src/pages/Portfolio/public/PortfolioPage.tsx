import type { PortfolioItem } from '../../../types';
import { useState, useEffect } from 'react';
import PortfolioCard from '../../../components/Portfolio/PortfolioCard/PortfolioCard';
import styles from './PortfolioPage.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/portfolio`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить портфолио');
        }
        const data: PortfolioItem[] = await response.json();
        setPortfolio(data);
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Ошибка загрузки');
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
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Портфолио</h1>
      {portfolio.length === 0 ? (
        <p className={styles.emptyMessage}>Пока нет работ в портфолио.</p>
      ) : (
        <div className={styles.cardGrid}>
          {portfolio.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
