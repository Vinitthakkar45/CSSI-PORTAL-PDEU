import { db } from '@/drizzle/db';
import { user, student, faculty } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { SelectStudent, SelectFaculty } from '@/drizzle/schema';

export async function getUserDetails(userId: string): Promise<{
  id: string;
  email: string;
  role: string;
  profileData: SelectStudent | SelectFaculty | null;
} | null> {
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
