import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { db } from '@/drizzle/db';
import { feedback, user } from '@/drizzle/schema'; // adjust path as per your project
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Validate the role is "student"
    const userRecord = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .then((rows) => rows[0]);

    if (!userRecord || userRecord.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const body = await req.json();

    // Basic validation — you can enhance this based on required fields
    if (!body.internshipDurationWeeks || !body.internshipLocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(feedback).values({
      userId: userId,

      // Section A
      internshipDurationWeeks: body.internshipDurationWeeks,
      internshipLocation: body.internshipLocation,

      // Section B
      civicResponsibility: body.civicResponsibility,
      societalAwareness: body.societalAwareness,
      engineeringToSociety: body.engineeringToSociety,
      socialResponsibility: body.socialResponsibility,
      ngoUnderstanding: body.ngoUnderstanding,

      // Section C
      problemIdentification: body.problemIdentification,
      analyticalThinking: body.analyticalThinking,
      toolApplication: body.toolApplication,
      incompleteDataHandling: body.incompleteDataHandling,
      collaborationSkills: body.collaborationSkills,

      // Section D
      communicationSkills: body.communicationSkills,
      confidenceDiversity: body.confidenceDiversity,
      timeManagement: body.timeManagement,
      careerInfluence: body.careerInfluence,
      initiativeConfidence: body.initiativeConfidence,

      // Section E
      usedDataForms: body.usedDataForms,
      usedSpreadsheets: body.usedSpreadsheets,
      usedMobileApps: body.usedMobileApps,
      usedProgrammingTools: body.usedProgrammingTools,
      programmingToolsName: body.programmingToolsName,
      usedIoTDevices: body.usedIoTDevices,
      noneOfAbove: body.noneOfAbove,
      academicHelpfulness: body.academicHelpfulness,
      academicHelpExplanation: body.academicHelpExplanation,

      // Section F
      realWorldProblem: body.realWorldProblem,
      problemSolution: body.problemSolution,

      // Section G
      futureEngagement: body.futureEngagement,
      recommendInternship: body.recommendInternship,
      recommendationReason: body.recommendationReason,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
