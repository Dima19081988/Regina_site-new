import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { pluralize } from "../../utils/pluralize";
import styles from './AdminHomePage.module.css';

export default function AdminHomepage() {
    const navigate = useNavigate();

    const [todayAppointments, setTodayAppointments] = useState<number>(0);
    const [fileCount, setFilesCount] = useState<number>(0);
    const [portfolioCount, setPortfolioCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const appointmentsRes = await fetch('http://localhost:3000/api/appointments/today', {
                    credentials: 'include',
                });
                const appointments = await appointmentsRes.json();
                setTodayAppointments(appointments.length);

                const filesRes = await fetch('http://localhost:3000/api/files', {
                    credentials:'include',
                });
                const files = await filesRes.json();
                setFilesCount(files.length);

                const portfolioRes = await fetch('http://localhost:3000/api/portfolio', {
                    credentials: 'include',
                })
                const portfolio = await portfolioRes.json();
                setPortfolioCount(portfolio.length);
            } catch (err) {
                console.error('Ошибка загрузки статистики:', err);
            } finally {
                setLoading(false);
            }
        }
        loadData()
    }, []);

    if (loading) return <div className={styles.hero}>Загрузка...</div>;

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
                <h1 className={styles.title}>Сделай выбор</h1>
                <button onClick={handleLogout} className={styles['logout-button']}>
                    Выйти
                </button>
            </header>
            <nav className={styles.nav}>
                <ul>
                    <li><Link to="/admin/portfolio" className={styles['nav-link']}>Портфолио</Link></li>
                    <li><Link to="/admin/pricelist" className={styles['nav-link']}>Прайслист</Link></li>
                    <li><Link to="/admin/files" className={styles['nav-link']}>Файлы</Link></li>
                    <li><Link to="/admin/notes" className={styles['nav-link']}>Заметки</Link></li>
                    <li><Link to="/admin/appointments" className={styles['nav-link']}>Записи</Link></li>
                </ul>
            </nav>
            <div className={styles.stats}>
                <div className={styles['stat-item']}>Сегодня: {todayAppointments} {pluralize(todayAppointments)}</div>
                <div className={styles['stat-item']}>Файлов: {fileCount}</div>
                <div className={styles['stat-item']}>Записей в Портфолио: {portfolioCount}</div>
            </div>
        </div>
    );
}