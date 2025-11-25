import { Link, useNavigate } from "react-router-dom";
import styles from './Homepage.module.css';

export default function AdminHomepage() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/');
            } else {
                alert('Не удалось выйти');
            }
        } catch (err) {
            console.error('Ошибка выхода:', err);
            alert('Ошибка подключения');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Начальная страница админки</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Выйти
                </button>
            </header>
            <nav className={styles.nav}>
                <ul>
                    <li><Link to="/admin/portfolio">Портфолио</Link></li>
                    <li><Link to="/admin/pricelist">Прайслист</Link></li>
                    <li><Link to="/admin/files">Файлы</Link></li>
                    <li><Link to="/admin/notes">Заметки</Link></li>
                    <li><Link to="/admin/appointments">Записи</Link></li>
                </ul>
            </nav>
        </div>
    );
}