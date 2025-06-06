import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { student, user } from '@/drizzle/schema';
import * as XLSX from 'xlsx';
import { eq, inArray } from 'drizzle-orm';

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

    // If we found at least 3 header candidates in a row, consider it the header row
    if (headerCandidates >= 3) {
      return rowIdx;
    }
  }

  return 0; // Default to first row if no header row found
}

// Helper function to map column headers to standardized field names
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

// Helper function to summarize errors for UI display
function summarizeErrors(errors: string[]): string {
  // Count occurrences of each error type
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

  // Create a human-readable summary
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

// Helper function to standardize department names
function standardizeDepartment(departmentName: string | null): string | null {
  if (!departmentName) return null;

  const deptLower = departmentName.toLowerCase().trim();

  // Map of full department names to standard abbreviations
  const departmentMap: Record<string, string> = {
    // Computer Science related
    computer: 'CSE',
    'computer science': 'CSE',
    'computer science and engineering': 'CSE',

    // Information Technology related
    'information technology': 'ICT',
    it: 'ICT',
    ict: 'ICT',
    'information and communication technology': 'ICT',

    // Mechanical related
    mechanical: 'MECH',
    'mechanical engineering': 'MECH',
    mech: 'MECH',
    'mech engineering': 'MECH',

    // Electronics related
    electronics: 'ECE',
    'electronics and communication': 'ECE',
    'electronics & communication': 'ECE',
    'electronics and communication engineering': 'ECE',
    ece: 'ECE',
    ec: 'ECE',
    electronic: 'ECE',

    // Civil related
    civil: 'CIVIL',
    'civil engineering': 'CIVIL',

    // CSBS related
    csbs: 'CSBS',
    'computer science and business systems': 'CSBS',
    'computer science & business systems': 'CSBS',
    'cs&bs': 'CSBS',
    'cs and bs': 'CSBS',

    // BSC-DS related
    bsc: 'BSC-DS',
    'bsc-ds': 'BSC-DS',
    'data science': 'BSC-DS',
    'bsc data science': 'BSC-DS',
  };

  // Try to find a match in our map
  for (const [key, value] of Object.entries(departmentMap)) {
    if (deptLower.includes(key)) {
      return value;
    }
  }

  // If no match found, return the original value capitalized
  return departmentName.toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    // Process all sheets instead of just the first one
    let totalSuccessCount = 0;
    const allErrors: string[] = [];

    // Process each sheet in the workbook
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];

      // Find the header row
      const headerRowIndex = findHeaderRowIndex(sheet);

      // Convert sheet to JSON starting from the header row
      const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
        range: headerRowIndex,
        defval: null,
      });

      if (jsonData.length === 0) {
        allErrors.push(`No data found in sheet "${sheetName}"`);
        continue; // Skip to next sheet
      }

      // Get headers from the first row
      const headers = Object.keys(jsonData[0] as object);
      const columnMap = mapHeaders(headers);

      // Check if we have the minimum required columns
      if (columnMap.email === undefined || columnMap.name === undefined || columnMap.rollNumber === undefined) {
        allErrors.push(`Sheet "${sheetName}" is missing required columns (Email, Name, Roll Number)`);
        continue; // Skip to next sheet
      }

      // Prepare batch data for insertion
      const userData: { email: string; role: string }[] = [];
      const studentData: {
        userId?: string;
        email: string;
        name: string;
        rollNumber: string;
        department: string | null;
        division: string | null;
        groupNumber: string | null;
      }[] = [];

      // Process data from this sheet
      for (const row of jsonData) {
        try {
          const rowObj = row as Record<string, string>;
          const rowValues = Object.values(rowObj);

          // Extract student data using column mapping
          const email = rowValues[columnMap.email]?.toString().trim();
          const name = rowValues[columnMap.name]?.toString().trim();
          const rollNumber = rowValues[columnMap.rollNumber]?.toString().trim();
          const rawDepartment =
            columnMap.department !== undefined ? rowValues[columnMap.department]?.toString().trim() : null;
          const division = columnMap.division !== undefined ? rowValues[columnMap.division]?.toString().trim() : null;
          const groupNumber =
            columnMap.groupNumber !== undefined ? rowValues[columnMap.groupNumber]?.toString().trim() : null;

          // Standardize the department name
          const department = standardizeDepartment(rawDepartment);

          // Skip rows with missing essential data
          if (!email || !name || !rollNumber) {
            allErrors.push(`Skipped row with missing data: ${JSON.stringify({ email, name, rollNumber })}`);
            continue;
          }

          // Add to batch arrays
          userData.push({
            email: email,
            role: 'student',
          });

          studentData.push({
            email: email,
            name: name,
            rollNumber: rollNumber,
            department: department,
            division: division,
            groupNumber: groupNumber,
          });
        } catch (error) {
          console.error('Error processing row:', error);
          allErrors.push(error instanceof Error ? error.message : 'Unknown error');
        }
      }

      // Skip if no valid data found in this sheet
      if (userData.length === 0) {
        continue;
      }

      // Check for existing users in batch
      const emails = userData.map((u) => u.email);
      const existingUsers = await db
        .select({ id: user.id, email: user.email })
        .from(user)
        .where(inArray(user.email, emails));

      const existingEmails = new Set(existingUsers.map((u) => u.email));

      // Filter out existing users
      const newUserData = userData.filter((u) => !existingEmails.has(u.email));
      const newStudentData = studentData.filter((s) => !existingEmails.has(s.email));

      // Add existing emails to errors
      existingEmails.forEach((email) => {
        allErrors.push(`User with email ${email} already exists`);
      });

      // Skip if no new users to insert
      if (newUserData.length === 0) {
        continue;
      }

      // Batch insert users
      const insertedUsers = await db.insert(user).values(newUserData).returning({ id: user.id, email: user.email });

      // Create a map of email to user ID
      const emailToIdMap = new Map(insertedUsers.map((u) => [u.email, u.id]));

      // Prepare student records with user IDs
      const studentRecords = newStudentData
        .map((s) => {
          const userId = emailToIdMap.get(s.email);
          // Skip records where userId is undefined
          if (!userId) return null;

          return {
            userId, // This is now guaranteed to be a valid UUID
            name: s.name,
            rollNumber: s.rollNumber,
            department: s.department,
            division: s.division,
            groupNumber: s.groupNumber,
            email: s.email,
          };
        })
        .filter((record): record is NonNullable<typeof record> => record !== null);

      // Batch insert students
      if (studentRecords.length > 0) {
        await db.insert(student).values(studentRecords);
        totalSuccessCount += studentRecords.length;
      }
    }

    if (totalSuccessCount === 0 && allErrors.length > 0) {
      return NextResponse.json(
        {
          message: 'Failed to import any student records',
          errors: allErrors,
        },
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
