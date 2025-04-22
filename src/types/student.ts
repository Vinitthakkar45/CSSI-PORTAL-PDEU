export interface PersonalDetails {
  rollNumber: string;
  name: string;
  department: string;
  division: string;
  groupNumber: string;
  contactNumber: string;
  profileImage?: string;
}

export interface NGODetails {
  ngoName: string;
  ngoCity: string;
  ngoDistrict: string;
  ngoState: string;
  ngoCountry: string;
  ngoAddress: string;
  ngoNatureOfWork: string;
  ngoEmail: string;
  ngoPhone: string;
  ngoChosen: boolean;
}

export interface ProjectDetails {
  problemDefinition: string;
  proposedSolution: string;
}

export interface DocumentDetails {
  offerLetter?: string;
  report?: string;
  certificate?: string;
  poster?: string;
  weekOnePhoto?: string;
  weekTwoPhoto?: string;
}

export interface StudentProgress {
  stage: number;
}

export type StudentData = PersonalDetails & NGODetails & ProjectDetails & DocumentDetails & StudentProgress;

export type StudentUpdateData = Partial<StudentData>;

export interface StudentUpdateRequest {
  userId: number;
  data: StudentUpdateData;
}

export interface PersonalDetailsRequest {
  userId: number;
  studentData: PersonalDetails;
}

export interface NGODetailsRequest {
  userId: number;
  studentData: NGODetails & ProjectDetails;
}

export interface UserDetails {
  id: number;
  email: string;
  role: string;
  profileData: Partial<StudentData> | null;
}
