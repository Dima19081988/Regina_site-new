import cron from 'node-cron';
import { deleteExpiredAppointments } from '../services/appointmentService';

const RETENTION_DAYS = 90;

export const startAppointmentCleanupCron = () => {
    cron.schedule(
        '15 3 * * *',
        async () => {
            try {
                const deletedCount = await deleteExpiredAppointments(RETENTION_DAYS);

                console.log(
                    `Очистка старых записей завершена: удалено ${deletedCount}`
                );
            } catch (error) {
                console.error('Ошибка автоматической очистки записей:', error);
            }
        },
        {
            timezone: 'Europe/Moscow',
        }
    );
    
    console.log('🧹 Очистка записей настроена: ежедневно в 03:15 (МСК)');
};