// File: app/api/admin/deletementors/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/drizzle/db';
import { mentorStudent } from '@/drizzle/schema';

export async function DELETE(req: NextRequest) {
  try {
    // Delete all records from the mentorStudent table
    const result = await db.delete(mentorStudent);

    return NextResponse.json({
      success: true,
      message: 'All mentor assignments have been deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting mentor assignments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete mentor assignments',
      },
      { status: 500 }
    );
  }
}
