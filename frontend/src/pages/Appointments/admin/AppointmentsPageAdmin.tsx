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
      const [todayRes, tomorrowRes, afterTomorrowRes] = await Promise.all([
        fetch(`${API_BASE}/api/appointments/today`, { credentials: 'include' }),
        fetch(`${API_BASE}/api/appointments/tomorrow`, { credentials: 'include' }),
        fetch(`${API_BASE}/api/appointments/after-tomorrow`, { credentials: 'include' }),
      ]);
      setToday(await todayRes.json());
      setTomorrow(await tomorrowRes.json());
      setAfterTomorrow(await afterTomorrowRes.json());
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
              📅<strong>Завтра</strong> у вас {afterTomorrow.length}{' '}
              {pluralize(afterTomorrow.length)}.
            </div>
          )}
        </div>
      )}
      <Calendar />
    </div>
  );
}
