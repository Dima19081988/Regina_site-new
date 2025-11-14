import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { db } from './config/db';
import appointmentsRouter from './routes/appointments.js';
import notesRouter from './routes/notes.js';
import portfolioRouter from './routes/portfolio.js';
import filesRouter from './routes/files.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true если используешь HTTPS (в продакшене)
    maxAge: 1000 * 60 * 60 // 1 час
  }
}));

app.use('/api/appointments', appointmentsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/files', filesRouter);
app.use('/api/auth', authRouter);

app.use((err: any, req: any, res: any, next: any) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Файл слишком большой. Максимум — 5 МБ.' });
  }
  if (err.message && err.message.includes('Разрешены только')) {
    return res.status(400).json({ error: err.message });
  }
  console.error('Multer error:', err);
  res.status(500).json({ error: 'Ошибка при загрузке файла' });
})
console.log('✅ Routers connected: appointments, notes, portfolio, files');

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