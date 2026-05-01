import { NextResponse } from 'next/server';
// import { evaluatorAssignment } from '@/components/Admin/utils/evaluatorassign';
// COMMENTED OUT - Evaluator assignment deprecated as per new policy
// Only mentors are assigned, they act as both mentor and evaluator

export async function POST() {
  try {
    // COMMENTED OUT - Evaluator assignment functionality
    /*
    await evaluatorAssignment();
    return NextResponse.json({ success: true });
    */

    // New policy: Evaluator assignment is no longer available
    return NextResponse.json(
      {
        success: false,
        error:
          'Evaluator assignment is no longer available. Only mentors are assigned and will act as both mentor and evaluator.',
      },
      { status: 403 }
    );
  } catch (error) {
    console.error('Evaluator Assignment Error:', error);
    return NextResponse.json({ error: 'Evaluator assignment is deprecated' }, { status: 500 });
  }
}
