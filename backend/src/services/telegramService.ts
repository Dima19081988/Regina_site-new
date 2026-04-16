const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const sendTelegramMessage = async (text: string): Promise<void> => {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram не настроен — BOT_TOKEN или CHAT_ID отсутствуют');
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.json();
      console.error('Ошибка отправки в Telegram:', err);
    }
  } catch (err) {
    clearTimeout(timeout);
    console.error('Ошибка подключения к Telegram:', err);
  }
};