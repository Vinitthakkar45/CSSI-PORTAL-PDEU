import { NextRequest, NextResponse } from 'next/server';
import {
  getMentoredStudents,
  getEvaluatedStudents,
  updateFinalMarks,
  updateInternalMarks,
  checkAdmin,
  checkCoord,
} from '@/drizzle/facultyQueries';

export async function GET(req: NextRequest) {
  try {
    const facultyId = Number(req.nextUrl.searchParams.get('facultyId'));
    if (!facultyId) {
      return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 });
    }

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
    const facultyId = Number(req.nextUrl.searchParams.get('facultyId'));
    if (!facultyId) {
      return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 });
    }
    const body = await req.json();
    const { studentid, typeofmarks, marks } = body;

    if (!studentid || !typeofmarks || marks === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isMentor = false;
    const isEvaluator = false;

    if (!checkAdmin(facultyId)) {
      const [mentoredStudents, evaluatedStudents] = await Promise.all([
        getMentoredStudents(facultyId),
        getEvaluatedStudents(facultyId),
      ]);
      const isMentor = mentoredStudents.some((student) => student.id === studentid);
      const isEvaluator = evaluatedStudents.some((student) => student.id === studentid);
    }

    if (typeofmarks === 'internal') {
      if (!isMentor && !checkCoord(facultyId) && !checkAdmin(facultyId)) {
        return NextResponse.json({ error: 'Unauthorized to update internal marks' }, { status: 403 });
      }
      await updateInternalMarks(studentid, marks);
    } else if (typeofmarks === 'final' && !checkCoord(facultyId) && !checkAdmin(facultyId)) {
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
