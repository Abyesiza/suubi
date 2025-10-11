import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

type EmailBrandingOptions = {
  title?: string;
  preheader?: string;
  bodyHtml: string;
  primaryColor?: string;
  accentColor?: string;
};

let cachedTransporter: Transporter | null = null;

export function getEmailTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    throw new Error('EMAIL and EMAIL_PASSWORD must be set');
  }

  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });

  return cachedTransporter;
}

export async function verifyEmailTransporter(): Promise<void> {
  const transporter = getEmailTransporter();
  await transporter.verify();
}

export function renderBrandedEmail({
  title = 'Suubi Medical Centre Notification',
  preheader = '',
  bodyHtml,
  primaryColor = '#1E3A5F', // Dark Blue - primary brand color
  accentColor = '#FFF3E6',  // Warm Beige - background
}: EmailBrandingOptions): string {
  // Always embed logo using CID sourced from local filesystem path.
  const logoUrl = 'cid:suubi-logo';
  const greenAccent = '#2E8B57'; // Green - for medical themed accents

  return `
  <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: ${primaryColor}; max-width: 640px; margin: 0 auto; padding: 24px; background-color: #F5F7FA;">
    <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preheader}</span>
    <div style="text-align: center; margin-bottom: 24px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(30, 58, 95, 0.1);">
      <img src="${logoUrl}" alt="Suubi Medical Centre" height="56" style="height:56px; width:auto; object-fit:contain;" />
      <div style="font-weight: 700; margin-top: 12px; font-size: 20px; color:${primaryColor}; letter-spacing: 0.5px;">Suubi Medical Centre</div>
      <div style="font-size: 13px; color: ${greenAccent}; margin-top: 4px; font-weight: 500;">Caring for Your Health, Every Step of the Way</div>
    </div>
    <div style="background: white; border: 2px solid ${accentColor}; border-radius: 12px; padding: 28px; box-shadow: 0 2px 8px rgba(30, 58, 95, 0.08);">
      <h1 style="color:${primaryColor}; font-size: 22px; margin: 0 0 16px 0; border-bottom: 3px solid ${greenAccent}; padding-bottom: 12px;">${title}</h1>
      <div style="color:#4A5568; line-height:1.7; font-size: 15px;">${bodyHtml}</div>
    </div>
    <div style="text-align:center; color:#A3AAB2; font-size: 12px; margin-top: 20px; padding: 16px; background: white; border-radius: 8px;">
      <div style="margin-bottom: 8px; color: ${greenAccent}; font-weight: 600;">
        <span style="font-size: 16px;">✚</span> Suubi Medical Centre
      </div>
      <div style="margin-bottom: 4px;">Professional Healthcare Services</div>
      <div>© ${new Date().getFullYear()} Suubi Medical Centre. All rights reserved.</div>
    </div>
  </div>
  `;
}

export type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  replyTo?: string;
};

export async function sendBrandedEmail({ to, subject, html, text, fromName = 'Suubi Medical Centre', replyTo }: SendEmailArgs) {
  const transporter = getEmailTransporter();
  const from = `${fromName} <${process.env.EMAIL}>`;
  // Prefer hosted URL for logo to avoid filesystem access in serverless envs
  const hostedLogoUrl = process.env.EMAIL_LOGO_URL || (
    process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/logo.png` : undefined
  );
  const localLogoPath = path.join(process.cwd(), process.env.EMAIL_LOGO_PATH || 'public/logo.png');

  const attachments = [] as Array<{ filename: string; path: string; cid: string }>
  if (hostedLogoUrl) {
    attachments.push({ filename: 'logo.png', path: hostedLogoUrl, cid: 'suubi-logo' });
  } else {
    attachments.push({ filename: 'logo.png', path: localLogoPath, cid: 'suubi-logo' });
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
      attachments,
    });
  } catch (err: any) {
    // Fallback: retry without attachments if logo path fails (e.g., ENOENT in serverless)
    console.error('Email send failed with attachments, retrying without logo. Reason:', err);
    await transporter.sendMail({
      from,
      to,
      subject,
      html: html.replace('cid:suubi-logo', hostedLogoUrl || ''),
      text,
      replyTo,
    });
  }
}


