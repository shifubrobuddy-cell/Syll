import React from 'react';
import {
  Student,
  Scholarship,
  Application,
  ScholarshipMatch
} from '../types';
import { formatCurrency, formatDate, calculateScholarshipMatch } from '../ruleEngine';
import {
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  FileCheck,
  Shield,
  FileText,
  User
} from 'lucide-react';
import { Page } from './Navigation';

interface AdminViewsProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  students: Student[];
  scholarships: Scholarship[];
  applications: Application[];
  activeApplication: Application;
  selectedApplicationId: number | null;
  setSelectedApplicationId: (id: number | null) => void;
  currentStudent: Student;
  adminMetrics: {
    totalStudents: number;
    activeGrants: number;
    totalGrants: number;
    pendingApps: number;
    approvedApps: number;
  };
  auditRemark: string;
  setAuditRemark: (remark: string) => void;
  isEditingModalOpen: boolean;
  setIsEditingModalOpen: (open: boolean) => void;
  editingScholarship: Scholarship | null;
  setEditingScholarship: (sch: Scholarship | null) => void;
  handleAdminDecision: (appId: number, status: 'Under Review' | 'Approved' | 'Rejected') => void;
  handleSaveScholarship: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteScholarship: (id: number) => void;
  handleExportCSV: () => void;
}

