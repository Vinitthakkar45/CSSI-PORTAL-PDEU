import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  getMentoredStudents,
  getEvaluatedStudents,
  updateFinalMarks,
  updateInternalMarks,
  MarksType,
} from '@/drizzle/facultyQueries';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const facultyId = Number(session.user.id);

    const [mentoredStudents, evaluatedStudents] = await Promise.all([
      getMentoredStudents(facultyId),
      getEvaluatedStudents(facultyId),
    ]);

    // console.log(mentoredStudents);
    // console.log(evaluatedStudents);

    return NextResponse.json(
      {
        mentoredStudents,
        evaluatedStudents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching faculty data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('POST request received for faculty marks update');
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const facultyId = Number(session.user.id);
    // const facultyId = 7;
    console.log('Faculty ID from session:', facultyId);

    const body = await req.json();
    console.log('Request body:', body);
    const { studentid, typeofmarks, marks } = body;

    if (!studentid || !typeofmarks || marks === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get faculty-related students
    const [mentoredStudents, evaluatedStudents] = await Promise.all([
      getMentoredStudents(facultyId),
      getEvaluatedStudents(facultyId),
    ]);

    // Check if student belongs to faculty's mentored or evaluated list
    const isMentor = mentoredStudents.some((student) => student.id === studentid);
    const isEvaluator = evaluatedStudents.some((student) => student.id === studentid);

    if (typeofmarks === 'internal') {
      console.log('Updating internal marks');
      if (!isMentor) {
        return NextResponse.json({ error: 'Unauthorized to update internal marks' }, { status: 403 });
      }
      await updateInternalMarks(studentid, marks);
    } else if (typeofmarks === 'final') {
      console.log('Updating final marks');
      if (!isEvaluator) {
        return NextResponse.json({ error: 'Unauthorized to update final marks' }, { status: 403 });
      }
      await updateFinalMarks(studentid, marks);
    } else {
      return NextResponse.json({ error: 'Invalid typeofmarks value' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error fetching faculty data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
