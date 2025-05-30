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
      body: 'The first stage of the internship program has officially begun.\n\nYou are now required to register with an approved NGO. This step is mandatory to proceed further in the internship process.\n\n Upload any required documentation accurately\n\nComplete the registration within the given deadline\n\n.',
    },
  },
  2: {
    stageTitle: 'Start Internship Process',
    email: {
      subject: 'Internship Process Initiated – Important Guidelines',
      body: 'The next phase of the internship program has now commenced.\n\nYou should begin your internship activities with the NGO you registered with. Make sure to maintain professionalism and adhere to the expectations.\n\n- Work sincerely and gather all required documentation\n\nYour efforts during this phase will directly impact your final evaluation.',
    },
  },
  3: {
    stageTitle: 'Enable Report Submission',
    email: {
      subject: 'Final Report Submission Window Now Open',
      body: 'The report submission phase for the internship program has officially begun.\n\nYou are now expected to submit your final internship report along with any supporting documents.\n\nEnsure the following:\n- The report follows the prescribed format\n- All activities are clearly documented\n- Submission is done before the deadline\n\n.',
    },
  },
  4: {
    stageTitle: 'Initiate Evaluation Process',
    email: {
      subject: 'Internship Evaluation Process Has Started',
      body: 'The final stage of the internship program has now begun.\n\nFaculty members will review your submissions and evaluate your performance based on your report, and overall conduct during the internship.\n\nThank you for participating sincerely.\n\n',
    },
  },
};

export const stageEmailsFaculty: Record<number, Omit<StageEmail, 'stage'>> = {
  1: {
    stageTitle: 'NGO Registration Phase for Faculty',
    email: {
      subject: 'Faculty Notification: NGO Registration Phase Open',
      body: 'Dear Faculty,\n\nThe NGO registration phase for students has now commenced.\n\nPlease ensure that students complete their registration process on time. Your role includes verifying their submissions.\n\nYour guidance and oversight are crucial in helping them navigate the registration process smoothly. This will help lay a solid foundation for the remaining stages of the internship.\n\n',
    },
  },
  2: {
    stageTitle: 'Internship Process Monitoring',
    email: {
      subject: 'Faculty Alert: Internship Process Has Started',
      body: 'Dear Faculty,\n\nThe internship process for students has officially begun.\n\nKindly monitor their progress and ensure that they adhere to the necessary documentation and reporting guidelines. You are also expected to assist students in resolving any challenges they might face.\n\nRegular status updates and proactive communication are required to ensure transparency and accountability.\n\n',
    },
  },
  3: {
    stageTitle: 'Report Submission Phase',
    email: {
      subject: 'Faculty Notification: Report Submission Window Open',
      body: 'Dear Faculty,\n\nThe report submission phase has started. Students are now required to submit their final internship reports and supporting documents.\n\nPlease remind them to adhere to the submission guidelines to avoid delays in evaluation. Your role in verifying and validating these submissions is essential for a smooth review process.\n\n',
    },
  },
  4: {
    stageTitle: 'Internship Evaluation Process',
    email: {
      subject: 'Faculty Notification: Internship Evaluation Process Initiated',
      body: "Dear Faculty,\n\nThe final stage of the internship program, the evaluation process, has begun.\n\nYou are requested to assess the students' reports and provide necessary feedback. Please ensure that evaluations are completed in a timely manner to maintain the overall schedule.\n\n",
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
