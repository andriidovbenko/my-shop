import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(text: string, subject = 'Нове замовлення') {
  const { data, error } = await resend.emails.send({
    from: 'Notifier <onboarding@resend.dev>',
    to: 'andrijdovbenko@gmail.com',
    subject,
    text,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
}