export const AdminViews: React.FC<AdminViewsProps> = ({
  currentPage,
  setCurrentPage,
  students,
  scholarships,
  applications,
  activeApplication,
  selectedApplicationId,
  setSelectedApplicationId,
  currentStudent,
  adminMetrics,
  auditRemark,
  setAuditRemark,
  isEditingModalOpen,
  setIsEditingModalOpen,
  editingScholarship,
  setEditingScholarship,
  handleAdminDecision,
  handleSaveScholarship,
  handleDeleteScholarship,
  handleExportCSV
}) => {
  return (
    <>
      {/* ===================== PAGE: ADMIN DASHBOARD ===================== */}
      {currentPage === 'admin-dashboard' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#142B4A] dark:text-amber-400 text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Auditor Console
                </span>
                <span className="text-xs text-[#64748B] dark:text-slate-400 font-mono">ID: AUD-SEC-7701</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#142B4A] dark:text-white mt-1.5">
                Executive Administrative Command Center
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportCSV}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#142B4A] dark:text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Export Audit CSV</span>
              </button>
              <button
                onClick={() => {
                  setEditingScholarship(null);
                  setIsEditingModalOpen(true);
                }}
                className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#F59E0B] dark:text-slate-950" />
                <span>New Scholarship</span>
              </button>
            </div>
          </div>

          {/* Metrics Overview Grid with White/Dark Cards & Palette Accents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
              <div className="text-xs uppercase font-bold text-[#64748B] dark:text-slate-400 tracking-wider">Registered Students</div>
              <div className="text-3xl font-bold font-serif text-[#142B4A] dark:text-white my-1">{adminMetrics.totalStudents} Profiles</div>
              <div className="text-xs text-[#142B4A] dark:text-slate-300 font-medium">Verified applicant database</div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
              <div className="text-xs uppercase font-bold text-[#64748B] dark:text-slate-400 tracking-wider">Active Catalog Grants</div>
              <div className="text-3xl font-bold font-serif text-[#10B981] my-1">{adminMetrics.activeGrants} / {adminMetrics.totalGrants}</div>
              <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Live rule-evaluation schemes</div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-amber-200 dark:border-amber-800/80 shadow-sm">
              <div className="text-xs uppercase font-bold text-[#F59E0B] tracking-wider">Pending Dossiers</div>
              <div className="text-3xl font-bold font-serif text-[#F59E0B] my-1">{adminMetrics.pendingApps} Awaiting</div>
              <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Submissions awaiting decision</div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 shadow-sm">
              <div className="text-xs uppercase font-bold text-[#10B981] tracking-wider">Approved Grants</div>
              <div className="text-3xl font-bold font-serif text-[#10B981] my-1">{adminMetrics.approvedApps} Disbursed</div>
              <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Statutory financial clearances</div>
            </div>
          </div>

          {/* Recent Submissions Queue */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700/80 flex justify-between items-center bg-[#F1F5F9]/50 dark:bg-slate-800/60">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <h3 className="font-bold text-[#142B4A] dark:text-white text-base font-serif">Recent Submissions for Audit</h3>
              </div>
              <button
                onClick={() => setCurrentPage('admin-verify')}
                className="text-xs font-bold text-[#142B4A] dark:text-amber-400 hover:underline transition flex items-center space-x-1 cursor-pointer"
              >
                <span>Open Full Verification Desk</span>
                <span>→</span>
              </button>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4 font-bold text-[#64748B] dark:text-slate-400">Applicant</th>
                  <th className="p-4 font-bold text-[#64748B] dark:text-slate-400">Scholarship</th>
                  <th className="p-4 font-bold text-[#64748B] dark:text-slate-400">Merit %</th>
                  <th className="p-4 font-bold text-[#64748B] dark:text-slate-400">Status</th>
                  <th className="p-4 font-bold text-[#64748B] dark:text-slate-400 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {applications.slice(0, 5).map(app => {
                  const st = students.find(s => s.student_id === app.student_id);
                  const sch = scholarships.find(s => s.scholarship_id === app.scholarship_id);
                  return (
                    <tr key={app.application_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="font-bold text-[#0F172A] dark:text-white">{st?.full_name}</div>
                        <div className="text-[11px] text-[#64748B] dark:text-slate-400">{st?.course} • {st?.category}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-[#0F172A] dark:text-slate-200">{sch?.title}</div>
                        <div className="text-[11px] text-[#142B4A] dark:text-amber-400 font-bold font-serif">{formatCurrency(sch?.amount || 0)}</div>
                      </td>
                      <td className="p-4 font-bold text-[#142B4A] dark:text-amber-400">{st?.marks_percentage}%</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          app.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                          app.status === 'Under Review' ? 'bg-amber-50 dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                          app.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' :
                          'bg-slate-100 dark:bg-slate-800 text-[#142B4A] dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApplicationId(app.application_id);
                            setCurrentPage('admin-verify');
                          }}
                          className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                        >
                          Audit Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ===================== PAGE: ADMIN MANAGE SCHOLARSHIPS ===================== */}
      {currentPage === 'admin-scholarships' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">Manage Scholarship Catalog</h1>
              <p className="text-sm text-[#64748B] dark:text-slate-400">Configure institutional eligibility criteria, grants, and deadlines.</p>
            </div>
            <button
              onClick={() => {
                setEditingScholarship(null);
                setIsEditingModalOpen(true);
              }}
              className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#F59E0B] dark:text-slate-950" />
              <span>Add Scholarship</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Title & Provider</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Amount</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Rule Criteria</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Deadline</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Status</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {scholarships.map(s => (
                  <tr key={s.scholarship_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-bold text-[#0F172A] dark:text-white">{s.title}</div>
                      <div className="text-[11px] text-[#64748B] dark:text-slate-400">{s.provider}</div>
                    </td>
                    <td className="p-4 font-bold font-serif text-[#142B4A] dark:text-amber-400">{formatCurrency(s.amount)}</td>
                    <td className="p-4 text-[11px] text-[#64748B] dark:text-slate-400">
                      Cat: <strong className="text-[#0F172A] dark:text-white">{s.category_required}</strong> | Marks: <strong className="text-[#142B4A] dark:text-amber-400">≥{s.min_marks}%</strong>
                    </td>
                    <td className="p-4 text-[#64748B] dark:text-slate-400">{formatDate(s.last_date)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        s.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingScholarship(s);
                          setIsEditingModalOpen(true);
                        }}
                        className="text-[#142B4A] dark:text-amber-400 hover:underline font-bold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteScholarship(s.scholarship_id)}
                        className="text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== PAGE: ADMIN VERIFY APPLICATIONS ===================== */}
      {currentPage === 'admin-verify' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">Application Verification Desk</h1>
            <p className="text-sm text-[#64748B] dark:text-slate-400">Inspect applicant claims against statutory rules and record official approval/rejection decisions.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Application Dossier List */}
            <div className="lg:col-span-1 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm max-h-[600px] overflow-y-auto">
              <div className="p-4 bg-[#F1F5F9] dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-xs text-[#142B4A] dark:text-white">
                Submissions Queue ({applications.length})
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {applications.map(a => {
                  const st = students.find(s => s.student_id === a.student_id);
                  const sch = scholarships.find(s => s.scholarship_id === a.scholarship_id);
                  const isSelected = a.application_id === selectedApplicationId;

                  return (
                    <div
                      key={a.application_id}
                      onClick={() => setSelectedApplicationId(a.application_id)}
                      className={`p-4 cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-50/70 dark:bg-slate-800/90 border-l-4 border-l-[#142B4A] dark:border-l-amber-500'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex justify-between items-start text-xs">
                        <span className="font-bold text-[#142B4A] dark:text-amber-400">#APP-{String(a.application_id).padStart(4, '0')}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          a.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                          a.status === 'Under Review' ? 'bg-amber-50 dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                          a.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' :
                          'bg-slate-100 dark:bg-slate-800 text-[#142B4A] dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}>
                          {a.status}
                        </span>
                      </div>
                      <div className="font-semibold text-[#0F172A] dark:text-white text-xs mt-1">{st?.full_name}</div>
                      <div className="text-[11px] text-[#64748B] dark:text-slate-400 line-clamp-1">{sch?.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dossier Audit Detail Panel */}
            <div className="lg:col-span-2 space-y-6">
              {activeApplication ? (
                (() => {
                  const st = students.find(s => s.student_id === activeApplication.student_id) || currentStudent;
                  const sch = scholarships.find(s => s.scholarship_id === activeApplication.scholarship_id) || scholarships[0];
                  const match = calculateScholarshipMatch(st, sch);

                  return (
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm space-y-6">
                      
                      <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700/80 pb-4">
                        <div>
                          <span className="text-xs font-bold text-[#64748B] dark:text-slate-400">
                            Auditing Dossier: #APP-{String(activeApplication.application_id).padStart(4, '0')}
                          </span>
                          <h2 className="text-xl font-bold font-serif text-[#142B4A] dark:text-white mt-1">{sch.title}</h2>
                          <div className="text-xs text-[#64748B] dark:text-slate-400">Applicant: <strong className="text-[#0F172A] dark:text-white">{st.full_name}</strong> ({st.email})</div>
                        </div>
                        <span className="bg-[#142B4A] dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold px-3 py-1 rounded-md">
                          {match.match_score}% Score
                        </span>
                      </div>

                      {/* Side by Side Comparison Grid */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-[#F1F5F9] dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-inner">
                          <div className="font-bold text-[#142B4A] dark:text-white uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700 pb-1 flex items-center justify-between">
                            <span>Applicant Claims</span>
                            <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-normal">Self-Declared</span>
                          </div>
                          <div className="text-[#0F172A] dark:text-slate-200">Category: <strong className="text-[#142B4A] dark:text-amber-400">{st.category}</strong></div>
                          <div className="text-[#0F172A] dark:text-slate-200">Marks: <strong className="text-[#142B4A] dark:text-amber-400">{st.marks_percentage}%</strong></div>
                          <div className="text-[#0F172A] dark:text-slate-200">Annual Income: <strong className="text-[#10B981]">{formatCurrency(st.annual_income)}</strong></div>
                          <div className="text-[#0F172A] dark:text-slate-200">Course: <strong>{st.course}</strong></div>
                          <div className="text-[#0F172A] dark:text-slate-200">State: <strong>{st.state}</strong></div>
                        </div>

                        <div className="bg-[#F1F5F9] dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-inner">
                          <div className="font-bold text-[#F59E0B] uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700 pb-1 flex items-center justify-between">
                            <span>Statutory Criteria</span>
                            <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-normal">Gazette Rules</span>
                          </div>
                          <div className="text-[#0F172A] dark:text-slate-200">Required Cat: <strong className="text-[#142B4A] dark:text-amber-400">{sch.category_required}</strong></div>
                          <div className="text-[#0F172A] dark:text-slate-200">Cutoff Marks: <strong className="text-[#142B4A] dark:text-amber-400">≥{sch.min_marks}%</strong></div>
                          <div className="text-[#0F172A] dark:text-slate-200">Income Cap: <strong className="text-[#10B981]">{sch.max_income > 0 ? formatCurrency(sch.max_income) : 'No Cap'}</strong></div>
                          <div className="text-[#0F172A] dark:text-slate-200">Eligible Courses: <strong>{sch.eligible_course}</strong></div>
                          <div className="text-[#0F172A] dark:text-slate-200">State: <strong>{sch.state_applicable}</strong></div>
                        </div>
                      </div>

                      {/* Attached Documents Audit Table */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-2.5 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                          <span>Uploaded Verification Documents</span>
                        </h4>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                              <tr className="bg-white dark:bg-[#1E293B]">
                                <td className="p-3 font-bold text-[#0F172A] dark:text-white">Marksheet / Official Transcript</td>
                                <td className="p-3 text-[#64748B] dark:text-slate-400 font-mono text-[11px]">marksheet_cert_v1.pdf</td>
                                <td className="p-3 text-right">
                                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                                    ✓ Authenticated
                                  </span>
                                </td>
                              </tr>
                              <tr className="bg-[#F1F5F9]/50 dark:bg-slate-800/40">
                                <td className="p-3 font-bold text-[#0F172A] dark:text-white">Income Certificate Proof</td>
                                <td className="p-3 text-[#64748B] dark:text-slate-400 font-mono text-[11px]">income_proof_2026.pdf</td>
                                <td className="p-3 text-right">
                                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                                    ✓ Authenticated
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Decision Action Form */}
                      <div className="bg-[#F1F5F9] dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3.5 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#142B4A] dark:text-white flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                          <span>Auditor Statutory Decision & Remarks</span>
                        </h4>
                        <textarea
                          value={auditRemark}
                          onChange={(e) => setAuditRemark(e.target.value)}
                          placeholder="Add official verification notes, audit justifications, or reason for rejection..."
                          className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500 placeholder-[#64748B] dark:placeholder-slate-500 transition"
                          rows={2}
                        />
                        <div className="flex flex-wrap gap-2.5">
                          <button
                            onClick={() => handleAdminDecision(activeApplication.application_id, 'Under Review')}
                            className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
                          >
                            Mark Under Review
                          </button>
                          <button
                            onClick={() => handleAdminDecision(activeApplication.application_id, 'Approved')}
                            className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
                          >
                            ✓ Grant Clearance & Approve
                          </button>
                          <button
                            onClick={() => handleAdminDecision(activeApplication.application_id, 'Rejected')}
                            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
                          >
                            ✕ Reject Application
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })()
              ) : (
                <div className="bg-white dark:bg-[#1E293B] p-8 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center text-[#64748B] dark:text-slate-400 text-sm shadow-sm">
                  Select an application from the queue to start verification.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ===================== PAGE: ADMIN STUDENTS ROSTER ===================== */}
      {currentPage === 'admin-students' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">Registered Student Profiles</h1>
            <p className="text-sm text-[#64748B] dark:text-slate-400">Applicant directory with academic records, categories, and income ceilings.</p>
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Student ID</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Full Name & Email</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Category</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Course</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Marks %</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Annual Income</th>
                  <th className="p-4 font-semibold text-[#64748B] dark:text-slate-400">Domicile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {students.map(st => (
                  <tr key={st.student_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-[#142B4A] dark:text-amber-400">#STU-{String(st.student_id).padStart(4, '0')}</td>
                    <td className="p-4">
                      <div className="font-bold text-[#0F172A] dark:text-white">{st.full_name}</div>
                      <div className="text-[11px] text-[#64748B] dark:text-slate-400">{st.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-[#142B4A] dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                        {st.category}
                      </span>
                    </td>
                    <td className="p-4 text-[#0F172A] dark:text-slate-200">{st.course}</td>
                    <td className="p-4 font-bold text-[#142B4A] dark:text-amber-400">{st.marks_percentage}%</td>
                    <td className="p-4 text-[#10B981] font-semibold">{formatCurrency(st.annual_income)}</td>
                    <td className="p-4 text-[#64748B] dark:text-slate-400">{st.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== PAGE: ADMIN REPORTS & CHARTS ===================== */}
      {currentPage === 'admin-reports' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">Statistical Reports & Analytics</h1>
              <p className="text-sm text-[#64748B] dark:text-slate-400">Real-time data visualization rendered with mathematical visual charts.</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold px-4 py-2 rounded-lg shadow-sm cursor-pointer"
            >
              Export CSV Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 1: Applications by Category */}
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <h3 className="font-bold text-[#142B4A] dark:text-white text-base font-serif">Applications by Social Category</h3>
              <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-4 border-b border-slate-200 dark:border-slate-700">
                {[
                  { label: 'OBC', count: 3, color: '#142B4A' },
                  { label: 'SC', count: 2, color: '#10B981' },
                  { label: 'General', count: 2, color: '#F59E0B' },
                  { label: 'EWS', count: 1, color: '#64748B' },
                  { label: 'Minority', count: 1, color: '#3B82F6' }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-[#142B4A] dark:text-amber-400">{bar.count}</span>
                    <div
                      style={{ height: `${bar.count * 45}px`, backgroundColor: bar.color }}
                      className="w-full rounded-t-md transition-all duration-500 shadow-sm"
                    />
                    <span className="text-[11px] font-bold text-[#64748B] dark:text-slate-400">{bar.label}</span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-[#64748B] dark:text-slate-400 text-center">Live applicant category distribution</div>
            </div>

            {/* Chart 2: Status Breakdown */}
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <h3 className="font-bold text-[#142B4A] dark:text-white text-base font-serif">Application Decision Status Ratios</h3>
              <div className="space-y-4 pt-2">
                {[
                  { label: 'Approved', count: applications.filter(a => a.status === 'Approved').length, total: applications.length, color: 'bg-[#10B981]' },
                  { label: 'Under Review', count: applications.filter(a => a.status === 'Under Review').length, total: applications.length, color: 'bg-[#F59E0B]' },
                  { label: 'Applied / Pending', count: applications.filter(a => a.status === 'Applied').length, total: applications.length, color: 'bg-[#142B4A] dark:bg-indigo-500' },
                  { label: 'Rejected', count: applications.filter(a => a.status === 'Rejected').length, total: applications.length, color: 'bg-rose-600' }
                ].map((row, i) => {
                  const pct = row.total > 0 ? Math.round((row.count / row.total) * 100) : 0;
                  return (
                    <div key={i} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-[#0F172A] dark:text-slate-200">
                        <span>{row.label}</span>
                        <span>{row.count} ({pct}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${row.color} transition-all duration-500`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================== ADMIN ADD / EDIT SCHOLARSHIP MODAL ===================== */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
              <h2 className="text-xl font-bold font-serif text-[#142B4A] dark:text-white">
                {editingScholarship ? 'Edit Scholarship Criteria' : 'Add New Scholarship'}
              </h2>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveScholarship} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingScholarship?.title || ''}
                    required
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Provider</label>
                  <input
                    type="text"
                    name="provider"
                    defaultValue={editingScholarship?.provider || ''}
                    required
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingScholarship?.description || ''}
                  required
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={editingScholarship?.amount || 50000}
                    required
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Deadline</label>
                  <input
                    type="date"
                    name="last_date"
                    defaultValue={editingScholarship?.last_date || '2026-12-31'}
                    required
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingScholarship?.status || 'Active'}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  >
                    <option value="Active" className="dark:bg-slate-800">Active</option>
                    <option value="Inactive" className="dark:bg-slate-800">Inactive</option>
                  </select>
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#142B4A] dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                Rule-Based Eligibility Parameters
              </h4>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    name="category_required"
                    defaultValue={editingScholarship?.category_required || 'ALL'}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                    placeholder="ALL or OBC,SC"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Max Income (₹)</label>
                  <input
                    type="number"
                    name="max_income"
                    defaultValue={editingScholarship?.max_income || 0}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                    placeholder="0 for open"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Min Marks %</label>
                  <input
                    type="number"
                    step="0.1"
                    name="min_marks"
                    defaultValue={editingScholarship?.min_marks || 0}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Eligible Courses</label>
                  <input
                    type="text"
                    name="eligible_course"
                    defaultValue={editingScholarship?.eligible_course || 'ALL'}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                    placeholder="ALL or BCA,B.Tech"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">State Domicile</label>
                  <input
                    type="text"
                    name="state_applicable"
                    defaultValue={editingScholarship?.state_applicable || 'ALL'}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                    placeholder="ALL or Maharashtra"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-[#64748B] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
