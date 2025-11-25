import type { PortfolioItem } from '../../../types';
import styles from './PortfolioCard.module.css';
import { Link } from 'react-router-dom';

export interface PortfolioCardProps {
  item: PortfolioItem;
}

export default function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <Link to={`/portfolio/${item.id}`} className={styles.cardLink}>
      <div className="card">
        <img
          src={item.image_url}
          alt={item.title || 'Работа'}
          className="card-image"
          loading="lazy"
        />
        <div className="card-content">
          <h2 className={styles.title}>{item.title}</h2>
          {item.description && <p className={styles.description}>{item.description}</p>}
          {item.category && <span className={styles.category}>{item.category}</span>}
        </div>
      </div>
    </Link>
  );
}
