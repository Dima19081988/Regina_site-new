import { Router } from "express";
import { getAllAppointments, createAppointment } from "../services/appointmentService";
import { Appointment } from "../models/types/Apointments";


const router = Router();

router.get('/', async(req, res) => {
    try {
        const appointments: Appointment[] = await getAllAppointments();
        res.json(appointments);
    } catch (err) {
        console.error('Ошибка при получении записей: ', err);
        res.status(500).json({ error: 'Не удалось загрузить расписание' })
    }
});

router.post('/', async(req, res) => {
    const { client_name, service, appointment_time, price } = req.body;

    if(!client_name || !service || !appointment_time) {
        return res.status(400).json({ error: 'Поля client_name, service, appointment_time обязательны' })
    }
    try {
        const appointment: Appointment = await createAppointment({ client_name, service, appointment_time, price });
        res.json(appointment);
    } catch (err) {
        console.error('Ошибка создания записи: ', err);
        res.status(500).json({ error: 'Не удалось создать запись' });
    }
})

export default router;