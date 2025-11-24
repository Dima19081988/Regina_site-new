import { Router } from 'express';
import * as bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Пароль обязателен' });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error('ADMIN_PASSWORD_HASH не задан в .env');
    return res.status(500).json({ error: 'Ошибка сервера' });
  }

  const isValid = await bcrypt.compare(password, hash);
  if (isValid) {
    req.session.isAdmin = true;
    return res.json({ success: true });
  } else {
    return res.status(401).json({ error: 'Неверный пароль' });
  }
});

router.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при выходе' });
    }
    res.json({ success: true });
  });
});

router.get('/check', (req, res) => {
  if (req.session?.isAdmin) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;
