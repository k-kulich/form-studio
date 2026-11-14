// lib/unisender.ts
import nodemailer from 'nodemailer';

// Создаём один транспорт на всё приложение.
// Он будет использовать connection pooling для эффективности.
const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true, // Используем SSL/TLS для порта 465
  auth: {
    user: process.env.YANDEX_SMTP_USER,
    pass: process.env.YANDEX_SMTP_PASS,
  },
});

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  const fromEmail = process.env.YANDEX_SMTP_USER;
  const fromName = process.env.EMAIL_FROM_NAME || 'FORM';

  if (!fromEmail) {
    console.warn('[mailer] YANDEX_SMTP_USER не задан — письмо пропущено');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });
    console.log('[mailer] Письмо отправлено:', info.messageId);
  } catch (error) {
    console.error('[mailer] Ошибка отправки:', error);
  }
}