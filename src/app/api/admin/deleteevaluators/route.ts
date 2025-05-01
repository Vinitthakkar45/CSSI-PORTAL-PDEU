import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { evaluatorStudent } from '@/drizzle/schema';

export async function DELETE() {
  try {
    await db.delete(evaluatorStudent);

    return NextResponse.json({
      success: true,
      message: 'All evaluator assignments have been deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting evaluator assignments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete evaluator assignments',
      },
      { status: 500 }
    );
  }
}
