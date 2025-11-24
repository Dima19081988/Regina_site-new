import type { PortfolioItem } from '../../../types';
import styles from './PortfolioDetail.module.css';

export interface PortfolioDetailProps {
  item: PortfolioItem;
}

export default function PortfolioDetail({ item }: PortfolioDetailProps) {
  return (
    <div className={styles.container}>
      <img src={item.image_url} alt={item.title || 'Работа'} className={styles.image} />
      <h1 className={styles.title}>{item.title}</h1>
      {item.description && <p className={styles.description}>{item.description}</p>}
      {item.category && <span className={styles.category}>{item.category}</span>}
    </div>
  );
}
