import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import {
  getMentoredStudents,
  getEvaluatedStudents,
  updateFinalMarks,
  updateInternalMarks,
} from '@/drizzle/facultyQueries';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const facultyId = session.user.id;

    const [mentoredStudents, evaluatedStudents] = await Promise.all([
      getMentoredStudents(facultyId),
      getEvaluatedStudents(facultyId),
    ]);

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
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const facultyId = session.user.id;

    const body = await req.json();
    const { studentid, typeofmarks, marks, isAbsent } = body;

    if (!studentid || !typeofmarks || marks === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [mentoredStudents, evaluatedStudents] = await Promise.all([
      getMentoredStudents(facultyId),
      getEvaluatedStudents(facultyId),
    ]);

    const isMentor = mentoredStudents.some((student) => student.id === studentid);
    const isEvaluator = evaluatedStudents.some((student) => student.id === studentid);

    if (typeofmarks === 'internal') {
      if (!isMentor) {
        return NextResponse.json({ error: 'Unauthorized to update internal marks' }, { status: 403 });
      }
      await updateInternalMarks(studentid, marks, isAbsent || false);
    } else if (typeofmarks === 'final') {
      if (!isEvaluator) {
        return NextResponse.json({ error: 'Unauthorized to update final marks' }, { status: 403 });
      }
      await updateFinalMarks(studentid, marks, isAbsent || false);
    } else {
      return NextResponse.json({ error: 'Invalid typeofmarks value' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error fetching faculty data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
