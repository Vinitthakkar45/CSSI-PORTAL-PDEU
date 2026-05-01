import { NextResponse } from 'next/server';
// import { db } from '@/drizzle/db';
// import { evaluatorStudent } from '@/drizzle/schema';
// COMMENTED OUT - Evaluator deletion deprecated as per new policy

export async function DELETE() {
  try {
    /*
    COMMENTED OUT - Evaluator assignment deprecated
    await db.delete(evaluatorStudent);

    return NextResponse.json({
      success: true,
      message: 'All evaluator assignments have been deleted successfully',
    });
    */

    // New policy: Evaluator deletion is no longer available
    return NextResponse.json(
      {
        success: false,
        error: 'Evaluator assignment is no longer available. Only mentors are assigned.',
      },
      { status: 403 }
    );
  } catch (error) {
    console.error('Error deleting evaluator assignments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Evaluator assignment is deprecated',
      },
      { status: 500 }
    );
  }
}
