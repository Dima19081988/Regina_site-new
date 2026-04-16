import { Link } from 'react-router-dom';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  showAddButton?: boolean;
  onAddClick?: () => void;
  showBackButton?: boolean; 
}

export default function AdminLayout({
  title,
  children,
  showAddButton = false,
  onAddClick,
  showBackButton = true,
}: AdminLayoutProps) {
  return (
    <div className={styles['admin-layout']}>
      <div className={styles.header}>
        {showBackButton && (
          <Link to="/admin/" className={styles['back-button']}>
            ← Назад
          </Link>
        )}
        <h1 className={styles.title}>{title}</h1>
        {showAddButton && (
          <button onClick={onAddClick} className={styles['add-button']}>
            + Добавить
          </button>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
