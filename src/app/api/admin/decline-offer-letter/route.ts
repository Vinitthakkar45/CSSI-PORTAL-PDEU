import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/drizzle/db';
import { student } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const faculty_user_id = req.nextUrl.searchParams.get('facultyId');
  const faculty_mail = req.nextUrl.searchParams.get('email');
  if (!faculty_mail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { student_user_id, reason_of_declination } = body;

  if (!student_user_id || !faculty_user_id || !reason_of_declination) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const student_details = await db
    .select({
      email: student.email,
      id: student.userId,
      name: student.name,
    })
    .from(student)
    .where(eq(student.userId, student_user_id))
    .limit(1);

  if (student_details.length === 0) {
    console.log('Error');
    return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
  } else if (!student_details[0].email) {
    return NextResponse.json({ error: 'Email not found for this student.' }, { status: 404 });
  }

  try {
    const Body =
      `Dear ${student_details[0].name},\n\n` +
      `We regret to inform you that your offer letter has been declined by admin for the following reason:\n\n` +
      `"${reason_of_declination}"\n\n` +
      `If you have any questions or need further assistance, please feel free to contact your faculty Supervisor.\n\n` +
      `Best regards,\n` +
      `CSSI Team`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: student_details[0].email,
      subject: 'Offer Letter Declination Notification',
      text: Body,
    });

    return NextResponse.json({ msg: 'Email sent successfully!' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
