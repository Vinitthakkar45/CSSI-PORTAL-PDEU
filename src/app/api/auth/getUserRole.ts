import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ role: session?.user?.role || null });
  } catch (error) {
    console.error('Error in get-user-role API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
