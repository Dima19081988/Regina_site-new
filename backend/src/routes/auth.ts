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

  try {
    const isValid = await bcrypt.compare(password, hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) {
        console.error('Не удалось обновить сессию после входа:', sessionError);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      req.session.isAdmin = true;

      return res.json({ success: true });
    })
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Ошибка при выходе:', error);
      return res.status(500).json({ error: 'Ошибка при выходе' });
    }

    res.clearCookie('regina_admin_sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({ success: true });
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
