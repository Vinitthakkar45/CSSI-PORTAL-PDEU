import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { student } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId, ngoData } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const requiredFields = [
      'ngoName',
      'ngoCity',
      'ngoDistrict',
      'ngoState',
      'ngoCountry',
      'ngoAddress',
      'ngoNatureOfWork',
      'ngoEmail',
      'ngoPhone',
    ];

    const missingFields = requiredFields.filter((field) => !ngoData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({ message: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    await db
      .update(student)
      .set({
        ngoName: ngoData.ngoName,
        ngoCity: ngoData.ngoCity,
        ngoDistrict: ngoData.ngoDistrict,
        ngoState: ngoData.ngoState,
        ngoCountry: ngoData.ngoCountry,
        ngoAddress: ngoData.ngoAddress,
        ngoNatureOfWork: ngoData.ngoNatureOfWork,
        ngoEmail: ngoData.ngoEmail,
        ngoPhone: ngoData.ngoPhone,
        ngoChosen: true,
      })
      .where(eq(student.userId, userId));

    return NextResponse.json(
      {
        message: 'NGO information updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating student NGO information:', error);
    return NextResponse.json({ message: 'Failed to update NGO information' }, { status: 500 });
  }
}
