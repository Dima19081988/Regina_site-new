const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const checkAuth = async (): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/api/auth/check`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.ok;
};
