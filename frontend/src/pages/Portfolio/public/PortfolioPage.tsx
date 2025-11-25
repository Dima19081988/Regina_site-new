import type { PortfolioItem } from '../../../types';
import { useState, useEffect } from 'react';
import PortfolioCard from '../../../components/Portfolio/PortfolioCard/PortfolioCard';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/portfolio');
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
    <div className="page-container">
      <h1 className="page-title">Портфолио</h1>
      {portfolio.length === 0 ? (
        <p>Пока нет работ в портфолио.</p>
      ) : (
        <div className="card-grid">
          {portfolio.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
