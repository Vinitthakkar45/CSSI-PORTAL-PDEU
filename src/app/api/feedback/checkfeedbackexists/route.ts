import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { db } from '@/drizzle/db';
import { feedback, user } from '@/drizzle/schema'; // adjust path as per your project
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if feedback exists for this user
    const existingFeedback = await db
      .select()
      .from(feedback)
      .where(eq(feedback.userId, userId))
      .then((rows) => rows[0]);

    return NextResponse.json(
      {
        hasSubmitted: !!existingFeedback,
        submittedAt: existingFeedback?.submittedAt || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking feedback status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
