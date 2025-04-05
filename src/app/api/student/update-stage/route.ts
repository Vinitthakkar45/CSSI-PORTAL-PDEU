import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { student } from '@/drizzle/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, stage } = body;

    if (!userId || stage === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedStudent = await db.update(student).set({ stage: stage }).where(eq(student.userId, userId)).returning();

    if (!updatedStudent || updatedStudent.length === 0) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'Stage updated successfully',
        data: { stage, student: updatedStudent[0] },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating stage:', error);
    return NextResponse.json(
      {
        message: 'Failed to update stage',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
