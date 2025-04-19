import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const adminMails = await db
    .select({
      email: user.email,
      role: user.role,
    })
    .from(user)
    .where(eq(user.role, 'admin'));

  const batchSize = 50;
  const delayBetweenBatches = 6000;
  for (let i = 0; i < adminMails.length; i += batchSize) {
    const batch = adminMails.slice(i, i + batchSize);

    try {
      const emailPromise = batch.map(async (mail) => {
        const Body = 'This is a Query from ' + email + ' ' + message;
        return transporter.sendMail({
          from: process.env.EMAIL,
          to: mail.email,
          subject: `Query Email from ${name}`,
          text: Body,
        });
      });
      await Promise.all(emailPromise);
      if (i + batchSize < adminMails.length) {
        console.log(`Waiting for ${delayBetweenBatches / 1000} seconds before sending the next batch...`);
        await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
      }
      return NextResponse.json({ msg: 'Emails sent successfully!' }, { status: 200 });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    }
  }
}
