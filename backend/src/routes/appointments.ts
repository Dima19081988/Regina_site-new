import { Router } from 'express';
import {
  getAllAppointments,
  createAppointment,
  getAppointmentById,
  getAllAppointmentByDate,
  getAppointmentCountsByMonth,
  updateAppointment,
  deleteAppointment,
} from '../services/appointmentService';
import { Appointment } from '../models/types/Apointments';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

//общий список
router.get('/', requireAuth, async (req, res) => {
  try {
    const appointments: Appointment[] = await getAllAppointments();
    res.json(appointments);
  } catch (err) {
    console.error('Ошибка при получении записей: ', err);
    res.status(500).json({ error: 'Не удалось загрузить расписание' });
  }
});

//для reminders
router.get('/today', requireAuth, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const appointments = await getAllAppointmentByDate(today);
    res.json(appointments);
  } catch (err) {
    console.error('Ошибка загрузки записей на сегодня:', err);
    res.status(500).json({ error: 'Не удалось загрузить записи' });
  }
});

router.get('/tomorrow', requireAuth, async (req, res) => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  try {
    const appointments = await getAllAppointmentByDate(tomorrow);
    res.json(appointments);
  } catch (err) {
    console.error('Ошибка загрузки записей на завтра:', err);
    res.status(500).json({ error: 'Не удалось загрузить записи' });
  }
});

router.get('/after-tomorrow', requireAuth, async (req, res) => {
  const afterTomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  try {
    const appointments = await getAllAppointmentByDate(afterTomorrow);
    res.json(appointments);
  } catch (err) {
    console.error('Ошибка загрузки записей на послезавтра:', err);
    res.status(500).json({ error: 'Не удалось загрузить записи' });
  }
});

//по ID
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const appointmentId = Number(id);
  if (isNaN(appointmentId) || appointmentId <= 0) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }

  try {
    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Запись по ID не найдена' });
    }
    res.json(appointment);
  } catch (err) {
    console.error('Ошибка получения записи по ID: ', err);
    res.status(500).json({ error: 'Не удалось получить запись по ID' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const appointmentId = Number(id);
  if (isNaN(appointmentId) || appointmentId <= 0) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }

  try {
    const appointment = await updateAppointment(appointmentId, req.body);
    if (!appointment) {
      return res.status(404).json({ error: 'Запись по ID не найдена' });
    }
    res.json(appointment);
  } catch (err) {
    console.error('Ошибка обновления записи: ', err);
    res.status(500).json({ error: 'Не удалось обновить запись' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const appointmentId = Number(id);
  if (isNaN(appointmentId) || appointmentId <= 0) {
    return res.status(400).json({ error: 'ID должен быть числом' });
  }

  try {
    const deleted = await deleteAppointment(appointmentId);
    if (!deleted) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Ошибка при удалении записи: ', err);
    res.status(500).json({ error: 'Не удалось удалить запись' });
  }
});

//остальные
router.get('/date/:date', requireAuth, async (req, res) => {
  const { date } = req.params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Неверный формат даты. Используйте ГГГГ-ММ-ДД' });
  }
  try {
    const appointments = await getAllAppointmentByDate(date);
    res.json(appointments);
  } catch (err) {
    console.error('Ошибка:', err);
    res.status(500).json({ error: 'Не удалось загрузить записи' });
  }
});

router.get('/counts/:year/:month', requireAuth, async (req, res) => {
  const { year, month } = req.params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({ error: 'Год и месяц должны быть числами (месяц: 1–12)' });
  }

  try {
    const counts = await getAppointmentCountsByMonth(yearNum, monthNum);
    res.json(counts);
  } catch (err) {
    console.error('Ошибка загрузки статистики:', err);
    res.status(500).json({ error: 'Не удалось загрузить данные' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { client_name, service, appointment_time, price } = req.body;
  if (!client_name || !service || !appointment_time) {
    return res
      .status(400)
      .json({ error: 'Поля client_name, service, appointment_time обязательны' });
  }

  try {
    const appointment: Appointment = await createAppointment({
      client_name,
      service,
      appointment_time,
      price: price ? parseFloat(price) : null,
    });
    res.json(appointment);
  } catch (err) {
    console.error('Ошибка создания записи: ', err);
    res.status(500).json({ error: 'Не удалось создать запись' });
  }
});

export default router;
