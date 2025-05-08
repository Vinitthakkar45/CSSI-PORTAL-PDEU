import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { user, student, faculty } from '@/drizzle/schema';
import nodemailer from 'nodemailer';
import { eq, isNull, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const usersToUpdate = await db
      .select({
        id: user.id,
        email: user.email,
        role: user.role,
        name: sql`
          CASE 
            WHEN ${user.role} = 'student' THEN ${student.name}
            WHEN ${user.role} IN ('faculty', 'coordinator') THEN ${faculty.name}
            WHEN ${user.role} = 'admin' THEN 'Admin'
            ELSE NULL
          END
        `,
      })
      .from(user)
      .leftJoin(student, eq(user.id, student.userId))
      .leftJoin(faculty, eq(user.id, faculty.userId))
      .where(isNull(user.password));

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
    const errors: { email: string; error: string }[] = [];

    // Process users one by one
    for (const userData of usersToUpdate) {
      try {
        if (!userData.email) {
          throw new Error('User email is missing');
        }

        // Generate password based on name
        const name = (userData.name as string)?.split(' ')[0] || 'user';
        const password = generatePassword(name);

        // Send email with credentials
        const subject = 'CSSI Portal - Your Account Credentials';
        const personalizedBody = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0056b3; text-align: center;">CSSI Portal Account Credentials</h2>
          <p>Dear <strong>${userData.name || 'User'}</strong>,</p>
          <p>Your account credentials for the CSSI Portal have been generated. Please use the following details to log in:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> <span style="font-weight: bold;">${userData.email}</span></p>
            <p><strong>Password:</strong> <span style="font-weight: bold;">${password}</span></p>
          </div>
          <p>Please log in at <a href="https://cssi.pdpu.ac.in" style="color: #0056b3;">cssi.pdpu.ac.in</a></p>
          <p>Do not share these credentials with anyone!</p>
          <p>If you have any questions, please contact the CSSI team.</p>
          <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
        `;

        // Send email first
        await transporter.sendMail({
          from: 'CSSI@sot.pdpu.ac.in',
          to: 'vinit.tce22@sot.pdpu.ac.in',
          subject: subject,
          html: personalizedBody,
        });

        // Only update password in database if email was sent successfully
        await db.update(user).set({ password }).where(eq(user.id, userData.id));

        successCount++;
        console.log(`Successfully sent credentials to ${userData.email}`);
      } catch (error) {
        failCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ email: userData.email || 'unknown', error: errorMessage });
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
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error generating passwords:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate passwords',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

function generatePassword(prefix: string): string {
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
