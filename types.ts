
export enum UserRole {
  PROFESSIONAL = 'professional',
  PATIENT = 'patient',
  ADMIN = 'admin'
}

export type CaseType = 'prenatal' | 'lactancia' | 'crianza' | 'destete';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface WeightControl {
  date: string;
  weight: string;
}

export interface ClinicalCase {
  id: string;
  professionalId: string;
  patientId: string;
  patientName: string;
  status: 'active' | 'closed';
  type: CaseType;
  createdAt: string;
  lastUpdate: string;
  formData?: Record<string, any>;
}

export interface ClinicalFile {
  id: string;
  caseId: string;
  name: string;
  type: string; 
  url: string;
  uploadedBy: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  caseId: string;
  date: string;
  notes: string;
  privateNotes?: string;
}

export interface DailyLog {
  id: string;
  caseId: string;
  patientId: string;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  caseId: string;
  senderId: string;
  content: string;
  createdAt: string;
}
