import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { student, type SelectStudent } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

interface PersonalDetailsRequest {
  userId: number;
  studentData: {
    rollNumber: string;
    name: string;
    department: string;
    division: string;
    groupNumber: string;
    contactNumber: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId, studentData }: PersonalDetailsRequest = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    if (!studentData) {
      return NextResponse.json({ message: 'Student data is required' }, { status: 400 });
    }

    const { rollNumber, name, department, division, groupNumber, contactNumber } = studentData;

    if (!rollNumber || !name || !department || !division || !groupNumber || !contactNumber) {
      return NextResponse.json({ message: 'All personal details are required' }, { status: 400 });
    }

    await db
      .update(student)
      .set({
        rollNumber,
        name,
        department,
        division,
        groupNumber,
        contactNumber,
      })
      .where(eq(student.userId, userId))
      .returning();

    return NextResponse.json(
      {
        message: 'Personal details updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating student personal details:', error);
    return NextResponse.json({ message: 'Failed to update personal details' }, { status: 500 });
  }
}
