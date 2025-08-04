import { NextRequest, NextResponse } from 'next/server';
import transporter from '@/lib/transporter';
import { redis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const ttlSeconds = 600;

  try {
    await redis.set(`otp:${email}`, otp, { ex: ttlSeconds });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your Support Ticket Verification Code',
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="background-color: #4a90e2; color: white; padding: 16px; border-radius: 6px 6px 0 0; text-align: center;">
        <h2 style="margin: 0;">Support Ticket Verification</h2>
      </div>
      <div style="padding: 24px;">
        <p>Dear User,</p>
        <p>Thank you for contacting our support team.</p>
        <p>Please use the following OTP to verify your support ticket request:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4a90e2; text-align: center; margin: 20px 0;">${otp}</p>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 16px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} CSSI. All rights reserved.
      </div>
    </div>
  `,
    });

    return NextResponse.json({ msg: 'OTP sent successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
