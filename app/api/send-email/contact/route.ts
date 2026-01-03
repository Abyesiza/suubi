export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getEmailTransporter, renderBrandedEmail, sendBrandedEmail, verifyEmailTransporter } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // Validate required environment variables
    // We allow missing EMAIL env if we have a hardcoded fallback, but password is required for SMTP
    if (!process.env.EMAIL_PASSWORD) {
      console.error('Missing required environment variables: EMAIL_PASSWORD');
      return NextResponse.json({
        success: false,
        error: 'Email service not configured'
      }, { status: 500 });
    }

    // Validate required parameters
    if (!name || !email || !subject || !message) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, email, subject, or message'
      }, { status: 400 });
    }

    // Verify SMTP connection
    try {
      getEmailTransporter();
      await verifyEmailTransporter();
      console.log('SMTP server is ready for contact form emails');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({
        success: false,
        error: 'Email service connection failed'
      }, { status: 500 });
    }

    // Email to Suubi Medical Centre Admin (no attachments to avoid path issues)
    const orgMailHtml = renderBrandedEmail({
      title: '📧 New Contact Form Submission',
      preheader: `${name} submitted the contact form`,
      bodyHtml: `
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1E3A5F; width: 30%;">Name:</td>
            <td style="padding: 8px 0; color: #4A5568;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1E3A5F;">Email:</td>
            <td style="padding: 8px 0; color: #4A5568;"><a href="mailto:${email}" style="color: #2E8B57;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1E3A5F;">Phone:</td>
            <td style="padding: 8px 0; color: #4A5568;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1E3A5F;">Subject:</td>
            <td style="padding: 8px 0; color: #4A5568;">${subject}</td>
          </tr>
        </table>
        <div style="background: #FFF3E6; border: 1px solid #7BC6B3; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <h3 style="color: #1E3A5F; margin: 0 0 8px 0; font-size: 16px;">Message</h3>
          <p style="color: #4A5568; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // Auto-reply to user
    const userMailHtml = renderBrandedEmail({
      title: 'Thank you for contacting Suubi Medical Centre!',
      preheader: 'We received your message and will reply soon',
      bodyHtml: `
        <p style="margin:0 0 12px 0; color:#1E3A5F;">Dear ${name},</p>
        <p style="margin:0 0 12px 0; color:#4A5568;">Thank you for reaching out to Suubi Medical Centre. We have received your message and will get back to you within 24-48 hours.</p>
        <div style="background: #FFF3E6; border: 1px solid #7BC6B3; border-radius: 6px; padding: 12px; margin: 16px 0 8px;">
          <p style="margin:0; color:#1E3A5F; font-weight:600;">Your message subject: "${subject}"</p>
        </div>
        <div style="text-align:center; margin-top:20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suubi.com'}/services" style="background:#2E8B57;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-right:10px;">Our Services</a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://suubi.com'}/appointments" style="background:#F7941D;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Book Appointment</a>
        </div>
        <div style="background: #F5F7FA; border-left: 3px solid #2E8B57; padding: 12px; margin: 20px 0; border-radius: 4px;">
          <p style="margin:0; color:#4A5568; font-size:13px;"><strong style="color:#1E3A5F;">Need urgent care?</strong><br/>For medical emergencies, please call our 24/7 hotline or visit our emergency department.</p>
        </div>
        <p style="text-align:center;margin-top:16px;color:#1E3A5F;font-size:14px;">Warm regards,<br/><strong style="color:#2E8B57;">The Suubi Medical Centre Team</strong></p>
      `,
    });

    // Send both emails
    await sendBrandedEmail({
      to: process.env.EMAIL || 'suubimedcarekayunga@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: orgMailHtml,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject}\nMessage: ${message}`,
      fromName: name,
      replyTo: email,
    });
    console.log('Contact form email sent to Suubi Medical Centre admin');

    await sendBrandedEmail({
      to: email,
      subject: 'Thank you for contacting Suubi Medical Centre!',
      html: userMailHtml,
      text: `Dear ${name}, Thank you for reaching out to Suubi Medical Centre. We have received your message and will get back to you within 24-48 hours. Your message: "${subject}"`,
    });
    console.log(`Contact form confirmation sent to ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending contact form emails:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email.'
    }, { status: 500 });
  }
}