import { Link } from 'react-router-dom';
import styles from './PublicLayout.module.css';
import type React from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Regina — косметолог
        </Link>
        <nav className={styles.nav}>
          <Link to="/promotions" className={styles.navLink}>
            !!!Акции!!!
          </Link>
          <Link to="/about" className={styles.navLink}>
            О себе
          </Link>
          <Link to="/portfolio" className={styles.navLink}>
            Портфолио
          </Link>
          <Link to="/pricelist" className={styles.navLink}>
            Прайслист
          </Link>
          <a href="/contacts" className={styles.navLink}>
            Контакты
          </a>
          <Link to="/admin/login" className={styles.adminLink}>
            Вход для врача
          </Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Regina. Все права защищены.</p>
      </footer>
    </div>
  );
}
