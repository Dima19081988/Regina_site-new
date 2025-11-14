import type { PortfolioItem } from '../../types';
import styles from './PortfolioCard.module.css';

export interface PortfolioCardProps {
    item: PortfolioItem;
}

export default function PortfolioCard ({ item } : PortfolioCardProps) {
    return (
        <div className={styles.card}>
            <img 
                src={item.image_url} 
                alt={item.title || 'Работа'}
                className={styles.image}
                loading="lazy"
            />
            <div className={styles.content}>
                <h2 className={styles.title}>{item.title}</h2>
                {item.description && (
                    <p className={styles.description}>{item.description}</p>
                )}
                {item.category && (
                    <span className={styles.category}>{item.category}</span>
                )}
            </div>
        </div>
    );
}