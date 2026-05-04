import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { student, user } from '@/drizzle/schema';
import * as XLSX from 'xlsx';
import { and, eq, inArray } from 'drizzle-orm';
import { getCurrentAcademicYear } from '@/lib/academicYear';

// Helper function to find the header row index
function findHeaderRowIndex(sheet: XLSX.WorkSheet): number {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');

  for (let rowIdx = range.s.r; rowIdx <= range.e.r; rowIdx++) {
    let headerCandidates = 0;

    for (let colIdx = range.s.c; colIdx <= range.e.c; colIdx++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });
      const cellValue = sheet[cellAddress]?.v?.toString().toLowerCase() || '';

      if (
        cellValue.includes('roll') ||
        cellValue.includes('name') ||
        cellValue.includes('branch') ||
        cellValue.includes('department') ||
        cellValue.includes('div') ||
        cellValue.includes('group') ||
        cellValue.includes('email')
      ) {
        headerCandidates++;
      }
    }

    if (headerCandidates >= 3) {
      return rowIdx;
    }
  }

  return 0;
}

function mapHeaders(headers: string[]): Record<string, number> {
  const columnMap: Record<string, number> = {};

  headers.forEach((header, index) => {
    const headerLower = header.toLowerCase();

    if (headerLower.includes('roll')) {
      columnMap.rollNumber = index;
    } else if (headerLower.includes('name')) {
      columnMap.name = index;
    } else if (headerLower.includes('branch') || headerLower.includes('department') || headerLower.includes('dept')) {
      columnMap.department = index;
    } else if (headerLower.includes('div') || headerLower.includes('division')) {
      columnMap.division = index;
    } else if (headerLower.includes('group')) {
      columnMap.groupNumber = index;
    } else if (headerLower.includes('email') || headerLower.includes('mail') || headerLower.includes('e-mail')) {
      columnMap.email = index;
    }
  });

  return columnMap;
}

function summarizeErrors(errors: string[]): string {
  const errorCounts: Record<string, number> = {};

  errors.forEach((error) => {
    if (error.includes('already exists')) {
      errorCounts['duplicate_email'] = (errorCounts['duplicate_email'] || 0) + 1;
    } else if (error.includes('missing data')) {
      errorCounts['missing_data'] = (errorCounts['missing_data'] || 0) + 1;
    } else if (error.includes('department')) {
      errorCounts['department_error'] = (errorCounts['department_error'] || 0) + 1;
    } else {
      errorCounts['other'] = (errorCounts['other'] || 0) + 1;
    }
  });

  const summaryParts: string[] = [];

  if (errorCounts['duplicate_email']) {
    summaryParts.push(`${errorCounts['duplicate_email']} records had duplicate email addresses`);
  }
  if (errorCounts['missing_data']) {
    summaryParts.push(`${errorCounts['missing_data']} records had missing required data`);
  }
  if (errorCounts['department_error']) {
    summaryParts.push(`${errorCounts['department_error']} records had department mapping issues`);
  }
  if (errorCounts['other']) {
    summaryParts.push(`${errorCounts['other']} records failed due to other errors`);
  }

  return summaryParts.join(', ') + '.';
}

