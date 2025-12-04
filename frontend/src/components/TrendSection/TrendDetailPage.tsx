import { useParams } from 'react-router-dom';
import { trends } from '../../data/Trends';
import styles from './TrendDetailPage.module.css';

export default function TrendDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const trend = trends.find((t) => t.slug === slug);

  if (!trend) {
    return <div className={styles.notFound}>Тренд не найден</div>;
  }

  return (
    <div className={styles.details}>
      <h1>{trend.title}</h1>
      <div className={styles.content}>
        <p>{trend.fullDescription}</p>
        {trend.link && (
          <a href={trend.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Подробнее на сайте производителя
          </a>
        )}
      </div>
      <a href="/" className={styles.backLink}>
        Назад к трендам
      </a>
    </div>
  );
}
