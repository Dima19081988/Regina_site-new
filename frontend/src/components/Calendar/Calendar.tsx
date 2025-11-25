import { useState, useEffect } from 'react';
import DayAppointmentsModal from '../Appointments/DayAppointmentsModal';
import styles from './Calendar.module.css';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? 'list' : 'grid');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadCounts = async () => {
      const response = await fetch(
        `http://localhost:3000/api/appointments/counts/${year}/${month + 1}`,
        { credentials: 'include' }
      );
      if (response.ok) {
        const data = await response.json();
        setCounts(data);
      }
    };
    loadCounts();
  }, [year, month]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  //генерация календаря
  const getDaysInMonth = () => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    //коррекция: понедельник первый день
    const startDayAdjusted = startDay === 0 ? 6 : startDay - 1;

    for (let i = 0; i < startDayAdjusted; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(day);
    }
    return days;
  };

  const days = getDaysInMonth();

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(dateStr);
  };

  const renderGrid = () => (
    <div className={styles.daysGrid}>
      {days.map((day, index) => {
        if (day === null) {
          return <div key={index} className={styles.emptyDay}></div>
        }

        const localDate = new Date(year, month, day);
        const dayStr = localDate.toISOString().split('T')[0];
        const count = counts[dayStr] || 0;


        return (
          <div
            key={index}
            className={`${styles.day} ${count > 0 ? styles.hasAppointments : ''}`}
            onClick={() => handleDayClick(day)}
          >
            <div className={styles.dayNumber}>{day}</div>
            {count > 0 && <div className={styles.badge}>{count}</div>}
          </div>
        );
      })}
    </div>
  );

  const renderList = () => (
    <div className={styles.appointmentList}>
      {days.map((day, index) => {
        if (day === null) return null;

        const localDate = new Date(year, month, day);
        const dateStr = localDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const count = counts[dateStr] || 0;
        
        const dayOfWeek = localDate.toLocaleDateString('ru-RU', { weekday: 'short' });

        return (
          <div
            key={index}
            className={styles.listItem}
            onClick={() => handleDayClick(day)}
          >
            <div className={styles.listItemHeader}>
              <div className={styles.listDayInfo}>
                <span className={styles.listDay}>{day}</span>
                <span className={styles.listWeekday}>{dayOfWeek}</span>
              </div>
              {count > 0 && <div className={styles.listBadge}>{count}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.calendar}>
      {/* Шапка: навигация */}
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navButton}>
          ❮
        </button>
        <h2 className={styles.monthTitle}>
          {currentDate.toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className={styles.navButton}>
          ❯
        </button>
      </div>
      {/* Дни недели */}
      {viewMode === 'grid' && (
        <div className={styles.weekDays}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className={styles.weekdays}>
              {day}
            </div>
          ))}
        </div>
      )}

      {viewMode === 'grid' ? renderGrid() : renderList()}

      {selectedDay && (
        <DayAppointmentsModal date={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </div>
  );
}
