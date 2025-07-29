import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email is required and must be a string.' }, { status: 400 });
    }

    const usersFound = await db.select().from(user).where(eq(user.email, email)).limit(1);

    const exists = usersFound.length > 0;

    return NextResponse.json({ exists });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
