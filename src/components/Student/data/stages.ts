export interface Stage {
  number: number;
  title: string;
  description: string;
}

export const stages: Stage[] = [
  {
    number: 1,
    title: 'NGO Registration',
    description: 'Enter details about the NGO where you will perform your internship.',
  },
  {
    number: 2,
    title: 'Internship Process',
    description: 'Complete your internship on-site and document your progress.',
  },
  {
    number: 3,
    title: 'Report Submission',
    description: 'Upload your internship report, certificate, and poster.',
  },
  {
    number: 4,
    title: 'Evaluation Process',
    description: 'Get assigned to mentors and evaluators for your internship evaluation.',
  },
];
