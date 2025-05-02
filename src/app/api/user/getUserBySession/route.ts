import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { db } from '@/drizzle/db';
import { user, student, faculty } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as { id: number; email: string; role: string } | undefined;

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, role, email } = currentUser;

    if (role === 'student') {
      const result = await db.select().from(student).where(eq(student.userId, id)).limit(1);
      return NextResponse.json({ role, info: result[0] || null });
    }

    if (role === 'faculty' || role === 'coordinator') {
      const result = await db.select().from(faculty).where(eq(faculty.userId, id)).limit(1);
      let info = null;
      if (result[0]) {
        info = { ...result[0], email };
      }
      return NextResponse.json({ role, info });
    }

    if (role === 'admin') {
      const result = await db
        .select({ id: user.id, email: user.email, role: user.role })
        .from(user)
        .where(eq(user.id, id))
        .limit(1);
      return NextResponse.json({ role, info: result[0] || null });
    }

    return NextResponse.json({ error: 'Role not recognized' }, { status: 400 });
  } catch (err) {
    console.error('Failed to fetch user info:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
