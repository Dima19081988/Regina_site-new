import { useParams, useLocation } from 'react-router-dom';
import { trends } from '../../data/Trends';
import PortfolioSection from './PortfolioSection';
import styles from './TrendDetailPage.module.css';
import ArticlesSection from './ArticlesSection';
import FAQSection from './FAQSection';

export default function TrendDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const trend = trends.find((t) => t.slug === slug);
  const location = useLocation();

  if (!trend) {
    return <div className={styles.notFound}>Тренд не найден</div>;
  }

  const category = location.state?.category || trend.category;

  return (
    <div className={styles.details}>
      <img
        src={trend.image}
        alt={trend.title}
        className={styles.detailImage}
      />
      <h1>{trend.title}</h1>
      <div className={styles.content}>
        <p>{trend.fullDescription}</p>
        {trend.link && (
          <a href={trend.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Подробнее на сайте производителя
          </a>
        )}
      </div>

      <section>
        <h2>Примеры работ ({category})</h2>
        <PortfolioSection category={category} />
      </section>

      <ArticlesSection category={category} />
      <FAQSection category={category} />

      <a href="/" className={styles.backLink}>
        Назад к трендам
      </a>
    </div>
  );
}
