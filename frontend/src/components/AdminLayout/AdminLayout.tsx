import { Link } from "react-router-dom";
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
    title: string;
    children: React.ReactNode;
    showAddButton?: boolean;
    onAddClick?: () => void;
};

export default function AdminLayout({ 
    title, 
    children,
    showAddButton = false,
    onAddClick,
 }: AdminLayoutProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/admin/" className={styles.backButton}>
                    ← Назад
                </Link>
                <h1>{title}</h1>
                {showAddButton && (
                    <button onClick={onAddClick} className={styles.addButton}>
                        + Добавить
                    </button>
                )}
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}