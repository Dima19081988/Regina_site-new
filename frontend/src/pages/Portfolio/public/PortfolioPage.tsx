import type { PortfolioItem } from '../../../types';
import { useState, useEffect } from 'react';
import PortfolioCard from '../../../components/Portfolio/PortfolioCard/PortfolioCard';
import { pluralizePortfolio } from '../../../utils/pluralize';
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

  const groupedPortfolio = portfolio.reduce((acc, item) => {
    const category = item.category || 'Другие категории';
    if(!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, PortfolioItem[]>);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Портфолио</h1>
      {Object.keys(groupedPortfolio).length === 0 ? (
        <p className={styles.emptyMessage}>Пока нет работ в портфолио.</p>
      ) : (
        <>
          {Object.entries(groupedPortfolio).map(([category, items]) => (
            <section key={category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>
                {category} ({items.length} {pluralizePortfolio(items.length)})
              </h2>
              <div className={styles.cardGrid}>
                {items.map((item) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
