import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Service, Category } from "../../../types";
import { getServices } from "../../../api/servicesApi";
import { getCategories } from "../../../api/categoriesApi";
import styles from './ServicesPage.module.css';

export default function ServicesPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error('Ошибка загрузки категорий:', err));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        if (initialLoading) {
          setInitialLoading(true);
        } else {
          setFiltering(true);
        }
        const data = await getServices(activeCategoryId ?? undefined);
        setServices(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Не удалось загрузить услуги');
      } finally {
        setInitialLoading(false);
        setFiltering(false);
      }
    };
    load();
  }, [activeCategoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredServices = searchQuery.trim()
    ? services.filter((s) => 
       s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       s.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services;

  const handleCategoryClick = (id: number | null) => {
    setActiveCategoryId(id);
    setSearchQuery('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Услуги</h1>

      {/* поиск */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск по названию или описанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className={styles.searchClear}
            onClick={() => setSearchQuery('')}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>

      {/* фильтр по категориям */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeCategoryId === null ? styles.filterBtnActive : ''}`}
          onClick={() => handleCategoryClick(null)}
        >
          Все
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`${styles.filterBtn} ${activeCategoryId === c.id ? styles.filterBtnActive : ''}`}
            onClick={() => handleCategoryClick(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {initialLoading && <div className={styles.state}>Загрузка...</div>}
      {error && <div className={styles.state}>{error}</div>}

      {!initialLoading && !error && (
        <div className={`${styles.grid} ${filtering ? styles.gridFiltering : ''}`}>
          {filteredServices.length === 0 ? (
            <div className={styles.state}>
              {searchQuery
                ? `По запросу «${searchQuery}» ничего не найдено`
                : 'Услуги в этой категории пока не добавлены'}
            </div>
          ) : (
            filteredServices.map((service, index) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className={styles.card}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className={styles.cardImage}
                  />
                )}
                <h2 className={styles.cardTitle}>{service.title}</h2>
                {service.base_price && (
                  <div className={styles.cardPrice}>
                    от {service.base_price.toLocaleString('ru-RU')} ₽
                  </div>
                )}
                {service.short_description && (
                  <p className={styles.cardShort}>{service.short_description}</p>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}