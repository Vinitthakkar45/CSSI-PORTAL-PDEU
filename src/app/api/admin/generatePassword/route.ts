import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { user, student, faculty } from '@/drizzle/schema';
import nodemailer from 'nodemailer';
import { eq, isNull } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    // Get all users with null passwords
    const usersToUpdate = await db.select().from(user).where(isNull(user.password));

    if (usersToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users with null passwords found.',
        count: 0,
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    let successCount = 0;
    let failCount = 0;

    // Process users one by one
    for (const userData of usersToUpdate) {
      try {
        // Generate password based on email prefix
        const emailPrefix = userData.email?.split('@')[0].substring(0, 5) || 'user';
        const password = generatePassword(emailPrefix);

        // Get user's name if available
        let name = emailPrefix;
        if (userData.role === 'student') {
          const studentData = await db
            .select({ name: student.name })
            .from(student)
            .where(eq(student.userId, userData.id))
            .limit(1);

          if (studentData.length > 0 && studentData[0].name) {
            name = studentData[0].name;
          }
        } else if (userData.role === 'faculty' || userData.role === 'admin') {
          const facultyData = await db
            .select({ name: faculty.name })
            .from(faculty)
            .where(eq(faculty.userId, userData.id))
            .limit(1);

          if (facultyData.length > 0 && facultyData[0].name) {
            name = facultyData[0].name;
          }
        }

        // Send email with credentials
        const subject = 'CSSI Portal - Your Account Credentials';
        const personalizedBody = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0056b3; text-align: center;">CSSI Portal Account Credentials</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your account credentials for the CSSI Portal have been generated. Please use the following details to log in:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> <span style="font-weight: bold;">${userData.email}</span></p>
            <p><strong>Password:</strong> <span style="font-weight: bold;">${password}</span></p>
          </div>
          <p>Please log in at <a href="https://cssi.pdpu.ac.in" style="color: #0056b3;">cssi.pdpu.ac.in</a></p>
          <p>We recommend changing your password after your first login.</p>
          <p>If you have any questions, please contact the CSSI team.</p>
          <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
        `;

        // Send email first
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: userData.email,
          subject: subject,
          html: personalizedBody,
        });

        // Only update password in database if email was sent successfully
        await db.update(user).set({ password }).where(eq(user.id, userData.id));

        successCount++;
        console.log(`Successfully sent credentials to ${userData.email}`);
      } catch (error) {
        failCount++;
        console.error(`Failed to process user ${userData.email}:`, error);
        // Password remains null in database since we didn't update it
      }

      // Small delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${usersToUpdate.length} users. Successfully sent ${successCount} emails. Failed: ${failCount}.`,
      count: successCount,
      failed: failCount,
    });
  } catch (error) {
    console.error('Error generating passwords:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to generate passwords' },
      { status: 500 }
    );
  }
}

function generatePassword(prefix: string) {
  const specialChars = '!@#$%&*';
  const numbers = '0123456789';
  const allExtras = specialChars + numbers;

  const getRandomChar = () => allExtras[Math.floor(Math.random() * allExtras.length)];

  let extra = '';
  for (let i = 0; i < 5; i++) {
    extra += getRandomChar();
  }

  return `${prefix}${extra}`;
}
