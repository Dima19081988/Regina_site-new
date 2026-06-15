import { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import styles from './AdminCertificatesPage.module.css';

function formatAmount(value: number) {
  return value.toLocaleString('ru-RU');
}

function centerX(
  text: string,
  font: { widthOfTextAtSize: (text: string, size: number) => number },
  size: number,
  pageWidth: number
) {
  const textWidth = font.widthOfTextAtSize(text, size);
  return (pageWidth - textWidth) / 2;
}

export default function AdminCertificatesPage() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGeneratePdf = async () => {
    const cleanAmount = Number(amount.replace(/\s/g, '').replace(',', '.'));

    if (!cleanAmount || cleanAmount <= 0) {
      alert('Введите корректную сумму сертификата');
      return;
    }

    try {
      setLoading(true);

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);

      const regularFontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then((res) =>
        res.arrayBuffer()
      );

      const boldFontBytes = await fetch('/fonts/OpenSans-Bold.ttf').then((res) =>
        res.arrayBuffer()
      );

      const fontRegular = await pdfDoc.embedFont(regularFontBytes);
      const fontBold = await pdfDoc.embedFont(boldFontBytes);

      const page = pdfDoc.addPage([842, 595]);
      const { width, height } = page.getSize();

      const primary = rgb(0.61, 0.35, 0.71);
      const primaryDark = rgb(0.38, 0.22, 0.47);
      const textColor = rgb(0.18, 0.18, 0.24);
      const lineColor = rgb(0.84, 0.76, 0.9);
      const bgImageBytes = await fetch('/images/bg-public.jpg').then((res) =>
        res.arrayBuffer()
      );

      const bgImage = await pdfDoc.embedJpg(bgImageBytes);

      page.drawImage(bgImage, {
        x: 0,
        y: 0,
        width,
        height,
      });

      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(1, 0.96, 0.97),
        opacity: 0.85,
      });

      page.drawRectangle({
        x: 28,
        y: 28,
        width: width - 56,
        height: height - 56,
        borderColor: primary,
        borderWidth: 2,
      });

      page.drawRectangle({
        x: 42,
        y: 42,
        width: width - 84,
        height: height - 84,
        borderColor: lineColor,
        borderWidth: 1,
      });

      const title = 'ПОДАРОЧНЫЙ СЕРТИФИКАТ';
      const subtitle = 'На косметологические услуги';
      const amountText = `${formatAmount(cleanAmount)} рублей`;
      const doctorLabel = 'Ваш косметолог';
      const doctorName = 'Регина Кузнецова';

      page.drawText(title, {
        x: centerX(title, fontBold, 24, width),
        y: height - 120,
        size: 24,
        font: fontBold,
        color: primaryDark,
      });

      page.drawLine({
        start: { x: 210, y: height - 140 },
        end: { x: width - 210, y: height - 140 },
        thickness: 1,
        color: lineColor,
      });

      page.drawText(subtitle, {
        x: centerX(subtitle, fontRegular, 16, width),
        y: height - 180,
        size: 16,
        font: fontRegular,
        color: textColor,
      });

      page.drawText(amountText, {
        x: centerX(amountText, fontBold, 30, width),
        y: height - 270,
        size: 30,
        font: fontBold,
        color: primaryDark,
      });

      if (recipient.trim()) {
        const recipientText = `Для ${recipient.trim()}`;
        page.drawText(recipientText, {
          x: centerX(recipientText, fontRegular, 30, width),
          y: height - 330,
          size: 30,
          font: fontRegular,
          color: textColor,
        });
      }

      page.drawText(doctorLabel, {
        x: centerX(doctorLabel, fontRegular, 16, width),
        y: height - 420,
        size: 16,
        font: fontRegular,
        color: textColor,
      });

      page.drawText(doctorName, {
        x: centerX(doctorName, fontBold, 22, width),
        y: height - 450,
        size: 22,
        font: fontBold,
        color: primaryDark,
      });

      const today = new Date().toLocaleDateString('ru-RU');
      const dateText = `Дата выдачи: ${today}`;

      page.drawText(dateText, {
        x: 70,
        y: 70,
        size: 12,
        font: fontRegular,
        color: textColor,
      });

      const pdfBytes = await pdfDoc.save();

      const arrayBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      ) as ArrayBuffer;

      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${cleanAmount}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Не удалось сформировать PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Создание подарочного сертификата</h2>
        <p className={styles.description}>
          Укажите сумму, при желании имя получателя, и скачайте готовый PDF.
        </p>

        <label className={styles.field}>
          <span>Сумма сертификата</span>
          <input
            type="number"
            min="1"
            step="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
          />
        </label>

        <label className={styles.field}>
          <span>Получатель, необязательно ("Для...")</span>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Например, Анне"
          />
        </label>

        <button
          type="button"
          className={styles.button}
          onClick={handleGeneratePdf}
          disabled={loading}
        >
          {loading ? 'Формирование...' : 'Скачать PDF'}
        </button>
      </div>
    </div>
  );
}