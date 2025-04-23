import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { student } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const personalDetailsSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  name: z.string().min(1, 'Name is required'),
  department: z.string().min(1, 'Department is required'),
  division: z.string().min(1, 'Division is required'),
  groupNumber: z.string().min(1, 'Group number is required'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
  profileImage: z.string().optional(),
});

const ngoDetailsSchema = z.object({
  ngoName: z.string().min(1, 'NGO name is required'),
  ngoCity: z.string().min(1, 'NGO city is required'),
  ngoDistrict: z.string().min(1, 'NGO district is required'),
  ngoState: z.string().min(1, 'NGO state is required'),
  ngoCountry: z.string().min(1, 'NGO country is required'),
  ngoAddress: z.string().min(1, 'NGO address is required'),
  ngoNatureOfWork: z.string().min(1, 'Nature of work is required'),
  ngoEmail: z.string().email('Invalid NGO email format'),
  ngoPhone: z.string().min(10, 'NGO phone number must be at least 10 digits'),
  ngoChosen: z.boolean(),
});

const projectDetailsSchema = z.object({
  problemDefinition: z.string().min(1, 'Problem definition is required'),
  proposedSolution: z.string().min(1, 'Proposed solution is required'),
});

const documentDetailsSchema = z.object({
  offerLetter: z.string().optional(),
  report: z.string().optional(),
  certificate: z.string().optional(),
  poster: z.string().optional(),
});

const studentProgressSchema = z.object({
  stage: z.number().min(0),
  qnaMarks: z.number().optional(),
});

const studentUpdateSchema = z.object({
  userId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  data: z
    .object({
      ...personalDetailsSchema.shape,
      ...ngoDetailsSchema.shape,
      ...projectDetailsSchema.shape,
      ...documentDetailsSchema.shape,
      ...studentProgressSchema.shape,
    })
    .partial(),
});

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = studentUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      // Improve error mapping to match frontend field names
      const formattedErrors = validatedData.error.issues.map((issue) => {
        // Remove 'data.' prefix from the path if it exists
        const fieldPath = issue.path.filter((p) => p !== 'data').join('.');

        return {
          field: fieldPath,
          message: issue.message,
          code: issue.code,
        };
      });

      // Group errors by field name for better organization
      const errorsByField = formattedErrors.reduce((acc: Record<string, string>, error) => {
        acc[error.field] = error.message;
        return acc;
      }, {});

      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: errorsByField,
        },
        { status: 400 }
      );
    }

    const { userId, data } = validatedData.data;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          message: 'Update data is required',
          errors: {
            data: 'At least one field must be provided for update',
          },
        },
        { status: 400 }
      );
    }

    const existingStudent = await db
      .select({ id: student.id })
      .from(student)
      .where(eq(student.userId, userId))
      .limit(1);

    if (existingStudent.length === 0) {
      return NextResponse.json(
        {
          message: 'Student not found',
          errors: [
            {
              field: 'userId',
              message: 'No student found with the provided userId',
            },
          ],
        },
        { status: 404 }
      );
    }

    const updatedStudent = await db.update(student).set(data).where(eq(student.userId, userId)).returning();

    return NextResponse.json({
      success: true,
      data: updatedStudent[0],
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      {
        message: 'Failed to update student data',
        errors: [
          {
            field: 'server',
            message: error instanceof Error ? error.message : 'An unexpected error occurred',
          },
        ],
      },
      { status: 500 }
    );
  }
}
