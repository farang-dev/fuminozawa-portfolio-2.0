import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail({ name, email, message }: { name: string; email: string; message: string }) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'mf.nozawa@gmail.com',
        subject: `Portfolio Contact: Message from ${name}`,
        text: `
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `,
        replyTo: email,
    };

    return transporter.sendMail(mailOptions);
}
