import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { firstname } = await req.json();

    if (!firstname || typeof firstname !== 'string') {
      return NextResponse.json({ error: 'Invalid firstname' }, { status: 400 });
    }

    const specialChars = '!@#$%&*';
    const numbers = '0123456789';
    const allExtras = specialChars + numbers;

    const getRandomChar = () => allExtras[Math.floor(Math.random() * allExtras.length)];

    let extra = '';
    for (let i = 0; i < 5; i++) {
      extra += getRandomChar();
    }

    const password = `${firstname}${extra}`;

    return NextResponse.json({ password }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
