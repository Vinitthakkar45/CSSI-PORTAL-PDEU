export interface Stage {
  number: number;
  title: string;
  description: string;
  long_description: string;
}

export const stages: Stage[] = [
  {
    number: 1,
    title: 'NGO Registration',
    description: 'Students to start selecting and registering their NGO for the internship',
    long_description:
      'Guide students in identifying suitable NGOs based on their interests and project requirements. Help them understand the registration process and necessary documentation. Address any concerns or queries regarding NGO selection and eligibility.',
  },
  {
    number: 2,
    title: 'Internship Process Started',
    description: 'Mentors to provide mentorship to students as they begin their on-site internship',
    long_description:
      'Encourage students to maintain detailed records of their work. Offer insights on best practices for engaging with the NGO and contributing effectively. Provide guidance on problem-solving and professional conduct during the internship.',
  },
  {
    number: 3,
    title: 'Report Submission',
    description:
      'Mentors to review and provide feedback on students’ internship reports, certificates, and posters before submission.',
    long_description:
      'Assist students in structuring their reports with clarity and relevance. Ensure that required documents are complete and formatted correctly. Provide constructive feedback to enhance the quality of their submissions.',
  },
  {
    number: 4,
    title: 'Evaluation Process',
    description:
      'Evaluators to start the assessment process of students’ internship based on report and poster submitted',
    long_description:
      'Engage in discussions with students about their learning outcomes. Assess their reports, presentations, and reflections on the internship. Offer valuable feedback to help students understand their strengths and areas for improvement.',
  },
];
