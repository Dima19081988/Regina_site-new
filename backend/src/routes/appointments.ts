import { Router } from "express";
import { getAllAppointments, createAppointment, getAppointmentById, updateAppointment, deleteAppointment } from "../services/appointmentService";
import { Appointment } from "../models/types/Apointments";

const router = Router();

router.get('/', async(req, res) => {
    try {
        const appointments: Appointment[] = await getAllAppointments();
        res.json(appointments);
    } catch (err) {
        console.error('Ошибка при получении записей: ', err);
        res.status(500).json({ error: 'Не удалось загрузить расписание' });
    }
});

router.post('/', async(req, res) => {
    const { client_name, service, appointment_time, price } = req.body;
    if(!client_name || !service || !appointment_time) {
        return res.status(400).json({ error: 'Поля client_name, service, appointment_time обязательны' });
    }

    try {
        const appointment: Appointment = await createAppointment({ client_name, service, appointment_time, price });
        res.json(appointment);
    } catch (err) {
        console.error('Ошибка создания записи: ', err);
        res.status(500).json({ error: 'Не удалось создать запись' });
    }
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const appointmentId = Number(id);
    if(isNaN(appointmentId) || appointmentId <= 0) {
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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const appointmentId = Number(id);
    if(isNaN(appointmentId) || appointmentId <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const appointment = await updateAppointment(appointmentId, req.body);
        if(!appointment) {
            return res.status(404).json({ error: 'Запись по ID не найдена' });
        }
        res.json(appointment);
    } catch (err) {
        console.error('Ошибка обновления записи: ', err);
        res.status(500).json({ error: 'Не удалось обновить запись' });
    }
});

router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    const appointmentId = Number(id);
    if(isNaN(appointmentId) || appointmentId <= 0) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    try {
        const deleted = await deleteAppointment(appointmentId);
        if(!deleted) {
            return res.status(404).json({ error: 'Запись не найдена' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Ошибка при удалении записи: ', err);
        res.status(500).json({ error: 'Не удалось удалить запись' });
    }
});


export default router;