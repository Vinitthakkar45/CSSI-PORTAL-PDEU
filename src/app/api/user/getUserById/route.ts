import { NextResponse } from 'next/server';
import { getUserDetails } from '@/lib/user';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('userId');

    if (!userIdParam) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userId = parseInt(userIdParam, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const userDetails = await getUserDetails(userId);

    if (!userDetails) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userDetails);
  } catch (error) {
    console.error('Error in user details API:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}
