import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { db } from '@/drizzle/db';
import { student, faculty, user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { uploadMedia, deleteMedia } from '@/lib/storage';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic']);
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as { id: string; role: string } | undefined;

  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, or HEIC images allowed' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 });
    }

    const { id, role } = currentUser;

    // Fetch existing key so we can delete the old object if extension changes
    let oldKey: string | null = null;
    if (role === 'student') {
      const [row] = await db.select({ profileImage: student.profileImage }).from(student).where(eq(student.userId, id)).limit(1);
      oldKey = row?.profileImage ?? null;
    } else if (role === 'faculty' || role === 'coordinator') {
      const [row] = await db.select({ profileImage: faculty.profileImage }).from(faculty).where(eq(faculty.userId, id)).limit(1);
      oldKey = row?.profileImage ?? null;
    } else if (role === 'admin') {
      const [row] = await db.select({ profileImage: user.profileImage }).from(user).where(eq(user.id, id)).limit(1);
      oldKey = row?.profileImage ?? null;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    // Timestamp in key ensures a unique URL on every upload — no browser cache issues
    const key = `profileimage/${id}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Delete previous file if it had a different key (different extension)
    if (oldKey && oldKey !== key) {
      await deleteMedia(oldKey).catch(() => {}); // non-fatal
    }

    await uploadMedia(buffer, key, file.type);

    if (role === 'student') {
      await db.update(student).set({ profileImage: key }).where(eq(student.userId, id));
    } else if (role === 'faculty' || role === 'coordinator') {
      await db.update(faculty).set({ profileImage: key }).where(eq(faculty.userId, id));
    } else if (role === 'admin') {
      await db.update(user).set({ profileImage: key }).where(eq(user.id, id));
    }

    return NextResponse.json({ key });
  } catch (err) {
    console.error('Profile image upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
