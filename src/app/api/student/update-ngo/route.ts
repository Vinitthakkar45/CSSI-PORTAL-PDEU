import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { student } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId, studentData } = await request.json();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    if (
      !studentData.ngoName ||
      !studentData.ngoLocation ||
      !studentData.ngoPhone ||
      !studentData.ngoDescription ||
      !studentData.name
    ) {
      return NextResponse.json({ message: 'NGO details are required' }, { status: 400 });
    }

    await db
      .update(student)
      .set({
        name: studentData.name,
        ngoName: studentData.ngoName,
        ngoLocation: studentData.ngoLocation,
        ngoPhone: studentData.ngoPhone,
        ngoDescription: studentData.ngoDescription,
        ngoChosen: true,
        stage: studentData.stage,
      })
      .where(eq(student.userId, userId));

    return NextResponse.json(
      {
        message: 'NGO information updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating student NGO information:', error);
    return NextResponse.json({ message: 'Failed to update NGO information' }, { status: 500 });
  }
}
