import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  console.log(email);
  console.log(otp);

  if (!email || !otp) {
    return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 });
  }

  const storedOtp = await redis.get(`otp:${email}`);
  console.log(storedOtp);
  if (!storedOtp) {
    return NextResponse.json({ error: 'OTP expired or not found' }, { status: 400 });
  }

  if (Number(storedOtp) !== Number(otp)) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
  }

  await redis.del(`otp:${email}`);

  return NextResponse.json({ msg: 'OTP verified' }, { status: 200 });
}
