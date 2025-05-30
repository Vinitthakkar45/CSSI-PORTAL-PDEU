import { user, student, faculty } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';
import { generateStageChangeNotifications } from './mailTemplate';
import { eq } from 'drizzle-orm';
import transporter from '@/lib/transporter';
async function getUserName(email: string, role: string): Promise<string> {
  if (role === 'student') {
    const result = await db
      .select({ name: student.name })
      .from(student)
      .innerJoin(user, eq(student.userId, user.id))
      .where(eq(user.email, email))
      .limit(1);
    return result[0]?.name || 'Student';
  } else if (role === 'faculty') {
    const result = await db
      .select({ name: faculty.name })
      .from(faculty)
      .innerJoin(user, eq(faculty.userId, user.id))
      .where(eq(user.email, email))
      .limit(1);
    return result[0]?.name || 'Faculty';
  }
  return 'Admin'; // For admins, just use a generic name
}

async function sendBulkMails(rec: string[], subject: string, bodyTemplate: string, role: string) {
  if (rec.length === 0) return;

  const batchSize = 50;
  const delayBetweenBatches = 6000;

  for (let i = 0; i < rec.length; i += batchSize) {
    const batch = rec.slice(i, i + batchSize);

    try {
      // **Send one email per recipient**
      const emailPromises = batch.map(async (email) => {
        const userName = await getUserName(email, role);

        const personalizedBody = bodyTemplate.replace(
          role === 'student' ? '{STUDENT_NAME}' : role === 'faculty' ? '{FACULTY_NAME}' : '{ADMIN_NAME}',
          userName
        );

        return transporter.sendMail({
          from: process.env.EMAIL,
          to: email, // **Each email is sent separately now**
          subject: subject,
          text: personalizedBody,
        });
      });

      await Promise.all(emailPromises); // Wait for all emails in batch

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
    let { stage } = await req.json();
    stage = stage + 1;
    console.log(`Processing stage change to stage ${stage}`);

    // Get email templates for all user types
    const templates = generateStageChangeNotifications(stage);

    const usersMail = await db
      .select({
        email: user.email,
        role: user.role,
      })
      .from(user);

    const facultyEmails = usersMail.filter((user) => user.role === 'faculty').map((user) => user.email);
    const studentEmails = usersMail.filter((user) => user.role === 'student').map((user) => user.email);
    const adminEmails = usersMail.filter((user) => user.role === 'admin').map((user) => user.email);
    await Promise.all([
      sendBulkMails(
        facultyEmails,
        templates.facultyTemplate.subject,
        templates.facultyTemplate.bodyTemplate,
        'faculty'
      ),
      sendBulkMails(
        studentEmails,
        templates.studentTemplate.subject,
        templates.studentTemplate.bodyTemplate,
        'student'
      ),
      sendBulkMails(adminEmails, templates.adminTemplate.subject, templates.adminTemplate.bodyTemplate, 'admin'),
    ]);

    return NextResponse.json({ msg: 'Emails sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
