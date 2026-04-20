import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { student } from '@/drizzle/schema';
import { uploadMedia, deleteMedia } from '@/lib/storage';

const FOLDER_TO_COLUMN: Record<string, keyof typeof student.$inferSelect> = {
  offerletter: 'offerLetter',
  report: 'report',
  certificate: 'certificate',
  poster: 'poster',
  weekonephoto: 'week_one_photo',
  weektwophoto: 'week_two_photo',
  profileimage: 'profileImage',
};

const PDF_FOLDERS = new Set(['offerletter', 'report', 'certificate', 'poster']);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folderName = (formData.get('folderName') as string)?.toLowerCase();
    const userId = formData.get('userId') as string;

    if (!userId) return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    if (!file) return NextResponse.json({ error: 'File Not Found' }, { status: 400 });

    const columnName = FOLDER_TO_COLUMN[folderName];
    if (!columnName) return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });

    const isPdf = PDF_FOLDERS.has(folderName);
    const ext = isPdf ? 'pdf' : file.name.split('.').pop() ?? 'bin';
    const contentType = isPdf ? 'application/pdf' : file.type || 'application/octet-stream';
    const newKey = `${folderName}/${userId}.${ext}`;

    // For photo uploads: fetch current key and delete it if extension changed
    if (!isPdf) {
      const [row] = await db
        .select({ val: student[columnName] })
        .from(student)
        .where(eq(student.userId, userId))
        .limit(1);
      const oldKey = row?.val as string | null;
      if (oldKey && oldKey !== newKey) {
        await deleteMedia(oldKey).catch(() => {}); // non-fatal
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadMedia(buffer, newKey, contentType);

    await db
      .update(student)
      .set({ [columnName]: newKey })
      .where(eq(student.userId, userId));

    return NextResponse.json({ publicId: newKey }, { status: 200 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
