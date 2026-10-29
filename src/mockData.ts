import { Student, Scholarship, Application, AppNotification } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 1,
    roll_number: '11',
    guide_name: "Ms. Umulkhair Ma'am",
    full_name: 'Sania Shaikh',
    email: 'sania.shaikh@college.edu',
    password: 'password123',
    dob: '2005-04-12',
    gender: 'Female',
    category: 'OBC',
    annual_income: 180000,
    course: 'BCA',
    marks_percentage: 84.50,
    state: 'Maharashtra',
    created_at: '2026-08-01 10:00:00'
  },
  {
    student_id: 2,
    roll_number: '12',
    guide_name: "Ms. Umulkhair Ma'am",
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    password: 'password123',
    dob: '2004-09-14',
    gender: 'Male',
    category: 'OBC',
    annual_income: 200000,
    course: 'BCA',
    marks_percentage: 84.50,
    state: 'Maharashtra',
    created_at: '2026-08-01 11:00:00'
  },
  {
    student_id: 3,
    full_name: 'Priya Patel',
    email: 'priya.patel@example.com',
    dob: '2003-11-20',
    gender: 'Female',
    category: 'General',
    annual_income: 450000,
    course: 'B.Tech Computer Science',
    marks_percentage: 91.20,
    state: 'Gujarat',
    created_at: '2026-08-02 09:00:00'
  },
  {
    student_id: 3,
    full_name: 'Rohan Kamble',
    email: 'rohan.k@example.com',
    dob: '2004-02-08',
    gender: 'Male',
    category: 'SC',
    annual_income: 120000,
    course: 'B.Sc Information Technology',
    marks_percentage: 78.00,
    state: 'Maharashtra',
    created_at: '2026-08-03 11:00:00'
  },
  {
    student_id: 4,
    full_name: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    dob: '2005-08-19',
    gender: 'Female',
    category: 'EWS',
    annual_income: 150000,
    course: 'BCA',
    marks_percentage: 88.00,
    state: 'West Bengal',
    created_at: '2026-08-04 14:00:00'
  },
  {
    student_id: 5,
    full_name: 'Mohammed Rizwan',
    email: 'm.rizwan@example.com',
    dob: '2003-09-30',
    gender: 'Male',
    category: 'Minority',
    annual_income: 210000,
    course: 'B.Tech Electrical',
    marks_percentage: 76.40,
    state: 'Karnataka',
    created_at: '2026-08-05 16:00:00'
  }
];

