import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PortfolioItem } from '../../../types';
import PortfolioDetail from '../../../components/Portfolio/PortfolioDetail/PortfolioDetail';
import styles from './PortfolioDetailPageAdmin.module.css';

export default function PortfolioDetailPageAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/admin/portfolio');
      return;
    }

    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/portfolio/${id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Работа не найдена');
        }
        const data: PortfolioItem = await response.json();
        setItem(data);
      } catch (err) {
        console.error('Ошибка:', err);
        alert('Не удалось загрузить работу');
        navigate('/admin/portfolio');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm('Действительно удалить работу')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/portfolio/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Работа удалена');
        navigate('/admin/portfolio');
      } else {
        alert('');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка подключения к серверу');
    }
  };

  const handleEdit = () => {
    navigate(`/admin/portfolio/${id}/edit`);
  };

  if (loading) return <div className={styles.container}>Загрузка...</div>;
  if (!item) return null;

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button onClick={handleEdit} className={styles.editButton}>
          Редактировать
        </button>
        <button onClick={handleDelete} className={styles.deleteButton}>
          Удалить
        </button>
        <button onClick={() => navigate('/admin/portfolio')} className={styles.backButton}>
          Назад
        </button>
      </div>
      {item ? (
        <PortfolioDetail item={item} />
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
}
