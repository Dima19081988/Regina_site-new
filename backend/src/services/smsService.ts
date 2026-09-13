const APIKEY = process.env.SMSPILOT_APIKEY;
const PHONE = process.env.SMSPILOT_PHONE;

export const sendSms = async (message: string): Promise<void> => {
  if (!APIKEY || !PHONE) {
    console.warn('SMS не настроен');
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const url = `https://smspilot.ru/api.php?` +
      `send=${encodeURIComponent(message)}` +
      `&to=${PHONE}` +
      `&from=INFORM` +
      `&apikey=${APIKEY}` +
      `&format=json` +
      `&charset=utf-8`;


    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await res.json();

    if (data.error) {
      console.error('Ошибка SMS:', data.error.code, data.error.description_ru);
    } else {
      console.log('SMS отправлено, id:', data.server_packet_id);
    }
  } catch (err) {
    clearTimeout(timeout);
    console.error('Ошибка подключения к smspilot:', err);
  }
};