function standardizeDepartment(departmentName: string | null): string | null {
  if (!departmentName) return null;

  const deptLower = departmentName.toLowerCase().trim();

  const departmentMap: Record<string, string> = {
    computer: 'CSE',
    'computer science': 'CSE',
    'computer science and engineering': 'CSE',
    'information technology': 'ICT',
    it: 'ICT',
    ict: 'ICT',
    'information and communication technology': 'ICT',
    mechanical: 'MECH',
    'mechanical engineering': 'MECH',
    mech: 'MECH',
    'mech engineering': 'MECH',
    electronics: 'ECE',
    'electronics and communication': 'ECE',
    'electronics & communication': 'ECE',
    'electronics and communication engineering': 'ECE',
    ece: 'ECE',
    ec: 'ECE',
    electronic: 'ECE',
    civil: 'CIVIL',
    'civil engineering': 'CIVIL',
    csbs: 'CSBS',
    'computer science and business systems': 'CSBS',
    'computer science & business systems': 'CSBS',
    'cs&bs': 'CSBS',
    'cs and bs': 'CSBS',
    bsc: 'BSC-DS',
    'bsc-ds': 'BSC-DS',
    'data science': 'BSC-DS',
    'bsc data science': 'BSC-DS',
  };

  for (const [key, value] of Object.entries(departmentMap)) {
    if (deptLower.includes(key)) {
      return value;
    }
  }

  return departmentName.toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    const academicYear = getCurrentAcademicYear();
    let totalSuccessCount = 0;
    const allErrors: string[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const headerRowIndex = findHeaderRowIndex(sheet);

      const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
        range: headerRowIndex,
        defval: null,
      });

      if (jsonData.length === 0) {
        allErrors.push(`No data found in sheet "${sheetName}"`);
        continue;
      }

      const headers = Object.keys(jsonData[0] as object);
      const columnMap = mapHeaders(headers);

      if (columnMap.email === undefined || columnMap.name === undefined || columnMap.rollNumber === undefined) {
        allErrors.push(`Sheet "${sheetName}" is missing required columns (Email, Name, Roll Number)`);
        continue;
      }

      const userData: { email: string; role: string; academicYear: string }[] = [];
      const studentData: {
        email: string;
        name: string;
        rollNumber: string;
        department: string | null;
        division: string | null;
        groupNumber: string | null;
      }[] = [];

      for (const row of jsonData) {
        try {
          const rowObj = row as Record<string, string>;
          const rowValues = Object.values(rowObj);

          const email = rowValues[columnMap.email]?.toString().trim();
          const name = rowValues[columnMap.name]?.toString().trim();
          const rollNumber = rowValues[columnMap.rollNumber]?.toString().trim();
          const rawDepartment =
            columnMap.department !== undefined ? rowValues[columnMap.department]?.toString().trim() : null;
          const division = columnMap.division !== undefined ? rowValues[columnMap.division]?.toString().trim() : null;
          const groupNumber =
            columnMap.groupNumber !== undefined ? rowValues[columnMap.groupNumber]?.toString().trim() : null;
          const department = standardizeDepartment(rawDepartment);

          if (!email || !name || !rollNumber) {
            allErrors.push(`Skipped row with missing data: ${JSON.stringify({ email, name, rollNumber })}`);
            continue;
          }

          userData.push({ email, role: 'student', academicYear });
          studentData.push({ email, name, rollNumber, department, division, groupNumber });
        } catch (error) {
          console.error('Error processing row:', error);
          allErrors.push(error instanceof Error ? error.message : 'Unknown error');
        }
      }

      if (userData.length === 0) continue;

      const emails = userData.map((u) => u.email);

      // Check for existing accounts for this specific academic year — same email in a prior
      // year does NOT count as a duplicate; a new account is created for the new year.
      const existingUsers = await db
        .select({ id: user.id, email: user.email })
        .from(user)
        .where(and(inArray(user.email, emails), eq(user.academicYear, academicYear)));

      const existingEmails = new Set(existingUsers.map((u) => u.email));

      const newUserData = userData.filter((u) => !existingEmails.has(u.email));
      const newStudentData = studentData.filter((s) => !existingEmails.has(s.email));

      existingEmails.forEach((email) => {
        allErrors.push(`User with email ${email} already exists for ${academicYear}`);
      });

      if (newUserData.length === 0) continue;

      const insertedUsers = await db
        .insert(user)
        .values(newUserData)
        .returning({ id: user.id, email: user.email });

      const emailToIdMap = new Map(insertedUsers.map((u) => [u.email, u.id]));

      const studentRecords = newStudentData
        .map((s) => {
          const userId = emailToIdMap.get(s.email);
          if (!userId) return null;
          return {
            userId,
            name: s.name,
            rollNumber: s.rollNumber,
            department: s.department,
            division: s.division,
            groupNumber: s.groupNumber,
            email: s.email,
          };
        })
        .filter((record): record is NonNullable<typeof record> => record !== null);

      if (studentRecords.length > 0) {
        await db.insert(student).values(studentRecords);
        totalSuccessCount += studentRecords.length;
      }
    }

    if (totalSuccessCount === 0 && allErrors.length > 0) {
      return NextResponse.json(
        { message: 'Failed to import any student records', errors: allErrors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${totalSuccessCount} student records.`,
      details: totalSuccessCount > 0 ? `${totalSuccessCount} students were added to the system.` : '',
      count: totalSuccessCount,
      skippedCount: allErrors.length,
      skippedMessage: allErrors.length > 0 ? `${allErrors.length} records were skipped due to errors.` : '',
      errors: allErrors.length > 0 ? allErrors : undefined,
      errorSummary: allErrors.length > 0 ? summarizeErrors(allErrors) : undefined,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to process Excel file' },
      { status: 500 }
    );
  }
}
