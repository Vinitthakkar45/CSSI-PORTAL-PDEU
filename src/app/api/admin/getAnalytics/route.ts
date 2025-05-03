import { db } from '@/drizzle/db';
import { student } from '@/drizzle/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await db
      .select({
        department: student.department,
        ngoChosen: student.ngoChosen,
      })
      .from(student);

    const departmentMap: Record<string, { active: number; remaining: number }> = {};

    result.forEach(({ department, ngoChosen }) => {
      const dept = department || 'UNKNOWN';
      if (!departmentMap[dept]) {
        departmentMap[dept] = { active: 0, remaining: 0 };
      }
      if (ngoChosen) {
        departmentMap[dept].active += 1;
      } else {
        departmentMap[dept].remaining += 1;
      }
    });

    return NextResponse.json({ data: departmentMap }, { status: 200 });
  } catch (err) {
    console.error('Error fetching student data:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
