import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import type { Service, Category } from '../../../types';
import { getServices } from '../../../api/servicesApi';
import { getCategories } from '../../../api/categoriesApi';
import ServicesTab from './ServicesTab';
import CategoriesTab from './CategoriesTab';
import styles from './AdminServicesPage.module.css';

type Tab = 'services' | 'categories';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('services');

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  return (
    <AdminLayout title="Услуги и категории">
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'services' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Услуги
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'categories' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Категории
        </button>
      </div>

      {activeTab === 'services' && (
        <ServicesTab
          services={services}
          categories={categories}
          loading={loading}
          error={error}
          onReload={loadServices}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab
          categories={categories}
          onReload={loadCategories}
        />
      )}
    </AdminLayout>
  );
}