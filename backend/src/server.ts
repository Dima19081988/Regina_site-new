import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db';
import appointmentsRouter from './routes/appointments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentsRouter);
console.log('✅ Appointments router connected');

app.get('/', (req, res) => {
  res.json({ message: '✅ Backend is running!' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  try {
    await db.connect();
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ DB Error:', err);
  }
});