export interface FeedbackData {
  // Section A
  internshipDurationWeeks: number | null;
  internshipLocation: string;
  gender: string;

  // Section B: Civic Awareness (Scale: 1-5)
  civicResponsibility: number | null;
  societalAwareness: number | null;
  engineeringToSociety: number | null;
  socialResponsibility: number | null;
  ngoUnderstanding: number | null;

  // Section C: Problem Solving (Scale: 1-5)
  problemIdentification: number | null;
  analyticalThinking: number | null;
  toolApplication: number | null;
  incompleteDataHandling: number | null;
  collaborationSkills: number | null;

  // Section D: Personal & Professional Dev. (Scale: 1-5)
  communicationSkills: number | null;
  confidenceDiversity: number | null;
  timeManagement: number | null;
  careerInfluence: number | null;
  initiativeConfidence: number | null;

  // Section E: Technical Integration
  usedDataForms: boolean;
  usedSpreadsheets: boolean;
  usedMobileApps: boolean;
  usedProgrammingTools: boolean;
  programmingToolsName: string;
  usedIoTDevices: boolean;
  noneOfAbove: boolean;
  academicHelpfulness: string;
  academicHelpExplanation: string;

  // Section F: Reflection
  realWorldProblem: string;
  problemSolution: string;

  // Section G: Future Engagement
  futureEngagement: string;
  recommendInternship: string;
  recommendationReason: string;
}
