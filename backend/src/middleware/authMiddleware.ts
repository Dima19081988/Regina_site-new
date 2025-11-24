import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Требуется вход в систему' });
  }
};
