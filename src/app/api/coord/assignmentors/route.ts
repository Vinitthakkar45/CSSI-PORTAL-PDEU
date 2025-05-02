// app/api/coord/assign-mentors/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { mentorStudent, SelectStudent } from '@/drizzle/schema';
import { eq, inArray } from 'drizzle-orm';
import AssignMentors from '@/components/Coordinator/utils/assignmentors';

type StudentWithUser = {
  student: SelectStudent;
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
};

export async function POST(request: Request) {
  try {
    const { students, faculties } = await request.json();

    if (!students.length || !faculties.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required data',
        },
        { status: 400 }
      );
    }

    // Get department from the first faculty
    const department = faculties[0]?.faculty?.department;

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to determine coordinator's department",
        },
        { status: 400 }
      );
    }

    // Get IDs of students from the department
    const studentIds = students.map((s: StudentWithUser) => s.student.id);

    if (!studentIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'No student IDs found for assignment',
        },
        { status: 400 }
      );
    }

    // Check if any of these students already have mentors assigned
    const existingAssignments = await db
      .select()
      .from(mentorStudent)
      .where(inArray(mentorStudent.studentId, studentIds));

    if (existingAssignments.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Mentors have already been assigned for ${department} department students`,
        alreadyAssigned: true,
        department: department,
      });
    }

    // If no mentors assigned for these students, proceed with assignment
    await AssignMentors({ students, faculties });

    return NextResponse.json({
      success: true,
      message: 'Mentors assigned successfully',
      department: department,
    });
  } catch (error) {
    console.error('Error assigning mentors:', error);
    return NextResponse.json({ success: false, error: 'Failed to assign mentors' }, { status: 500 });
  }
}
