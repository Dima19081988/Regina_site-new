import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express'; 
import { db } from './config/db';
import appointmentsRouter from './routes/appointments.js';
import notesRouter from './routes/notes.js';
import portfolioRouter from './routes/portfolio.js';
import filesRouter from './routes/files.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 час
    },
  })
);

app.use('/api/appointments', appointmentsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/files', filesRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ message: '✅ Backend is running!' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

console.log('✅ Routers connected: appointments, notes, portfolio, files');

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  try {
    await db.connect();
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ DB Error:', err);
  }
});
