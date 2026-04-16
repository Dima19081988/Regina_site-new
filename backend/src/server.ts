import express from 'express';
import session from 'express-session';
import cors from 'cors';
import rateLimit from 'express-rate-limit'; 
import { Request, Response, NextFunction } from 'express'; 
import appointmentsRouter from './routes/appointments.js';
import notesRouter from './routes/notes.js';
import { db } from './config/db.js';
import portfolioRouter from './routes/portfolio.js';
import filesRouter from './routes/files.js';
import authRouter from './routes/auth.js';
import categoriesRouter from './routes/categories.js'
import serviceRouter from './routes/services.js';
import serviceImagesRouter from './routes/serviceImages.js';
import { startReminderCron } from './jobs/reminderCron.js';

(async () => {
  try {
    const res = await db.query('SELECT current_database(), current_schema()');
    console.log('DB info:', res.rows[0]);
  } catch (e) {
    console.error('DB info error:', e);
  }
})();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://regina-cosmetology.ru',
  'https://regina-cosmetology.ru',
];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,                  
  standardHeaders: true,
  legacyHeaders: false,
});

const checkLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,                  
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 час
    },
  })
);

app.use('/api/appointments', appointmentsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/files', filesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/services', serviceRouter);
app.use('/api/service-images', serviceImagesRouter);
app.use('/api/auth/check', checkLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/logout', authLimiter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ message: '✅ Backend is running!' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);

  const message = err instanceof Error ? err.message : 'Internal Server Error';

  if (!res.headersSent) {
    res.status(500).json({ error: message });
  }
});

console.log('✅ Routers connected: appointments, notes, portfolio, files');

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('✅ PostgreSQL pool ready');
  startReminderCron();
});
