import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { user, student, faculty } from '@/drizzle/schema';
import { eq, isNull, sql } from 'drizzle-orm';
import transporter from '@/lib/transporter';
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
        const name = ((userData.name as string) || 'user').trim().split(/\s+/)[0];
        const password = generatePassword(name);

        // Send email with credentials
        const subject = 'CSSI Portal - Your Account Credentials';
        const personalizedBody = `
        <div style="font-family: 'Outfit', 'Inter', sans-serif; color: #101828; padding: 0; max-width: 600px; margin: 0 auto; border-radius: 12px; box-shadow: 0px 8px 24px rgba(6, 8, 15, 0.08); background-color: #FCFCFC; border: 1px solid #e3e8ef; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #465fff 0%, #7592FF 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: white; text-align: center; font-weight: 600; margin: 0; font-size: 28px;">CSSI Portal</h1>
            <h2 style="color: white; text-align: center; font-weight: 500; margin: 8px 0 0 0; font-size: 20px;">Account Credentials</h2>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #344054; font-size: 16px;">Dear <strong>${userData.name || 'User'}</strong>,</p>
            <p style="color: #344054; font-size: 16px;">Your account credentials for the CSSI Portal have been generated. Please use the following details to log in:</p>
            
            <div style="background-color: #f2f7ff; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #465fff;">
              <div style="margin-bottom: 16px;">
                <p style="margin: 0;"><strong>Email:</strong> <span style="font-weight: 500;">${userData.email}</span></p>
              </div>
              <div>
                <p style="margin: 0;"><strong>Password:</strong> <span style="font-weight: 500;">${password}</span></p>
              </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://cssi.pdpu.ac.in" style="background-color: #465fff; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; box-shadow: 0 4px 6px rgba(70, 95, 255, 0.25);">
                Log in to CSSI Portal
              </a>
            </div>
            
            <!-- Security notice -->
            <div style="background-color: #FFF8EB; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #FBB040;">
              <p style="color: #344054; font-size: 14px; margin: 0;"><strong>Important:</strong> Please do not share your login credentials with anyone.</p>
            </div>
            
            <p style="color: #344054; font-size: 16px;">If you have any questions, please contact the CSSI team at <a href="mailto:CSSI@sot.pdpu.ac.in" style="color: #465fff; text-decoration: none;">CSSI@sot.pdpu.ac.in</a>.</p>
          </div>
          
          <div style="text-align: center; padding: 16px 24px; border-top: 1px solid #e3e8ef; background-color: #F9FAFB;">
            <p style="font-size: 14px; color: #667085; margin: 0;">This is an automated message from CSSI Portal. Please do not reply to this email.</p>
            <p style="font-size: 14px; color: #667085; margin-top: 8px;">cssi.pdpu.ac.in</p>
          </div>
        </div>
        `;

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
