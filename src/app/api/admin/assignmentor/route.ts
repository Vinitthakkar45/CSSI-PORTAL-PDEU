import { NextResponse } from 'next/server';
import { mentorAssignment } from '@/components/Admin/utils/mentorassign';

export async function POST() {
  try {
    const result = await mentorAssignment();

    if (result.allAssigned) {
      return NextResponse.json({
        success: false,
        allAssigned: true,
        message: result.message,
      });
    }

    return NextResponse.json({
      success: true,
      allAssigned: false,
      message: result.message,
    });
  } catch (error) {
    console.error('Mentor Assignment Failed:', error);
    return NextResponse.json(
      {
        error: 'Mentor Assignment Failed',
        success: false,
      },
      { status: 500 }
    );
  }
}
