import { NextRequest, NextResponse } from 'next/server';
import transporter from '@/lib/transporter';
import { redis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const ttlSeconds = 300;

  try {
    await redis.set(`otp:${email}`, otp, { ex: ttlSeconds });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your Support Ticket Verification Code',
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    return NextResponse.json({ msg: 'OTP sent successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
