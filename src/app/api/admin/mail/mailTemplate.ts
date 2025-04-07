import { stageEmailsStudents, stageEmailsFaculty, stageEmailsAdmins } from './MailStages';

export interface MailTemplate {
  subject: string;
  body: string;
}

/**
 * Generates an email template for students when the internship stage changes
 * @param currentStage - The new stage number (1-4)
 * @param studentName - The name of the student
 * @returns The email template with subject and body
 */
export function generateStudentStageChangeEmail(currentStage: number, studentName: string): MailTemplate {
  const stageData = stageEmailsStudents[currentStage];

  if (!stageData) {
    throw new Error(`Invalid stage number: ${currentStage}`);
  }

  return {
    subject: stageData.email.subject,
    body: `Dear ${studentName},\n\n${stageData.email.body}\n\nThe current stage is: ${stageData.stageTitle} (Stage ${currentStage} of 4)\n\nIf you have any questions, please contact your faculty mentor.\n\nBest Regards,\nInternship Coordination Team`,
  };
}

/**
 * Generates an email template for faculty members when the internship stage changes
 * @param currentStage - The new stage number (1-4)
 * @param facultyName - The name of the faculty member
 * @returns The email template with subject and body
 */
export function generateFacultyStageChangeEmail(currentStage: number, facultyName: string): MailTemplate {
  const stageData = stageEmailsFaculty[currentStage];

  if (!stageData) {
    throw new Error(`Invalid stage number: ${currentStage}`);
  }

  const body = stageData.email.body.replace('Dear Faculty,', `Dear ${facultyName},`);

  return {
    subject: stageData.email.subject,
    body: `${body}\n\nCurrent Stage: ${stageData.stageTitle} (Stage ${currentStage} of 4)`,
  };
}

/**
 * Generates an email template for administrators when the internship stage changes
 * @param currentStage - The new stage number (1-4)
 * @param adminName - The name of the administrator
 * @returns The email template with subject and body
 */
export function generateAdminStageChangeEmail(currentStage: number, adminName: string): MailTemplate {
  const stageData = stageEmailsAdmins[currentStage];

  if (!stageData) {
    throw new Error(`Invalid stage number: ${currentStage}`);
  }

  const body = stageData.email.body.replace('Dear Admin,', `Dear ${adminName},`);

  return {
    subject: stageData.email.subject,
    body: `${body}\n\nCurrent Stage: ${stageData.stageTitle} (Stage ${currentStage} of 4)\n\nThis is an automated notification for the internship program stage change.`,
  };
}

/**
 * Generates a batch notification for all stakeholders about stage change
 * @param currentStage - The new stage number (1-4)
 * @returns Object containing templates for all user types
 */
export function generateStageChangeNotifications(currentStage: number): {
  studentTemplate: Omit<MailTemplate, 'body'> & { bodyTemplate: string };
  facultyTemplate: Omit<MailTemplate, 'body'> & { bodyTemplate: string };
  adminTemplate: Omit<MailTemplate, 'body'> & { bodyTemplate: string };
} {
  const studentStage = stageEmailsStudents[currentStage];
  const facultyStage = stageEmailsFaculty[currentStage];
  const adminStage = stageEmailsAdmins[currentStage];

  if (!studentStage || !facultyStage || !adminStage) {
    throw new Error(`Invalid stage number: ${currentStage}`);
  }

  return {
    studentTemplate: {
      subject: studentStage.email.subject,
      bodyTemplate: `Dear {STUDENT_NAME},\n\n${studentStage.email.body}\n\nThe current stage is: ${studentStage.stageTitle} (Stage ${currentStage} of 4)\n\nIf you have any questions, please contact your faculty mentor.\n\nBest Regards,\nInternship Coordination Team`,
    },
    facultyTemplate: {
      subject: facultyStage.email.subject,
      bodyTemplate: `${facultyStage.email.body.replace('Dear Faculty,', 'Dear {FACULTY_NAME},')}
      
Current Stage: ${facultyStage.stageTitle} (Stage ${currentStage} of 4)`,
    },
    adminTemplate: {
      subject: adminStage.email.subject,
      bodyTemplate: `${adminStage.email.body.replace('Dear Admin,', 'Dear {ADMIN_NAME},')}
      
Current Stage: ${adminStage.stageTitle} (Stage ${currentStage} of 4)

This is an automated notification for the internship program stage change.`,
    },
  };
}
