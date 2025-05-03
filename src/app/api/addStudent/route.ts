import { db } from '@/drizzle/db';
import { faculty, student, user } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { eq } from 'drizzle-orm';
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (data.role === 'admin') {
      const firstname = data.firstname;
      const lastname = data.lastname;
      const email = data.email;
      const div = data.division;
      const department = data.department;
      const rollnumber = data.rollNumber;

      const password = generatePassword(firstname);

      const insertedUsers = await db
        .insert(user)
        .values({
          email: email,
          password: password,
          role: 'student',
        })
        .returning({ id: user.id });

      console.log(insertedUsers);

      const name = firstname + ' ' + lastname;
      const addedStudent = await db.insert(student).values({
        name: name,
        userId: insertedUsers[0].id,
        division: div,
        department: department,
        email: email,
        rollNumber: rollnumber,
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      const subject = 'Welcome to CSSI Portal Your Account Details';

      const personalizedBody = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <p>Dear <strong>${firstname} ${lastname}</strong>,</p>

    <p>Welcome to the <strong>CSSI Portal</strong>!</p>
    <a href="cssi.pdpu.ac.in">Visit CSSI Portal</a>
    <p>Your account has been successfully created. Below are your login details:</p>

    <table style="border-collapse: collapse; margin-top: 10px;">
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Email:</td>
        <td style="padding: 6px 12px;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Password:</td>
        <td style="padding: 6px 12px;">${password}</td>
      </tr>
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Roll Number:</td>
        <td style="padding: 6px 12px;">${rollnumber}</td>
      </tr>
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Department:</td>
        <td style="padding: 6px 12px;">${department}</td>
      </tr>
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Division:</td>
        <td style="padding: 6px 12px;">${div}</td>
      </tr>
    </table>

    <p>If you have any questions or face any issues, feel free to reach out to the coordination team.</p>

    <p>Best regards,<br/>
    <strong>CSSI Team</strong></p>
  </div>
`;

      const mail = await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: personalizedBody,
      });
    } else if (data.role === 'coordinator') {
      const coordid = data.coordid;
      const firstname = data.firstname;
      const lastname = data.lastname;
      const email = data.email;
      const div = data.division;
      const userdep = await db
        .select({ department: faculty.department })
        .from(faculty)
        .where(eq(faculty.userId, coordid));
      const department = userdep[0]?.department;

      const rollnumber = data.rollNumber;

      const password = generatePassword(firstname);

      const insertedUsers = await db
        .insert(user)
        .values({
          email: email,
          password: password,
          role: 'student',
        })
        .returning({ id: user.id });

      console.log(insertedUsers);

      const name = firstname + ' ' + lastname;
      const addedStudent = await db.insert(student).values({
        name: name,
        userId: insertedUsers[0].id,
        division: div,
        department: department,
        email: email,
        rollNumber: rollnumber,
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      const subject = 'Welcome to CSSI Portal Your Account Details';

      const personalizedBody = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <p>Dear <strong>${firstname} ${lastname}</strong>,</p>

    <p>Welcome to the <strong>CSSI Portal</strong>!</p>
    <a href="cssi.pdpu.ac.in">Visit CSSI Portal</a>
    <p>Your account has been successfully created. Below are your login details:</p>

    <table style="border-collapse: collapse; margin-top: 10px;">
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Email:</td>
        <td style="padding: 6px 12px;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Password:</td>
        <td style="padding: 6px 12px;">${password}</td>
      </tr>
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Roll Number:</td>
        <td style="padding: 6px 12px;">${rollnumber}</td>
      </tr>
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Department:</td>
        <td style="padding: 6px 12px;">${department}</td>
      </tr>
      <tr>
        <td style="padding: 6px 12px; font-weight: bold;">Division:</td>
        <td style="padding: 6px 12px;">${div}</td>
      </tr>
    </table>

    <p>If you have any questions or face any issues, feel free to reach out to the coordination team.</p>

    <p>Best regards,<br/>
    <strong>CSSI Team</strong></p>
  </div>
`;

      const mail = await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: personalizedBody,
      });
    }
    return NextResponse.json({ message: 'Student added Scuessfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

function generatePassword(firstname: string) {
  const specialChars = '!@#$%&*';
  const numbers = '0123456789';
  const allExtras = specialChars + numbers;

  const getRandomChar = () => allExtras[Math.floor(Math.random() * allExtras.length)];

  let extra = '';
  for (let i = 0; i < 5; i++) {
    extra += getRandomChar();
  }

  const password = `${firstname}${extra}`;

  return password;
}
