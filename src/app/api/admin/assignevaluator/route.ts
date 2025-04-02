import { NextResponse } from 'next/server';
import { evaluatorAssignment } from '@/components/Admin/utils/evaluatorassign';

export async function POST() {
  try {
    await evaluatorAssignment();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mentor Assignment Failed:', error);
    return NextResponse.json({ error: 'Mentor Assignment Failed' }, { status: 500 });
  }
}
