import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await sendEmail({ name, email, message });

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error in contact API:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
