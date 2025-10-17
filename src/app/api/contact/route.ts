import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const to = 'mf.nozawa@gmail.com';

    // Validate SMTP env configuration
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env as Record<string, string | undefined>;
    if (!SMTP_USER || !SMTP_PASS) {
      return NextResponse.json(
        { error: 'SMTP not configured. Set SMTP_USER and SMTP_PASS in .env.local.' },
        { status: 500 }
      );
    }

    // Configure transporter. Using Gmail with app password is recommended.
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: Number(SMTP_PORT || 465),
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Verify connection/auth before sending
    await transporter.verify();

    const mailOptions = {
      from: SMTP_FROM || SMTP_USER,
      to,
      replyTo: email,
      subject: subject || 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}