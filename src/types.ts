export interface Student {
  student_id: number;
  roll_number?: string;
  guide_name?: string;
  full_name: string;
  email: string;
  password?: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';
  annual_income: number;
  course: string;
  marks_percentage: number;
  state: string;
  created_at: string;
}

export interface Scholarship {
  scholarship_id: number;
  title: string;
  description: string;
  provider: string;
  amount: number;
  category_required: string;
  max_income: number;
  min_marks: number;
  eligible_course: string;
  state_applicable: string;
  gender_applicable: 'ALL' | 'Male' | 'Female' | 'Other';
  last_date: string;
  status: 'Active' | 'Inactive' | 'Archived';
  created_at: string;
}

export interface ApplicationDocument {
  document_id: number;
  application_id: number;
  document_type: 'Marksheet' | 'Income Certificate' | 'ID Proof' | 'Caste Certificate' | 'Other';
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size_kb: number;
  mime_type: string;
  uploaded_on: string;
}

export interface Application {
  application_id: number;
  student_id: number;
  scholarship_id: number;
  applied_date: string;
  status: 'Applied' | 'Under Review' | 'Approved' | 'Rejected';
  remarks?: string | null;
  updated_at: string;
  student?: Student;
  scholarship?: Scholarship;
  documents?: ApplicationDocument[];
}

export interface AppNotification {
  notification_id: number;
  student_id: number;
  title: string;
  message: string;
  type: 'Recommendation' | 'Application Update' | 'Deadline Alert' | 'System';
  is_read: boolean;
  created_at: string;
}

export interface CriteriaCheck {
  status: boolean;
  label: string;
  points: number;
  reason: string;
}

export interface RecommendationResult {
  match_score: number;
  is_eligible: boolean;
  rank_tier: string;
  badge_class: string;
  breakdown: Record<string, CriteriaCheck>;
}

export type ScholarshipMatch = RecommendationResult;
