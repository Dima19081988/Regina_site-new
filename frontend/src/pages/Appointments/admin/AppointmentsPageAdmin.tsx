import { useState, useEffect } from 'react';
import type { Appointment } from '../../../types';
import Calendar from '../../../components/Calendar/Calendar';
import { pluralize } from '../../../utils/pluralize';
import styles from './AppointmentsPageAdmin.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AppointmentsPageAdmin() {
  const [today, setToday] = useState<Appointment[]>([]);
  const [tomorrow, setTomorrow] = useState<Appointment[]>([]);
  const [afterTomorrow, setAfterTomorrow] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const [todayRes, tomorrowRes, afterTomorrowRes] = await Promise.all([
          fetch(`${API_BASE}/api/appointments/today`, { credentials: 'include' }),
          fetch(`${API_BASE}/api/appointments/tomorrow`, { credentials: 'include' }),
          fetch(`${API_BASE}/api/appointments/after-tomorrow`, { credentials: 'include' }),
        ]);

        if (todayRes.ok) setToday(await todayRes.json());
        if (tomorrowRes.ok) setTomorrow(await tomorrowRes.json());
        if (afterTomorrowRes.ok) setAfterTomorrow(await afterTomorrowRes.json());
      } catch (err) {
        console.error('Ошибка загрузки напоминаний:', err);
      }
    };
    loadReminders();
  }, []);

  return (
    <div className={styles['admin-appointments-page']}>
      <h1 className={styles['admin-appointments-page__title']}>Записи клиентов</h1>
      {(today.length > 0 || tomorrow.length > 0 || afterTomorrow.length > 0) && (
        <div className={styles.reminders}>
          {today.length > 0 && (
            <div className={`${styles.reminder} ${styles['reminder--today']}`}>
              ⚠️<strong>Сегодня</strong> у вас {today.length} {pluralize(today.length)}!
            </div>
          )}
          {tomorrow.length > 0 && (
            <div className={`${styles.reminder} ${styles['reminder--tomorrow']}`}>
              🔔<strong>Завтра</strong> у вас {tomorrow.length} {pluralize(tomorrow.length)}.
            </div>
          )}
          {afterTomorrow.length > 0 && (
            <div className={`${styles.reminder} ${styles['reminder--after-tomorrow']}`}>
              📅<strong>Послезавтра</strong> у вас {afterTomorrow.length}{' '}
              {pluralize(afterTomorrow.length)}.
            </div>
          )}
        </div>
      )}
      <Calendar />
    </div>
  );
}
