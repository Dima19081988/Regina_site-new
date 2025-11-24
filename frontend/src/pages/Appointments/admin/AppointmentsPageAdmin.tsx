import { useState, useEffect } from 'react';
import type { Appointment } from '../../../types';
import Calendar from '../../../components/Calendar/Calendar';
import { pluralize } from '../../../utils/pluralize';
import './AppointmentsPageAdmin.module.css';

export default function AppointmentsPageAdmin() {
  const [today, setToday] = useState<Appointment[]>([]);
  const [tomorrow, setTomorrow] = useState<Appointment[]>([]);
  const [afterTomorrow, setAfterTomorrow] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadReminders = async () => {
      const [todayRes, tomorrowRes, afterTomorrowRes] = await Promise.all([
        fetch('http://localhost:3000/api/appointments/today', { credentials: 'include' }),
        fetch('http://localhost:3000/api/appointments/tomorrow', { credentials: 'include' }),
        fetch('http://localhost:3000/api/appointments/after-tomorrow', { credentials: 'include' }),
      ]);
      setToday(await todayRes.json());
      setTomorrow(await tomorrowRes.json());
      setAfterTomorrow(await afterTomorrowRes.json());
    };
    loadReminders();
  }, []);

  return (
    <div className="admin-appointments-page">
      <h1>Записи клиентов</h1>
      {(today.length > 0 || tomorrow.length > 0 || afterTomorrow.length > 0) && (
        <div className="reminders">
          {today.length > 0 && (
            <div className="reminder-today">
              ⚠️<strong>Сегодня</strong> у вас {today.length} {pluralize(today.length)}!
            </div>
          )}
          {tomorrow.length > 0 && (
            <div className="reminder-tomorrow">
              🔔<strong>Завтра</strong> у вас {tomorrow.length} {pluralize(tomorrow.length)}.
            </div>
          )}
          {afterTomorrow.length > 0 && (
            <div className="reminder-afterTomorrow">
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
