export interface Stage {
  number: number;
  title: string;
  description: string;
}

export const stages: Stage[] = [
  {
    number: 1,
    title: 'Open NGO Registration',
    description: 'Open this stage to allow students to register their NGO for the internship.',
  },
  {
    number: 2,
    title: 'Start Internship Process',
    description: 'Open this stage so students can begin their on-site internship and document progress.',
  },
  {
    number: 3,
    title: 'Enable Report Submission',
    description: 'Open this stage so students can submit their internship reports, certificates, and posters.',
  },
  {
    number: 4,
    title: 'Initiate Evaluation Process',
    description: 'Open this stage to assign mentors and evaluators for student internship assessments.',
  },
];