export const INITIAL_SCHOLARSHIPS: Scholarship[] = [
  {
    scholarship_id: 1,
    title: 'State Post-Matric Scholarship for Backward Classes',
    description: 'Financial assistance to deserving students belonging to Other Backward Classes (OBC) pursuing undergraduate technical and non-technical programs in accredited institutions.',
    provider: 'Department of Social Justice, Govt. of Maharashtra',
    amount: 50000,
    category_required: 'OBC',
    max_income: 250000,
    min_marks: 70.00,
    eligible_course: 'BCA,B.Sc Information Technology,B.Tech Computer Science',
    state_applicable: 'Maharashtra',
    gender_applicable: 'ALL',
    last_date: '2026-12-31',
    status: 'Active',
    created_at: '2026-07-15 00:00:00'
  },
  {
    scholarship_id: 2,
    title: 'Dr. B.R. Ambedkar National Merit Fellowship',
    description: 'Special state scholarship dedicated to supporting meritorious SC/ST undergraduate students with comprehensive tuition waivers and annual academic stipends.',
    provider: 'Ministry of Social Justice & Empowerment',
    amount: 75000,
    category_required: 'SC,ST',
    max_income: 300000,
    min_marks: 65.00,
    eligible_course: 'ALL',
    state_applicable: 'ALL',
    gender_applicable: 'ALL',
    last_date: '2026-11-30',
    status: 'Active',
    created_at: '2026-07-20 00:00:00'
  },
  {
    scholarship_id: 3,
    title: 'Pragati National Tech Scholarship for Women',
    description: 'Empowering female undergraduates enrolled in technical engineering and computing disciplines to foster higher gender representation in science and technology.',
    provider: 'All India Council for Technical Education (AICTE)',
    amount: 60000,
    category_required: 'ALL',
    max_income: 800000,
    min_marks: 75.00,
    eligible_course: 'BCA,B.Tech Computer Science,B.Tech Electrical',
    state_applicable: 'ALL',
    gender_applicable: 'Female',
    last_date: '2026-10-15',
    status: 'Active',
    created_at: '2026-07-25 00:00:00'
  },
  {
    scholarship_id: 4,
    title: 'Merit-Cum-Means National Scholarship Scheme',
    description: 'Financial grant targeting economically weaker general and minority category candidates demonstrating sustained academic excellence.',
    provider: 'Ministry of Minority Affairs & Higher Education',
    amount: 40000,
    category_required: 'Minority,EWS,General',
    max_income: 250000,
    min_marks: 75.00,
    eligible_course: 'ALL',
    state_applicable: 'ALL',
    gender_applicable: 'ALL',
    last_date: '2026-12-15',
    status: 'Active',
    created_at: '2026-08-01 00:00:00'
  },
  {
    scholarship_id: 5,
    title: 'Apex IT Excellence & Coding Innovators Grant',
    description: 'Corporate social responsibility initiative awarding high-performing computer science and application students striving in software engineering and algorithms.',
    provider: 'Apex Tech Foundation Trust',
    amount: 85000,
    category_required: 'ALL',
    max_income: 500000,
    min_marks: 80.00,
    eligible_course: 'BCA,B.Tech Computer Science,B.Sc Information Technology',
    state_applicable: 'ALL',
    gender_applicable: 'ALL',
    last_date: '2026-09-30',
    status: 'Active',
    created_at: '2026-08-01 00:00:00'
  },
  {
    scholarship_id: 6,
    title: 'Maharashtra EBC Higher Education Tuition Waiver',
    description: 'Tuition reimbursement initiative for students from Economically Backward Classes enrolled in professional undergraduate courses.',
    provider: 'Higher & Technical Education Dept., Maharashtra',
    amount: 35000,
    category_required: 'EWS,General,OBC',
    max_income: 250000,
    min_marks: 60.00,
    eligible_course: 'BCA,B.Tech Computer Science,B.Tech Electrical',
    state_applicable: 'Maharashtra',
    gender_applicable: 'ALL',
    last_date: '2026-11-15',
    status: 'Active',
    created_at: '2026-08-02 00:00:00'
  },
  {
    scholarship_id: 7,
    title: 'National Talent Search Higher Education Fellowship',
    description: 'Prestigious all-India scholarship recognizing students with top 5% academic performance throughout secondary and tertiary schooling.',
    provider: 'National Talent Research Council',
    amount: 100000,
    category_required: 'ALL',
    max_income: 0,
    min_marks: 88.00,
    eligible_course: 'ALL',
    state_applicable: 'ALL',
    gender_applicable: 'ALL',
    last_date: '2026-10-31',
    status: 'Active',
    created_at: '2026-08-03 00:00:00'
  },
  {
    scholarship_id: 8,
    title: 'Karnataka State Domicile Science & Tech Fellowship',
    description: 'State-level endowment grant for students domiciled in Karnataka admitted to engineering and applied computing programs.',
    provider: 'Karnataka Higher Education Board',
    amount: 45000,
    category_required: 'ALL',
    max_income: 350000,
    min_marks: 70.00,
    eligible_course: 'B.Tech Computer Science,B.Tech Electrical,BCA',
    state_applicable: 'Karnataka',
    gender_applicable: 'ALL',
    last_date: '2026-12-20',
    status: 'Active',
    created_at: '2026-08-04 00:00:00'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    application_id: 1,
    student_id: 1,
    scholarship_id: 1,
    applied_date: '2026-08-01 10:15:00',
    status: 'Approved',
    remarks: 'All caste and income certificates thoroughly validated. Academic criteria met with distinction.',
    updated_at: '2026-08-07 11:20:00',
    documents: [
      {
        document_id: 1,
        application_id: 1,
        document_type: 'Marksheet',
        original_filename: 'sania_shaikh_marksheet.pdf',
        stored_filename: 'DOC_APP1_MARKSHEET_8f9a2.pdf',
        file_path: 'uploads/documents/DOC_APP1_MARKSHEET_8f9a2.pdf',
        file_size_kb: 340,
        mime_type: 'application/pdf',
        uploaded_on: '2026-08-01 10:16:00'
      },
      {
        document_id: 2,
        application_id: 1,
        document_type: 'Income Certificate',
        original_filename: 'income_cert_2026.pdf',
        stored_filename: 'DOC_APP1_INCOME_b3e12.pdf',
        file_path: 'uploads/documents/DOC_APP1_INCOME_b3e12.pdf',
        file_size_kb: 280,
        mime_type: 'application/pdf',
        uploaded_on: '2026-08-01 10:16:30'
      }
    ]
  },
  {
    application_id: 2,
    student_id: 1,
    scholarship_id: 5,
    applied_date: '2026-08-05 14:22:00',
    status: 'Under Review',
    remarks: 'Dossier assigned to technical review board for coding credentials verification.',
    updated_at: '2026-08-05 15:00:00',
    documents: [
      {
        document_id: 4,
        application_id: 2,
        document_type: 'Marksheet',
        original_filename: 'sem_transcript.pdf',
        stored_filename: 'DOC_APP2_MARKSHEET_7c2b1.pdf',
        file_path: 'uploads/documents/DOC_APP2_MARKSHEET_7c2b1.pdf',
        file_size_kb: 410,
        mime_type: 'application/pdf',
        uploaded_on: '2026-08-05 14:23:00'
      }
    ]
  },
  {
    application_id: 3,
    student_id: 2,
    scholarship_id: 3,
    applied_date: '2026-08-02 09:30:00',
    status: 'Approved',
    remarks: 'Merit verified (91.2%). Enrolled in B.Tech Computer Science.',
    updated_at: '2026-08-04 14:10:00'
  },
  {
    application_id: 4,
    student_id: 3,
    scholarship_id: 2,
    applied_date: '2026-08-03 11:45:00',
    status: 'Under Review',
    remarks: 'Income and category documents undergoing tahsildar database cross-check.',
    updated_at: '2026-08-03 12:00:00'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    notification_id: 1,
    student_id: 1,
    title: 'Application Approved!',
    message: 'Congratulations! Your application for State Post-Matric Scholarship for Backward Classes has been approved by the department.',
    type: 'Application Update',
    is_read: false,
    created_at: '2026-08-07 11:20:00'
  },
  {
    notification_id: 2,
    student_id: 1,
    title: 'Application Under Review',
    message: 'Your application for Apex IT Excellence & Coding Innovators Grant is now under formal verification.',
    type: 'Application Update',
    is_read: true,
    created_at: '2026-08-05 15:00:00'
  },
  {
    notification_id: 3,
    student_id: 1,
    title: 'New Recommendation Matched',
    message: 'A new scholarship matching your BCA course and Maharashtra domicile is available: Apex IT Excellence Grant.',
    type: 'Recommendation',
    is_read: true,
    created_at: '2026-08-01 09:00:00'
  }
];
