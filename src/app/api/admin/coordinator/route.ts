import { db } from '@/drizzle/db';
import { faculty, user } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const coordList = await db
      .select({
        faculty: faculty,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      })
      .from(faculty)
      .innerJoin(user, eq(faculty.userId, user.id))
      .where(eq(user.role, 'coordinator'));
    return NextResponse.json(coordList, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
