import { db } from '@/drizzle/db';
import { stage } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const year = new Date().getFullYear();
    const [current] = await db.select({ stage: stage.stage }).from(stage).where(eq(stage.year, year));

    // No row for this year yet — admin hasn't unlocked stage 1 yet. Return 0.
    return NextResponse.json({ stage: [{ stage: current?.stage ?? 0 }] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const year = new Date().getFullYear();
    const { currentStage } = await req.json();
    const newStage = currentStage + 1;

    const response = await db.update(stage).set({ stage: newStage }).where(eq(stage.year, year));

    if (response.rowCount != null && response.rowCount > 0) {
      return NextResponse.json({ message: 'Update successful', affectedRows: response.rowCount }, { status: 200 });
    }

    // No row for this year yet — insert it now (first unlock of the new academic year)
    await db.insert(stage).values({ year, stage: newStage });
    return NextResponse.json({ message: 'Stage initialized and set', affectedRows: 1 }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
