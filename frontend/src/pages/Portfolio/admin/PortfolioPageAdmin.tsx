import { useState, useEffect } from 'react';
import type { PortfolioItem } from '../../../types';
import styles from './PortfolioPageAdmin.module.css';
import PortfolioUploadForm from '../../../components/Portfolio/PortfolioUploadForm/PortfolioUploadForm';
import { pluralizePortfolio } from '../../../utils/pluralize';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function PortfolioPageAdmin() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/portfolio`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Нет доступа к портфолио');
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

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить работу?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setPortfolio((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Не удалось удалить работу');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения к серверу');
    }
  };

  if (loading) return <div className={styles.container}>Загрузка портфолио...</div>;
  if (error) return <div className={styles.container}>Ошибка загрузки: {error}</div>;

  const categories = Array.from(
    new Set(portfolio.map(item => item.category || null).filter((cat): cat is string => cat !== null))
  );

  const filteredPortfolio = filterCategory
    ? portfolio.filter(item => item.category === filterCategory)
    : portfolio;

  const groupedPortfolio = filteredPortfolio.reduce((acc, item) => {
    const category = item.category || 'Без категории';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, PortfolioItem[]>)

  return (
    <div className={styles.container}>
      <h1>Управление портфолио</h1>
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Фильтр по категории:</label>
        <div className={styles.filter}>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">📁 Все категории ({portfolio.length} {pluralizePortfolio(portfolio.length)})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({portfolio.filter(item => item.category === cat).length})
              </option>
            ))}
            <option value="Без категории">
              Без категории ({portfolio.filter(item => item.category).length})
            </option>
          </select>
        </div>
      </div>

      {<PortfolioUploadForm onUploadSuccess={fetchPortfolio} />}

      {filteredPortfolio.length === 0 ? (
        <p className={styles.emptyMessage}>
          {filterCategory
            ? `Нет работ в категории "${filterCategory}`
            : 'Нет работ в портфолио'
          }
        </p>
      ) : (
        <>
          {Object.entries(groupedPortfolio).map(([category, items]) => (
            <section key={category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>
                {category} ({items.length} {pluralizePortfolio(portfolio.length)})
              </h2>
              <div className={styles.grid}>
                {items.map((item) => (
                  <Link key={item.id} to={`/admin/portfolio/${item.id}`} className={styles.cardLink}>
                    <div className={styles.card}>
                      <img
                        src={item.image_url}
                        alt={item.title || 'Работа'}
                        className={styles.cardImage}
                      />
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        {item.category && (
                          <p className={styles.cardCategory}>Категория: {item.category}</p>
                        )}
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(item.id);
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
