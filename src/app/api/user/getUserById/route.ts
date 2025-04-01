import { db } from '@/drizzle/db';
import { user, student, faculty } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { SelectStudent, SelectFaculty } from '@/drizzle/schema';

type UserDetails = {
  id: number;
  email: string;
  role: string;
  profileData: SelectStudent | SelectFaculty | null;
};

export async function getUserDetails(userId: number): Promise<UserDetails | null> {
  try {
    const users = await db.select().from(user).where(eq(user.id, userId)).limit(1);

    if (users.length === 0) {
      return null;
    }

    const userInfo = users[0];
    let profileData: SelectStudent | SelectFaculty | null = null;

    switch (userInfo.role) {
      case 'student': {
        const students = await db.select().from(student).where(eq(student.userId, userId)).limit(1);

        profileData = students[0] || null;
        break;
      }

      case 'faculty': {
        const faculties = await db.select().from(faculty).where(eq(faculty.userId, userId)).limit(1);

        profileData = faculties[0] || null;
        break;
      }

      case 'admin':
        profileData = null;
        break;

      default:
        console.warn(`Unknown role: ${userInfo.role}`);
        profileData = null;
    }

    return {
      id: userInfo.id,
      email: userInfo.email,
      role: userInfo.role,
      profileData,
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
}

export async function getUserByID(request: Request) {
  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('userId');

    if (!userIdParam) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = parseInt(userIdParam, 10);

    if (isNaN(userId)) {
      return new Response(JSON.stringify({ error: 'Invalid user ID format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userDetails = await getUserDetails(userId);

    if (!userDetails) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(userDetails), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in user details API:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user details' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request: Request) {
  return await getUserByID(request);
}
