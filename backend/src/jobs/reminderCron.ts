import cron from 'node-cron';
import { db } from '../config/db';
import { sendTelegramMessage } from '../services/telegramService';


export const startReminderCron = () => {
    cron.schedule('0 19 * * *', async () => {
        console.log('Cron ping:', new Date().toISOString());
        try {
            console.log('Cron started:', new Date().toISOString());

        const result = await db.query(`
            SELECT id, client_name, service, appointment_time, price
            FROM appointments
            WHERE appointment_time >= date_trunc('day', now()) + interval '1 day'
            AND appointment_time < date_trunc('day', now()) + interval '2 day'
            ORDER BY appointment_time ASC
        `);

        console.log('Tomorrow appointments found:', result.rows.length);

        if (result.rows.length === 0) {
            await sendTelegramMessage('📅 Завтра записей нет.');
            return;
        }

        const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
            timeZone: 'Europe/Moscow',
            day: 'numeric',
            month: 'long',
        });

        const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
            timeZone: 'Europe/Moscow',
            hour: '2-digit',
            minute: '2-digit',
        });

        const firstDate = dateFormatter.format(
            new Date(result.rows[0].appointment_time)
        );

        let message = `🔔 <b>Завтра ${firstDate}</b>\n`;
        message += `📋 Всего записей: ${result.rows.length}\n\n`;

        result.rows.forEach((a, index) => {
            const time = timeFormatter.format(new Date(a.appointment_time));
            message += `${index + 1}. 🕐 ${time} — ${a.service}`;
            if (a.client_name) message += `\n    👤 ${a.client_name}`;
            if (a.price) message += `\n    💰 ${Number(a.price).toLocaleString('ru-RU')} ₽`;
            message += '\n\n';
        });

        await sendTelegramMessage(message);

        } catch (error) {
            console.error('Cron error:', error);
        }
    });
}