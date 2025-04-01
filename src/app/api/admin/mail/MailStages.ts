export interface StageEmail {
  stage: number;
  stageTitle: string;
  email: {
    subject: string;
    body: string;
  };
}

export const stageEmailsStudents: Record<number, Omit<StageEmail, 'stage'>> = {
  1: {
    stageTitle: 'Open NGO Registration',
    email: {
      subject: 'NGO Registration Phase Now Open',
      body: 'The first stage of the internship program has officially begun...',
    },
  },
  2: {
    stageTitle: 'Start Internship Process',
    email: {
      subject: 'Internship Process Initiated – Important Guidelines',
      body: 'The next phase of the internship program has now commenced...',
    },
  },
  3: {
    stageTitle: 'Enable Report Submission',
    email: {
      subject: 'Final Report Submission Window Now Open',
      body: 'The report submission phase for the internship program has officially begun...',
    },
  },
  4: {
    stageTitle: 'Initiate Evaluation Process',
    email: {
      subject: 'Internship Evaluation Process Has Started',
      body: 'The final stage of the internship program has now begun...',
    },
  },
};

export const stageEmailsFaculty: Record<number, Omit<StageEmail, 'stage'>> = {
  1: {
    stageTitle: 'NGO Registration Phase for Faculty',
    email: {
      subject: 'Faculty Notification: NGO Registration Phase Open',
      body: 'Dear Faculty,\n\nThe NGO registration phase for students has now commenced. Please ensure that students complete their registration process on time. Your guidance and oversight are crucial in helping them navigate the registration process smoothly.\n\nFeel free to reach out if you have any concerns regarding the registration process.\n\nBest Regards,\nAdmin Team',
    },
  },
  2: {
    stageTitle: 'Internship Process Monitoring',
    email: {
      subject: 'Faculty Alert: Internship Process Has Started',
      body: 'Dear Faculty,\n\nThe internship process for students has officially begun. Kindly monitor their progress and ensure that they adhere to the necessary documentation and reporting guidelines.\n\nRegular status updates are required to ensure transparency and accountability. Please assist students in resolving any challenges they might face.\n\nBest Regards,\nAdmin Team',
    },
  },
  3: {
    stageTitle: 'Report Submission Phase',
    email: {
      subject: 'Faculty Notification: Report Submission Window Open',
      body: 'Dear Faculty,\n\nThe report submission phase has started. Students are now required to submit their final internship reports and supporting documents. Please remind them to adhere to the submission guidelines to avoid delays in evaluation.\n\nYour role in verifying and validating these submissions is essential for a smooth review process.\n\nBest Regards,\nAdmin Team',
    },
  },
  4: {
    stageTitle: 'Internship Evaluation Process',
    email: {
      subject: 'Faculty Notification: Internship Evaluation Process Initiated',
      body: "Dear Faculty,\n\nThe final stage of the internship program, the evaluation process, has begun. You are requested to assess the students' reports and provide necessary feedback.\n\nIf you require any clarifications or have concerns regarding a student’s submission, please communicate with the admin team.\n\nBest Regards,\nAdmin Team",
    },
  },
};

export const stageEmailsAdmins: Record<number, Omit<StageEmail, 'stage'>> = {
  1: {
    stageTitle: 'NGO Registration Monitoring',
    email: {
      subject: 'Admin Alert: NGO Registration Phase Has Started',
      body: 'Dear Admin,\n\nThe NGO registration phase has now begun. Please oversee the process and ensure that students and faculty complete their registrations within the deadline.\n\nAny registration discrepancies should be addressed promptly. Let’s work together to ensure a smooth start to the internship program.\n\nBest Regards,\nAdmin Team',
    },
  },
  2: {
    stageTitle: 'Internship Process Supervision',
    email: {
      subject: 'Admin Update: Internship Process Has Commenced',
      body: 'Dear Admin,\n\nThe internship phase is now in progress. Please coordinate with faculty members to ensure students are adhering to the required guidelines and documentation process.\n\nIn case of any issues or delays, kindly escalate them for quick resolution.\n\nBest Regards,\nAdmin Team',
    },
  },
  3: {
    stageTitle: 'Report Submission Oversight',
    email: {
      subject: 'Admin Notification: Report Submission Window Open',
      body: 'Dear Admin,\n\nStudents have now entered the report submission phase. Please monitor the process to ensure all reports, certifications, and necessary documents are submitted within the given deadline.\n\nAny late or incomplete submissions should be flagged for review.\n\nBest Regards,\nAdmin Team',
    },
  },
  4: {
    stageTitle: 'Internship Evaluation Coordination',
    email: {
      subject: 'Admin Alert: Internship Evaluation Has Started',
      body: 'Dear Admin,\n\nThe final evaluation phase is now in progress. Faculty members are assessing student reports and performance.\n\nPlease coordinate with evaluators to ensure a fair and timely evaluation process. Reach out if any discrepancies arise during the assessment.\n\nBest Regards,\nAdmin Team',
    },
  },
};
