import { user } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { stageEmailsStudents, stageEmailsFaculty, stageEmailsAdmins } from './MailStages';

async function sendBulkMails(rec: string[], subject: string, message: string) {
  if (rec.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const batchSize = 50;
  const delayBetweenBatches = 60000;

  for (let i = 0; i < rec.length; i += batchSize) {
    const batch = rec.slice(i, i + batchSize);

    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: batch,
        subject: subject,
        text: message,
      });

      console.log(`Batch ${i / batchSize + 1} sent to: ${batch.join(', ')}`);

      if (i + batchSize < rec.length) {
        console.log(`Waiting for ${delayBetweenBatches / 1000} seconds before sending the next batch...`);
        await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
      }
    } catch (error) {
      console.error('Error sending batch email:', error);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { stage } = await req.json();
    console.log(stage);
    const studentmail = stageEmailsStudents[stage];
    const facultymail = stageEmailsFaculty[stage];
    const adminmail = stageEmailsAdmins[stage];

    const usersMail = await db
      .select({
        email: user.email,
        role: user.role,
      })
      .from(user);
    usersMail.map((user) => user.email);

    const facultymails = usersMail.filter((user) => user.role === 'faculty').map((user) => user.email);
    const studentmails = usersMail.filter((user) => user.role === 'student').map((user) => user.email);
    const adminmails = usersMail.filter((user) => user.role === 'admin').map((user) => user.email);

    await Promise.all([
      sendBulkMails(facultymails, facultymail.email.subject, facultymail.email.body),
      sendBulkMails(studentmails, studentmail.email.subject, studentmail.email.body),
      sendBulkMails(adminmails, adminmail.email.subject, adminmail.email.body),
    ]);

    return NextResponse.json({ msg: 'Emails sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
