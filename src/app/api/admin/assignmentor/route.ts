import { NextResponse } from 'next/server';
import { mentorAssignment } from '@/components/Admin/utils/mentorassign';

export async function POST() {
  try {
    await mentorAssignment();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mentor Assignment Failed:', error);
    return NextResponse.json({ error: 'Mentor Assignment Failed' }, { status: 500 });
  }
}
