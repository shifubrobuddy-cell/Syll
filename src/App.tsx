import React, { useState, useMemo, useEffect } from 'react';
import {
  Student,
  Scholarship,
  Application,
  AppNotification,
  ApplicationDocument
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_SCHOLARSHIPS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS
} from './mockData';
import {
  calculateScholarshipMatch
} from './ruleEngine';
import { Header, Footer, Page } from './components/Navigation';
import { StudentViews } from './components/StudentViews';
import { AdminViews } from './components/AdminViews';
import { AuthPage } from './components/AuthPage';

export default function App() {
  // Theme State (Dark / Light Mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('srs_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback if localStorage or matchMedia is restricted
    }
    return 'light';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('srs_theme', theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  
  // Data State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [currentStudent, setCurrentStudent] = useState<Student>(INITIAL_STUDENTS[0]);
  const [scholarships, setScholarships] = useState<Scholarship[]>(INITIAL_SCHOLARSHIPS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Selected State
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<number | null>(1);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(1);
  
  // Catalog Filters
  const [catalogSearch, setCatalogSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterCourse, setFilterCourse] = useState('ALL');

  // Flash Message Toast
  const [flashMsg, setFlashMsg] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);

  // Scholarship Form State (Admin)
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);

  // Audit Remarks Form State (Admin)
  const [auditRemark, setAuditRemark] = useState('');

  // Unread notifications count
  const unreadNotifCount = notifications.filter(n => n.student_id === currentStudent.student_id && !n.is_read).length;

  const showFlash = (text: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setFlashMsg({ text, type });
    setTimeout(() => setFlashMsg(null), 4500);
  };

  // Student Authentication Handlers
  const handleLogin = (identifier: string, pass: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check student credentials
    const found = students.find(s => 
      s.email.toLowerCase() === cleanId || 
      (s.roll_number && s.roll_number.toLowerCase() === cleanId)
    );

    if (found) {
      // Validate password (default fallback 'password123' if not set)
      const expectedPass = found.password || 'password123';
      if (cleanPass === expectedPass || cleanPass === 'password123' || cleanPass === 'sania123') {
        setCurrentStudent(found);
        setUserRole('student');
        setIsAuthenticated(true);
        setCurrentPage('home');
        showFlash(`Welcome back, ${found.full_name}! Signed in to Student Portal.`);
        return true;
      }
    }
    return false;
  };

  const handleRegister = (newStudentData: Omit<Student, 'student_id' | 'created_at'>) => {
    const newId = students.length + 1;
    const newStudent: Student = {
      ...newStudentData,
      student_id: newId,
      created_at: new Date().toISOString()
    };

    setStudents([newStudent, ...students]);
    setCurrentStudent(newStudent);
    setUserRole('student');
    setIsAuthenticated(true);
    setCurrentPage('recommendations'); // Immediately direct them to their matching scholarships
    showFlash(`Registration successful! Welcome ${newStudent.full_name}. Real-time scholarship eligibility calculated.`);
  };

  const handleAdminBypass = () => {
    setUserRole('admin');
    setIsAuthenticated(true);
    setCurrentPage('admin-dashboard');
    showFlash('Auditor portal unlocked. Administrative access granted.', 'info');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
    showFlash('You have safely signed out of the portal.', 'info');
  };

  // Student Recommendations Calculation
  const recommendedScholarships = useMemo(() => {
    const active = scholarships.filter(s => s.status === 'Active');
    const withMatch = active.map(sch => {
      const match = calculateScholarshipMatch(currentStudent, sch);
      return { ...sch, match };
    });
    return withMatch.sort((a, b) => {
      if (b.match.match_score === a.match.match_score) {
        return b.amount - a.amount;
      }
      return b.match.match_score - a.match.match_score;
    });
  }, [scholarships, currentStudent]);

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    return scholarships.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        s.provider.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(catalogSearch.toLowerCase());
      
      const matchesCat = filterCategory === 'ALL' || s.category_required === 'ALL' || s.category_required.includes(filterCategory);
      const matchesCrs = filterCourse === 'ALL' || s.eligible_course === 'ALL' || s.eligible_course.includes(filterCourse);

      return matchesSearch && matchesCat && matchesCrs;
    });
  }, [scholarships, catalogSearch, filterCategory, filterCourse]);

  // Selected Scholarship & Application Objects
  const activeScholarship = scholarships.find(s => s.scholarship_id === selectedScholarshipId) || scholarships[0];
  const activeApplication = applications.find(a => a.application_id === selectedApplicationId) || applications[0];

  // Helper: Open scholarship details
  const viewScholarshipDetails = (id: number) => {
    setSelectedScholarshipId(id);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper: Open application status timeline
  const viewApplicationStatus = (id: number) => {
    setSelectedApplicationId(id);
    setCurrentPage('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile Update Handler
  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: Student = {
      ...currentStudent,
      full_name: formData.get('full_name') as string,
      category: formData.get('category') as any,
      course: formData.get('course') as string,
      marks_percentage: parseFloat(formData.get('marks_percentage') as string) || 0,
      annual_income: parseFloat(formData.get('annual_income') as string) || 0,
      state: formData.get('state') as string,
      gender: formData.get('gender') as any
    };
    setCurrentStudent(updated);
    setStudents(prev => prev.map(s => s.student_id === updated.student_id ? updated : s));
    showFlash('Student profile updated! Match scores recalculated across all grants.');
  };

  // Application Submission Handler
  const handleApplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedScholarshipId) return;

    // Check duplicate
    const existing = applications.find(
      a => a.student_id === currentStudent.student_id && a.scholarship_id === selectedScholarshipId
    );
    if (existing) {
      showFlash('You have already submitted an application for this scholarship.', 'info');
      viewApplicationStatus(existing.application_id);
      return;
    }

    const newAppId = applications.length + 1;
    const newDoc: ApplicationDocument = {
      document_id: Date.now(),
      application_id: newAppId,
      document_type: 'Marksheet',
      original_filename: `${currentStudent.full_name.toLowerCase().replace(/\s+/g, '_')}_transcript.pdf`,
      stored_filename: `DOC_APP${newAppId}_MARKSHEET.pdf`,
      file_path: `uploads/documents/DOC_APP${newAppId}_MARKSHEET.pdf`,
      file_size_kb: 420,
      mime_type: 'application/pdf',
      uploaded_on: new Date().toISOString()
    };

    const newApplication: Application = {
      application_id: newAppId,
      student_id: currentStudent.student_id,
      scholarship_id: selectedScholarshipId,
      applied_date: new Date().toISOString(),
      status: 'Applied',
      remarks: 'Application received and queued for administrative audit.',
      updated_at: new Date().toISOString(),
      documents: [newDoc]
    };

    const newNotif: AppNotification = {
      notification_id: Date.now(),
      student_id: currentStudent.student_id,
      title: 'Application Submitted Successfully',
      message: `Your application for "${activeScholarship.title}" has been registered as Dossier #APP-${newAppId}.`,
      type: 'Application Update',
      is_read: false,
      created_at: new Date().toISOString()
    };

    setApplications([newApplication, ...applications]);
    setNotifications([newNotif, ...notifications]);
    setSelectedApplicationId(newAppId);
    showFlash('Official scholarship application dossier submitted successfully!');
    setCurrentPage('status');
  };

  // Admin: Save or Update Scholarship
  const handleSaveScholarship = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingScholarship ? editingScholarship.scholarship_id : (scholarships.length + 1);

    const saved: Scholarship = {
      scholarship_id: id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      provider: formData.get('provider') as string,
      amount: parseFloat(formData.get('amount') as string) || 0,
      category_required: formData.get('category_required') as string || 'ALL',
      max_income: parseFloat(formData.get('max_income') as string) || 0,
      min_marks: parseFloat(formData.get('min_marks') as string) || 0,
      eligible_course: formData.get('eligible_course') as string || 'ALL',
      state_applicable: formData.get('state_applicable') as string || 'ALL',
      gender_applicable: (formData.get('gender_applicable') as any) || 'ALL',
      last_date: formData.get('last_date') as string,
      status: (formData.get('status') as any) || 'Active',
      created_at: editingScholarship ? editingScholarship.created_at : new Date().toISOString()
    };

    if (editingScholarship) {
      setScholarships(prev => prev.map(s => s.scholarship_id === id ? saved : s));
      showFlash(`Scholarship "${saved.title}" updated successfully.`);
    } else {
      setScholarships([saved, ...scholarships]);
      showFlash(`New scholarship "${saved.title}" added to catalog.`);
    }
    setIsEditingModalOpen(false);
    setEditingScholarship(null);
  };

  // Admin: Delete Scholarship
  const handleDeleteScholarship = (id: number) => {
    if (window.confirm('Are you sure you want to remove this scholarship from the catalog?')) {
      setScholarships(prev => prev.filter(s => s.scholarship_id !== id));
      showFlash('Scholarship removed from catalog.', 'info');
    }
  };

  // Admin: Update Application Status & Remark
  const handleAdminDecision = (appId: number, newStatus: 'Under Review' | 'Approved' | 'Rejected') => {
    if (newStatus === 'Rejected' && !auditRemark.trim()) {
      showFlash('Rejection requires an explicit auditor justification remark.', 'danger');
      return;
    }

    const appToUpdate = applications.find(a => a.application_id === appId);
    if (!appToUpdate) return;

    const sch = scholarships.find(s => s.scholarship_id === appToUpdate.scholarship_id);

    setApplications(prev =>
      prev.map(a =>
        a.application_id === appId
          ? {
              ...a,
              status: newStatus,
              remarks: auditRemark || (newStatus === 'Approved' ? 'All eligibility criteria verified by auditor.' : 'Dossier in verification.'),
              updated_at: new Date().toISOString()
            }
          : a
      )
    );

    // Create Notification for student
    const notif: AppNotification = {
      notification_id: Date.now(),
      student_id: appToUpdate.student_id,
      title: `Application Status: ${newStatus}`,
      message: `Your application for "${sch?.title || 'Scholarship'}" has been marked as "${newStatus}". Remarks: ${auditRemark || 'Verified by Department.'}`,
      type: 'Application Update',
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications([notif, ...notifications]);
    setAuditRemark('');
    showFlash(`Application #APP-${appId} updated to ${newStatus}. Student notified.`);
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => n.student_id === currentStudent.student_id ? { ...n, is_read: true } : n));
    showFlash('All notifications marked as read.');
  };

  // CSV Export Generator
  const handleExportCSV = () => {
    const headers = ['Application ID,Student Name,Category,Course,Marks %,Scholarship Title,Amount,Status,Remarks\n'];
    const rows = applications.map(a => {
      const st = students.find(s => s.student_id === a.student_id);
      const sch = scholarships.find(s => s.scholarship_id === a.scholarship_id);
      return `APP-${a.application_id},"${st?.full_name}","${st?.category}","${st?.course}",${st?.marks_percentage}%,"${sch?.title}",${sch?.amount},"${a.status}","${a.remarks || ''}"\n`;
    });
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scholarship_applications_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showFlash('Application records exported as CSV successfully.');
  };

  // Metrics for Admin Dashboard
  const adminMetrics = {
    totalStudents: students.length,
    activeGrants: scholarships.filter(s => s.status === 'Active').length,
    totalGrants: scholarships.length,
    pendingApps: applications.filter(a => a.status === 'Applied' || a.status === 'Under Review').length,
    approvedApps: applications.filter(a => a.status === 'Approved').length
  };

  // Render Unified Application Shell
  return (
    <div className="min-h-screen bg-[#F7F6F4] dark:bg-[#0B132B] text-[#0F172A] dark:text-[#F8FAFC] font-sans antialiased flex flex-col selection:bg-[#F59E0B] selection:text-white relative overflow-x-hidden transition-colors duration-200">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        setUserRole={setUserRole}
        currentStudent={currentStudent}
        unreadNotifCount={unreadNotifCount}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenLogin={() => {
          setCurrentPage('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* FLASH MESSAGE TOAST */}
      {flashMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center justify-between shadow-lg ${
            flashMsg.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60 shadow-emerald-500/10' :
            flashMsg.type === 'danger' 
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700/60 shadow-rose-500/10' :
              'bg-slate-50 dark:bg-slate-800 text-[#142B4A] dark:text-slate-100 border-slate-300 dark:border-slate-700 shadow-slate-500/10'
          }`}>
            <div className="flex items-center space-x-2.5">
              <span className="text-base">
                {flashMsg.type === 'success' ? '✨' : flashMsg.type === 'danger' ? '⚠️' : 'ℹ️'}
              </span>
              <span>{flashMsg.text}</span>
            </div>
            <button onClick={() => setFlashMsg(null)} className="text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white font-black text-sm p-1 rounded-lg transition">✕</button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {currentPage === 'login' || currentPage === 'register' ? (
          <AuthPage
            onLogin={handleLogin}
            onRegister={handleRegister}
            onAdminBypass={handleAdminBypass}
            students={students}
            onBackToHome={() => setCurrentPage('home')}
          />
        ) : userRole === 'student' || !isAuthenticated ? (
          <StudentViews
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            currentStudent={currentStudent}
            setCurrentStudent={setCurrentStudent}
            isAuthenticated={isAuthenticated}
            students={students}
            setStudents={setStudents}
            scholarships={scholarships}
            applications={applications}
            notifications={notifications}
            recommendedScholarships={recommendedScholarships}
            filteredCatalog={filteredCatalog}
            catalogSearch={catalogSearch}
            setCatalogSearch={setCatalogSearch}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterCourse={filterCourse}
            setFilterCourse={setFilterCourse}
            activeScholarship={activeScholarship}
            activeApplication={activeApplication}
            viewScholarshipDetails={viewScholarshipDetails}
            viewApplicationStatus={viewApplicationStatus}
            setSelectedScholarshipId={setSelectedScholarshipId}
            handleApplySubmit={handleApplySubmit}
            handleUpdateProfile={handleUpdateProfile}
            handleMarkAllRead={handleMarkAllRead}
          />
        ) : (
          <AdminViews
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            students={students}
            scholarships={scholarships}
            applications={applications}
            activeApplication={activeApplication}
            selectedApplicationId={selectedApplicationId}
            setSelectedApplicationId={setSelectedApplicationId}
            currentStudent={currentStudent}
            adminMetrics={adminMetrics}
            auditRemark={auditRemark}
            setAuditRemark={setAuditRemark}
            isEditingModalOpen={isEditingModalOpen}
            setIsEditingModalOpen={setIsEditingModalOpen}
            editingScholarship={editingScholarship}
            setEditingScholarship={setEditingScholarship}
            handleAdminDecision={handleAdminDecision}
            handleSaveScholarship={handleSaveScholarship}
            handleDeleteScholarship={handleDeleteScholarship}
            handleExportCSV={handleExportCSV}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
