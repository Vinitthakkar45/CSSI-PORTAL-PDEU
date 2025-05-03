import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { faculty, student } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/authOptions';

export async function PUT(req: NextRequest) {
  try {
    // Get current user from session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (!body) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    const { role } = body;

    // Get user ID from session
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }

    // Ensure userId is a number
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    if (isNaN(userIdNum)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Update different tables based on role
    if (role === 'faculty' || role === 'coordinator') {
      // For faculty, update sitting and freeTimeSlots
      const { sitting, freeTimeSlots } = body;

      // Validate input
      if (sitting === undefined && freeTimeSlots === undefined) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }

      // Find faculty by userId
      const facultyResult = await db.select().from(faculty).where(eq(faculty.userId, userIdNum));

      if (!facultyResult || facultyResult.length === 0) {
        return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
      }

      const facultyId = facultyResult[0].id;

      // Prepare update object with only the fields that are provided
      const updateData: Partial<typeof faculty.$inferInsert> = {};

      if (sitting !== undefined) {
        updateData.sitting = sitting;
      }

      if (freeTimeSlots !== undefined) {
        updateData.freeTimeSlots = freeTimeSlots;
      }

      // Update faculty record
      await db.update(faculty).set(updateData).where(eq(faculty.id, facultyId));

      return NextResponse.json({ success: true, message: 'Faculty information updated successfully' });
    } else if (role === 'student') {
      // For student, update only contactNumber
      const { contactNumber } = body;

      // Validate input
      if (contactNumber === undefined) {
        return NextResponse.json({ error: 'Contact number is required' }, { status: 400 });
      }

      // Find student by userId
      const studentResult = await db.select().from(student).where(eq(student.userId, userIdNum));

      if (!studentResult || studentResult.length === 0) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const studentId = studentResult[0].id;

      // Update student record
      await db.update(student).set({ contactNumber }).where(eq(student.id, studentId));

      return NextResponse.json({ success: true, message: 'Student information updated successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
  } catch (error) {
    // Simplified error handling
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
