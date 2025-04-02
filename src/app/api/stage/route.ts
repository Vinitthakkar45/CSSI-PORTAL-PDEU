import { db } from '@/drizzle/db';
import { stage } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const currentStage = await db.select({ stage: stage.stage }).from(stage).where(eq(stage.year, year));
    return NextResponse.json({ stage: currentStage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 404 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const { currentStage } = await req.json();
    const newStage = currentStage + 1;
    const response = await db.update(stage).set({ stage: newStage }).where(eq(stage.year, year));
    if (response.rowCount > 0) {
      return NextResponse.json({ message: 'Update successful', affectedRows: response.rowCount }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No rows updated. Record not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
