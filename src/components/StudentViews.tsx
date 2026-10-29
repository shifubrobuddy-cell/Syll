import React from 'react';
import {
  Student,
  Scholarship,
  Application,
  AppNotification,
  CriteriaCheck,
  ScholarshipMatch
} from '../types';
import { formatCurrency, formatDate, calculateScholarshipMatch } from '../ruleEngine';
import {
  Award,
  ChevronRight,
  Search,
  ArrowLeft,
  FileText,
  User,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Page } from './Navigation';

interface StudentViewsProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentStudent: Student;
  setCurrentStudent: React.Dispatch<React.SetStateAction<Student>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  scholarships: Scholarship[];
  applications: Application[];
  notifications: AppNotification[];
  recommendedScholarships: (Scholarship & { match: ScholarshipMatch })[];
  filteredCatalog: Scholarship[];
  catalogSearch: string;
  setCatalogSearch: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  filterCourse: string;
  setFilterCourse: (val: string) => void;
  activeScholarship: Scholarship;
  activeApplication: Application;
  viewScholarshipDetails: (id: number) => void;
  viewApplicationStatus: (id: number) => void;
  setSelectedScholarshipId: (id: number | null) => void;
  handleApplySubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleUpdateProfile: (e: React.FormEvent<HTMLFormElement>) => void;
  handleMarkAllRead: () => void;
  isAuthenticated?: boolean;
}

export const StudentViews: React.FC<StudentViewsProps> = ({
  currentPage,
  setCurrentPage,
  currentStudent,
  isAuthenticated = false,
  scholarships,
  applications,
  notifications,
  recommendedScholarships,
  filteredCatalog,
  catalogSearch,
  setCatalogSearch,
  filterCategory,
  setFilterCategory,
  filterCourse,
  setFilterCourse,
  activeScholarship,
  activeApplication,
  viewScholarshipDetails,
  viewApplicationStatus,
  setSelectedScholarshipId,
  handleApplySubmit,
  handleUpdateProfile,
  handleMarkAllRead
}) => {
  return (
    <>
      {/* ===================== PAGE: PORTAL HOME ===================== */}
      {currentPage === 'home' && (
        <div className="space-y-14">
          
          {/* Hero Section matching Screenshot_2026-10-29_224530_1d701f43.png */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2 sm:pt-6">
            
            {/* Left Column: Heading, Badge, Description, Buttons */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 bg-[#FBF7EE] dark:bg-amber-950/40 border border-[#EADBBD] dark:border-amber-700/50 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold text-[#8C6527] dark:text-amber-300 uppercase tracking-wider shadow-xs">
                <span className="text-[#F59E0B] text-sm">★</span>
                <span>SCHOLARSHIP DISCOVERY PLATFORM</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl font-serif font-black text-[#142B4A] dark:text-white tracking-tight leading-tight">
                  Find Scholarships.
                </h1>
                <div className="text-4xl sm:text-6xl font-serif italic text-[#1E3A5F] dark:text-amber-400 tracking-tight leading-tight">
                  That Find You.
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl pt-2">
                Discover verified funding opportunities matched precisely to your academic course, category, family income, and state domicile. Transparent rule-based evaluation with real-time tracking.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      setCurrentPage('recommendations');
                    } else {
                      setCurrentPage('login');
                    }
                  }}
                  className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1E3A5F] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase px-7 py-4 rounded-xl shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
                >
                  FIND MY SCHOLARSHIPS
                </button>
                <button
                  onClick={() => setCurrentPage('catalog')}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-black text-xs sm:text-sm tracking-wider uppercase px-7 py-4 rounded-xl shadow-sm hover:shadow transition active:scale-95 cursor-pointer"
                >
                  EXPLORE SCHOLARSHIPS
                </button>
              </div>
            </div>

            {/* Right Column: AUTOMATED MATCHING PIPELINE Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-[#162238] rounded-3xl border border-slate-200/90 dark:border-slate-700/80 p-6 sm:p-7 shadow-xl space-y-3.5 relative">
                
                {/* Card Header */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    AUTOMATED MATCHING PIPELINE
                  </span>
                  <span className="bg-[#EAF7EE] dark:bg-emerald-950/50 text-[#10B981] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                    ACTIVE ENGINE
                  </span>
                </div>

                {/* Step 01 */}
                <div className="bg-[#F4F1ED] dark:bg-slate-800/90 border-l-4 border-l-[#142B4A] dark:border-l-amber-400 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    STEP 01: STUDENT PROFILE
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {currentStudent.course} • {currentStudent.category} • Marks: {currentStudent.marks_percentage}% • {currentStudent.state}
                  </div>
                </div>

                {/* Down Arrow */}
                <div className="flex justify-center text-[#D97706] dark:text-amber-400 text-base font-bold">
                  ↓
                </div>

                {/* Step 02 */}
                <div className="bg-[#F4F1ED] dark:bg-slate-800/90 border-l-4 border-l-[#142B4A] dark:border-l-amber-400 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      STEP 02: RULE-BASED MATCHING
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                      5/5 Criteria Satisfied
                    </div>
                  </div>
                  <div className="bg-[#142B4A] dark:bg-amber-500 text-[#F59E0B] dark:text-slate-950 text-xs font-black px-2.5 py-1.5 rounded-lg tracking-wider shadow-sm">
                    100% MATCH
                  </div>
                </div>

                {/* Down Arrow */}
                <div className="flex justify-center text-[#D97706] dark:text-amber-400 text-base font-bold">
                  ↓
                </div>

                {/* Step 03 */}
                <div className="bg-[#FAF6EC] dark:bg-amber-950/30 border border-[#E8DEC9] dark:border-amber-800/50 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-[#8C6527] dark:text-amber-400 uppercase tracking-wider">
                    STEP 03: RECOMMENDED AWARD
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    Post-Matric Backward Classes Grant (₹50,000)
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Section: How The Recommendation Engine Works */}
          <div id="how-it-works-section" className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#142B4A] dark:text-white text-center mb-10">
              How The Recommendation Engine Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-[#E6E0F0] dark:bg-slate-700 text-[#142B4A] dark:text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                  01
                </div>
                <h3 className="text-lg font-bold font-serif text-[#142B4A] dark:text-white mb-2">
                  Profile Ingestion & Normalization
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Your academic marks, category reservation, enrolled course, and household annual income are converted into standardized criteria nodes.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-[#FAF6EC] dark:bg-amber-950/40 text-[#6F4E37] dark:text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                  02
                </div>
                <h3 className="text-lg font-bold font-serif text-[#142B4A] dark:text-white mb-2">
                  Deterministic Multi-Rule Matching
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Every grant is evaluated through 5 explicit mathematical filters: Minimum Marks, Income Cap, Category Match, Eligible Course, and Domicile State.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                  03
                </div>
                <h3 className="text-lg font-bold font-serif text-[#142B4A] dark:text-white mb-2">
                  Ranked Awards & 1-Click Apply
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Eligible scholarships are scored and sorted by priority. Students submit verifiable digital dossiers with full administrative tracking.
                </p>
              </div>

            </div>
          </div>

          {/* Quick Stats Grid with Platinum Silver & White Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4 group hover:shadow-md transition">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center font-bold text-2xl shadow-inner group-hover:scale-105 transition">
                {recommendedScholarships.filter(s => s.match.is_eligible).length}
              </div>
              <div>
                <div className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">{recommendedScholarships.filter(s => s.match.is_eligible).length} Grants</div>
                <div className="text-xs font-bold text-[#10B981] dark:text-emerald-400 uppercase tracking-wider">100% Eligible</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4 group hover:shadow-md transition">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 text-[#142B4A] dark:text-amber-400 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-2xl shadow-inner group-hover:scale-105 transition">
                {scholarships.filter(s => s.status === 'Active').length}
              </div>
              <div>
                <div className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">{scholarships.filter(s => s.status === 'Active').length} Opportunities</div>
                <div className="text-xs font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">Active Catalog</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4 group hover:shadow-md transition">
              <div className="w-14 h-14 rounded-2xl bg-[#FBF7EE] dark:bg-amber-950/40 text-[#6F4E37] dark:text-amber-400 border border-[#EADBBD] dark:border-amber-800/50 flex items-center justify-center font-bold text-2xl shadow-inner group-hover:scale-105 transition">
                {applications.filter(a => a.student_id === currentStudent.student_id).length}
              </div>
              <div>
                <div className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">{applications.filter(a => a.student_id === currentStudent.student_id).length} Dossiers</div>
                <div className="text-xs font-bold text-[#6F4E37] dark:text-amber-400 uppercase tracking-wider">My Submissions</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4 group hover:shadow-md transition">
              <div className="w-14 h-14 rounded-2xl bg-[#E6E0F0] dark:bg-purple-950/40 text-[#142B4A] dark:text-purple-300 border border-purple-100 dark:border-purple-800 flex items-center justify-center font-bold text-2xl shadow-inner group-hover:scale-105 transition">
                {currentStudent.marks_percentage}%
              </div>
              <div>
                <div className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">{currentStudent.marks_percentage}%</div>
                <div className="text-xs font-bold text-[#142B4A] dark:text-amber-400 uppercase tracking-wider">Academic Merit</div>
              </div>
            </div>
          </div>

          {/* Top Recommended Opportunities Spotlight */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <h2 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">Premier Matched Opportunities</h2>
                </div>
                <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">Calculated in real-time according to your academic qualifications and household income.</p>
              </div>
              <button
                onClick={() => setCurrentPage(isAuthenticated ? 'recommendations' : 'login')}
                className="text-xs font-bold text-[#142B4A] dark:text-amber-400 hover:text-[#1e3e68] dark:hover:text-amber-300 flex items-center space-x-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl transition hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm cursor-pointer"
              >
                <span>See all recommendations</span>
                <ChevronRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedScholarships.slice(0, 3).map(sch => (
                <div
                  key={sch.scholarship_id}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#142B4A]/40 dark:hover:border-amber-400/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-[#F59E0B] text-slate-950 text-xs font-black px-3 py-1 rounded-lg shadow-sm">
                        {sch.match.match_score}% MATCH
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                        sch.match.is_eligible 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                          : 'bg-amber-50 dark:bg-amber-950/40 text-[#F59E0B] border-amber-200 dark:border-amber-800'
                      }`}>
                        {sch.match.is_eligible ? '✓ 100% Eligible' : 'Check Criteria'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#142B4A] dark:group-hover:text-amber-400 transition mb-1.5 line-clamp-2 font-serif">
                      {sch.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#142B4A] dark:text-amber-400 mb-3">{sch.provider}</div>
                    <p className="text-xs text-[#64748B] dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">{sch.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-[10px] uppercase text-[#64748B] dark:text-slate-400 font-bold tracking-wider">Grant Award</div>
                        <div className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">{formatCurrency(sch.amount)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase text-[#64748B] dark:text-slate-400 font-bold tracking-wider">Deadline</div>
                        <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md">{formatDate(sch.last_date)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => viewScholarshipDetails(sch.scholarship_id)}
                      className="w-full bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold py-3 rounded-xl transition shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Inspect Criteria & Apply</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#F59E0B] dark:text-slate-950" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================== PAGE: RECOMMENDATIONS ===================== */}
      {currentPage === 'recommendations' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-[#142B4A] via-[#1a3860] to-[#0f2038] border border-slate-700/40 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="bg-[#F59E0B] text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                Rule-Based Multi-Criteria Decision Engine
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif mt-3.5 mb-2 text-white">
                Personalized Scholarship Recommendations
              </h1>
              <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
                Every scholarship is calculated against your current profile: <strong className="text-white font-semibold">{currentStudent.course}</strong>, <strong className="text-[#F59E0B] font-semibold">{currentStudent.category}</strong> category, <strong className="text-white font-semibold">{currentStudent.marks_percentage}%</strong> academic marks, <strong className="text-[#10B981] font-semibold">{formatCurrency(currentStudent.annual_income)}</strong> income, and <strong className="text-white font-semibold">{currentStudent.state}</strong> domicile.
              </p>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-6">
            {recommendedScholarships.map(sch => {
              const m = sch.match;
              return (
                <div
                  key={sch.scholarship_id}
                  className={`bg-white dark:bg-[#1E293B] rounded-2xl p-6 sm:p-8 border-l-4 shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md ${
                    m.is_eligible ? 'border-l-[#10B981]' : 'border-l-[#F59E0B]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`font-black text-xs px-3 py-1 rounded-lg shadow-sm ${
                          m.match_score >= 90 
                            ? 'bg-[#F59E0B] text-slate-950 shadow-amber-500/20' 
                            : 'bg-[#142B4A] dark:bg-amber-500 text-white dark:text-slate-950'
                        }`}>
                          {m.match_score}% MATCH
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                          m.is_eligible 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                            : 'bg-amber-50 dark:bg-amber-950/40 text-[#F59E0B] border-amber-200 dark:border-amber-800'
                        }`}>
                          {m.rank_tier}
                        </span>
                        <span className="text-xs text-[#64748B] dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg font-medium">
                          Deadline: {formatDate(sch.last_date)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0F172A] dark:text-white font-serif">
                        <span 
                          onClick={() => viewScholarshipDetails(sch.scholarship_id)}
                          className="cursor-pointer hover:text-[#142B4A] dark:hover:text-amber-400 transition"
                        >
                          {sch.title}
                        </span>
                      </h3>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#142B4A] dark:text-amber-400">{sch.provider}</div>
                      <p className="text-sm text-[#64748B] dark:text-slate-300 leading-relaxed">{sch.description}</p>
                    </div>

                    {/* Amount & CTA Box */}
                    <div className="bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col justify-between min-w-[240px] text-right shadow-inner">
                      <div>
                        <div className="text-[10px] uppercase text-[#64748B] dark:text-slate-400 font-bold tracking-wider">Grant Award</div>
                        <div className="text-3xl font-bold font-serif text-[#142B4A] dark:text-white my-1">
                          {formatCurrency(sch.amount)}
                        </div>
                      </div>
                      <button
                        onClick={() => viewScholarshipDetails(sch.scholarship_id)}
                        className="w-full bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold py-3 rounded-xl transition mt-4 shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>View Criteria & Apply</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#F59E0B] dark:text-slate-950" />
                      </button>
                    </div>
                  </div>

                  {/* Criteria Breakdown Grid */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-3 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>Mathematical Verification Breakdown</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(m.breakdown).map(([key, critVal]) => {
                        const crit = critVal as CriteriaCheck;
                        return (
                          <div
                            key={key}
                            className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                              crit.status
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                            }`}
                          >
                            <span className={`font-black text-sm ${crit.status ? 'text-[#10B981]' : 'text-rose-600'}`}>
                              {crit.status ? '✓' : '✕'}
                            </span>
                            <div className="flex-1">
                              <strong className="text-[#0F172A] dark:text-white">{crit.label}:</strong> {crit.reason}
                            </div>
                            <span className="font-bold text-[11px] text-[#142B4A] dark:text-amber-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              +{crit.points} pts
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== PAGE: CATALOG & SEARCH ===================== */}
      {currentPage === 'catalog' && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">National Scholarship Catalog</h1>
            </div>
            <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">Browse all government, institutional, and trust-sponsored scholarship opportunities.</p>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1.5">Search Keywords</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#64748B] dark:text-slate-400" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Title, provider, or keyword..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-slate-100 placeholder-[#64748B] dark:placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1.5">Category Filter</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-400 transition"
                >
                  <option value="ALL">All Categories</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="Minority">Minority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1.5">Course Stream</label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-400 transition"
                >
                  <option value="ALL">All Courses</option>
                  <option value="BCA">BCA</option>
                  <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                  <option value="B.Sc Information Technology">B.Sc Information Technology</option>
                  <option value="B.Tech Electrical">B.Tech Electrical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map(sch => {
              const match = calculateScholarshipMatch(currentStudent, sch);
              return (
                <div
                  key={sch.scholarship_id}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm hover:border-[#142B4A]/50 dark:hover:border-amber-400/50 hover:shadow-md transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="bg-slate-100 dark:bg-slate-800 text-[#142B4A] dark:text-amber-400 border border-slate-200 dark:border-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {sch.category_required}
                      </span>
                      <span className="text-xs font-bold text-[#F59E0B] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-lg">
                        {match.match_score}% Match
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#142B4A] dark:group-hover:text-amber-400 transition mb-1.5 font-serif line-clamp-2">
                      {sch.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#142B4A] dark:text-amber-400 mb-3">{sch.provider}</div>
                    <p className="text-xs text-[#64748B] dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">{sch.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#64748B] dark:text-slate-400">Award: <strong className="text-[#142B4A] dark:text-white text-sm font-bold font-serif">{formatCurrency(sch.amount)}</strong></span>
                      <span className="text-[#64748B] dark:text-slate-400">Closes: <strong className="text-[#0F172A] dark:text-slate-200">{formatDate(sch.last_date)}</strong></span>
                    </div>
                    <button
                      onClick={() => viewScholarshipDetails(sch.scholarship_id)}
                      className="w-full bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold py-3 rounded-xl transition shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>View Full Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#F59E0B] dark:text-slate-950" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== PAGE: SCHOLARSHIP DETAILS ===================== */}
      {currentPage === 'details' && activeScholarship && (
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setCurrentPage(isAuthenticated ? 'recommendations' : 'catalog')}
            className="text-xs font-bold text-[#142B4A] dark:text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#F59E0B]" />
            <span>{isAuthenticated ? 'Back to Recommendations' : 'Back to Scholarship Catalog'}</span>
          </button>

          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm space-y-8">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="space-y-2">
                <span className="bg-slate-100 dark:bg-slate-800 text-[#142B4A] dark:text-amber-400 border border-slate-200 dark:border-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {activeScholarship.category_required} Category
                </span>
                <h1 className="text-3xl font-bold font-serif text-[#142B4A] dark:text-white">
                  {activeScholarship.title}
                </h1>
                <div className="text-sm font-semibold text-[#64748B] dark:text-slate-400">
                  Provider: {activeScholarship.provider}
                </div>
              </div>

              <div className="bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl text-right min-w-[200px]">
                <div className="text-xs uppercase font-bold text-[#64748B] dark:text-slate-400">Award Amount</div>
                <div className="text-3xl font-bold font-serif text-[#142B4A] dark:text-white my-1">
                  {formatCurrency(activeScholarship.amount)}
                </div>
                <div className="text-xs text-[#64748B] dark:text-slate-400">Deadline: {formatDate(activeScholarship.last_date)}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-[#142B4A] dark:text-white mb-2 font-serif">Grant Overview</h3>
              <p className="text-sm text-[#0F172A] dark:text-slate-300 leading-relaxed">{activeScholarship.description}</p>
            </div>

            {/* Official Eligibility Specifications Table */}
            <div>
              <h3 className="text-lg font-bold text-[#142B4A] dark:text-white mb-3 font-serif">Statutory Criteria Requirements</h3>
              <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr className="bg-[#F1F5F9] dark:bg-slate-800/80">
                      <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400 w-1/3">Required Social Category</th>
                      <td className="p-3 font-bold text-[#0F172A] dark:text-slate-200">{activeScholarship.category_required}</td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-800/40">
                      <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400">Annual Family Income Ceiling</th>
                      <td className="p-3 font-bold text-[#142B4A] dark:text-amber-400">
                        {activeScholarship.max_income > 0 ? `Maximum ${formatCurrency(activeScholarship.max_income)}` : 'No Income Ceiling'}
                      </td>
                    </tr>
                    <tr className="bg-[#F1F5F9] dark:bg-slate-800/80">
                      <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400">Academic Merit Cutoff</th>
                      <td className="p-3 font-bold text-[#142B4A] dark:text-amber-400">
                        {activeScholarship.min_marks > 0 ? `Minimum ${activeScholarship.min_marks}% marks` : 'Open / Passing Grade'}
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-800/40">
                      <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400">Eligible Academic Courses</th>
                      <td className="p-3 font-bold text-[#0F172A] dark:text-slate-200">{activeScholarship.eligible_course}</td>
                    </tr>
                    <tr className="bg-[#F1F5F9] dark:bg-slate-800/80">
                      <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400">State Domicile Restriction</th>
                      <td className="p-3 font-bold text-[#0F172A] dark:text-slate-200">{activeScholarship.state_applicable}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student Evaluation Match Box */}
            {(() => {
              const match = calculateScholarshipMatch(currentStudent, activeScholarship);
              const existing = applications.find(a => a.student_id === currentStudent.student_id && a.scholarship_id === activeScholarship.scholarship_id);

              return (
                <div className={`p-6 rounded-xl border ${
                  match.is_eligible 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                } space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#142B4A] dark:text-white font-serif">
                      Your Profile Match Result
                    </h4>
                    <span className="bg-[#142B4A] dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold px-3 py-1 rounded-md">
                      {match.match_score}% MATCH
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {Object.entries(match.breakdown).map(([k, critVal]) => {
                      const c = critVal as CriteriaCheck;
                      return (
                        <div key={k} className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                          <span className={c.status ? 'text-[#10B981] font-bold' : 'text-rose-600 font-bold'}>
                            {c.status ? '✓' : '✕'}
                          </span>
                          <span className="text-[#0F172A] dark:text-slate-200"><strong className="text-[#142B4A] dark:text-amber-400">{c.label}:</strong> {c.reason}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 text-center">
                    {existing ? (
                      <div className="space-y-2">
                        <div className="text-xs text-[#0F172A] dark:text-slate-200 font-semibold">
                          You submitted an application on {formatDate(existing.applied_date)}. Current Status: <strong className="text-[#10B981]">{existing.status}</strong>.
                        </div>
                        <button
                          onClick={() => viewApplicationStatus(existing.application_id)}
                          className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold px-6 py-2.5 rounded-lg transition cursor-pointer"
                        >
                          Track Application Timeline →
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedScholarshipId(activeScholarship.scholarship_id);
                          if (!isAuthenticated) {
                            setCurrentPage('login');
                          } else {
                            setCurrentPage('apply');
                          }
                        }}
                        className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-sm font-bold px-8 py-3.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2 mx-auto cursor-pointer"
                      >
                        <span>{isAuthenticated ? 'PROCEED TO OFFICIAL APPLICATION FORM' : 'SIGN IN TO APPLY FOR THIS GRANT'}</span>
                        <ChevronRight className="w-4 h-4 text-[#F59E0B] dark:text-slate-950" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ===================== PAGE: APPLY FORM & DOCUMENT UPLOAD ===================== */}
      {currentPage === 'apply' && activeScholarship && (
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setCurrentPage('details')}
            className="text-xs font-bold text-[#142B4A] dark:text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#F59E0B]" />
            <span>Back to Details</span>
          </button>

          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm space-y-8">
            <div>
              <span className="bg-slate-100 dark:bg-slate-800 text-[#142B4A] dark:text-amber-400 border border-slate-200 dark:border-slate-700 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                Application Submission Dossier
              </span>
              <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white mt-2">
                {activeScholarship.title}
              </h1>
              <div className="text-xs font-semibold text-[#64748B] dark:text-slate-400">
                Provider: {activeScholarship.provider} • Award: {formatCurrency(activeScholarship.amount)}
              </div>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-6">
              
              {/* 1. Verified Profile Snapshot */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#142B4A] dark:text-amber-400 mb-3">
                  1. Verified Student Profile Snapshot
                </h3>
                <div className="bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] dark:text-slate-400">Applicant:</span>
                    <div className="font-bold text-[#0F172A] dark:text-slate-200">{currentStudent.full_name}</div>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-slate-400">Category:</span>
                    <div className="font-bold text-[#0F172A] dark:text-slate-200">{currentStudent.category}</div>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-slate-400">Course:</span>
                    <div className="font-bold text-[#0F172A] dark:text-slate-200">{currentStudent.course}</div>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-slate-400">Marks %:</span>
                    <div className="font-bold text-[#142B4A] dark:text-amber-400">{currentStudent.marks_percentage}%</div>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-slate-400">Annual Income:</span>
                    <div className="font-bold text-[#10B981] dark:text-emerald-400">{formatCurrency(currentStudent.annual_income)}</div>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-slate-400">Domicile:</span>
                    <div className="font-bold text-[#0F172A] dark:text-slate-200">{currentStudent.state}</div>
                  </div>
                </div>
              </div>

              {/* 2. Required Supporting Documents Upload */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#142B4A] dark:text-amber-400 mb-2">
                  2. Upload Mandatory Supporting Credentials
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mb-4">Upload clean PDF or JPG copies (Max 5MB per file).</p>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-[#142B4A] dark:hover:border-amber-400 rounded-xl p-5 text-center bg-[#F1F5F9] dark:bg-slate-800/60 transition cursor-pointer">
                    <FileText className="w-8 h-8 mx-auto text-[#142B4A] dark:text-amber-400 mb-2" />
                    <div className="text-xs font-bold text-[#0F172A] dark:text-slate-200">Academic Marksheet / Transcript</div>
                    <div className="text-[11px] text-[#64748B] dark:text-slate-400">PDF, JPG, or PNG (HSC / Degree Transcript)</div>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 px-2 py-0.5 rounded font-medium border border-emerald-200 dark:border-emerald-800">
                      ✓ Ready to attach
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-[#142B4A] dark:hover:border-amber-400 rounded-xl p-5 text-center bg-[#F1F5F9] dark:bg-slate-800/60 transition cursor-pointer">
                    <Award className="w-8 h-8 mx-auto text-[#142B4A] dark:text-amber-400 mb-2" />
                    <div className="text-xs font-bold text-[#0F172A] dark:text-slate-200">Income Certificate / ITR Acknowledgement</div>
                    <div className="text-[11px] text-[#64748B] dark:text-slate-400">Issued by competent Tahsildar / Revenue Authority</div>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 px-2 py-0.5 rounded font-medium border border-emerald-200 dark:border-emerald-800">
                      ✓ Ready to attach
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-[#142B4A] dark:hover:border-amber-400 rounded-xl p-5 text-center bg-[#F1F5F9] dark:bg-slate-800/60 transition cursor-pointer">
                    <User className="w-8 h-8 mx-auto text-[#142B4A] dark:text-amber-400 mb-2" />
                    <div className="text-xs font-bold text-[#0F172A] dark:text-slate-200">Government Photo ID (Aadhaar / Passport)</div>
                    <div className="text-[11px] text-[#64748B] dark:text-slate-400">Identity and domicile address verification</div>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 px-2 py-0.5 rounded font-medium border border-emerald-200 dark:border-emerald-800">
                      ✓ Ready to attach
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Truthfulness Declaration Checkbox */}
              <div className="bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="declaration"
                  required
                  className="mt-1 w-4 h-4 accent-[#142B4A] dark:accent-amber-400 rounded"
                />
                <label htmlFor="declaration" className="text-xs text-[#0F172A] dark:text-slate-200 leading-relaxed cursor-pointer">
                  I solemnly declare that all academic marks percentage, category declarations, income statements, and attached credentials are authentic. Any discrepancy will lead to immediate disqualification.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-sm py-4 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>SUBMIT OFFICIAL APPLICATION DOSSIER</span>
                <ChevronRight className="w-4 h-4 text-[#F59E0B] dark:text-slate-950" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== PAGE: MY APPLICATIONS ===================== */}
      {currentPage === 'my-applications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">My Scholarship Applications</h1>
              <p className="text-sm text-[#64748B] dark:text-slate-400">Track verification status, review audit remarks, and monitor decision timelines.</p>
            </div>
            <button
              onClick={() => setCurrentPage('recommendations')}
              className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm cursor-pointer"
            >
              + Discover New Grants
            </button>
          </div>

          {applications.filter(a => a.student_id === currentStudent.student_id).length > 0 ? (
            <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F1F5F9] dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 font-bold text-[#64748B] dark:text-slate-300">Application ID</th>
                    <th className="p-4 font-bold text-[#64748B] dark:text-slate-300">Scholarship Opportunity</th>
                    <th className="p-4 font-bold text-[#64748B] dark:text-slate-300">Amount</th>
                    <th className="p-4 font-bold text-[#64748B] dark:text-slate-300">Applied Date</th>
                    <th className="p-4 font-bold text-[#64748B] dark:text-slate-300">Status</th>
                    <th className="p-4 font-bold text-[#64748B] dark:text-slate-300 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications
                    .filter(a => a.student_id === currentStudent.student_id)
                    .map(app => {
                      const sch = scholarships.find(s => s.scholarship_id === app.scholarship_id);
                      return (
                        <tr key={app.application_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-4 font-bold text-[#142B4A] dark:text-amber-400">
                            #APP-{String(app.application_id).padStart(4, '0')}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-[#0F172A] dark:text-white">{sch?.title}</div>
                            <div className="text-[11px] text-[#64748B] dark:text-slate-400">{sch?.provider}</div>
                          </td>
                          <td className="p-4 font-bold font-serif text-sm text-[#142B4A] dark:text-white">
                            {formatCurrency(sch?.amount || 0)}
                          </td>
                          <td className="p-4 text-[#64748B] dark:text-slate-400">{formatDate(app.applied_date)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              app.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                              app.status === 'Under Review' ? 'bg-amber-50 dark:bg-amber-950/40 text-[#F59E0B] border-amber-200 dark:border-amber-800' :
                              app.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' :
                              'bg-slate-100 dark:bg-slate-800 text-[#142B4A] dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => viewApplicationStatus(app.application_id)}
                              className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[#142B4A] dark:text-amber-400 px-3 py-1.5 rounded text-xs font-semibold transition shadow-sm cursor-pointer"
                            >
                              View Timeline →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center space-y-3 shadow-sm">
              <FileCheck className="w-12 h-12 mx-auto text-[#64748B] dark:text-slate-400" />
              <h3 className="text-base font-bold text-[#142B4A] dark:text-white">No Applications Submitted Yet</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-sm mx-auto">
                Explore personalized recommendations curated to your student profile and submit your first grant application.
              </p>
              <button
                onClick={() => setCurrentPage('recommendations')}
                className="bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm cursor-pointer"
              >
                Explore Recommended Grants
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================== PAGE: APPLICATION STATUS TIMELINE ===================== */}
      {currentPage === 'status' && activeApplication && (
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setCurrentPage('my-applications')}
            className="text-xs font-bold text-[#142B4A] dark:text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#F59E0B]" />
            <span>Back to My Applications</span>
          </button>

          {(() => {
            const sch = scholarships.find(s => s.scholarship_id === activeApplication.scholarship_id);
            return (
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700/80 p-8 shadow-sm space-y-8">
                
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700/80 pb-6">
                  <div>
                    <span className="text-xs font-bold text-[#64748B] dark:text-slate-400">
                      Dossier #APP-{String(activeApplication.application_id).padStart(4, '0')}
                    </span>
                    <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white mt-1">
                      {sch?.title}
                    </h1>
                    <div className="text-xs text-[#64748B] dark:text-slate-400 font-semibold mt-1">
                      Provider: {sch?.provider} • Grant: {formatCurrency(sch?.amount || 0)}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    activeApplication.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#10B981] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                    activeApplication.status === 'Under Review' ? 'bg-amber-50 dark:bg-amber-950/50 text-[#F59E0B] dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                    activeApplication.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' :
                    'bg-slate-100 dark:bg-slate-800 text-[#142B4A] dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                    {activeApplication.status}
                  </span>
                </div>

                {/* 4-Stage Progress Timeline */}
                <div className="bg-[#F1F5F9] dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                  <div className="grid grid-cols-4 gap-2 text-center relative">
                    
                    {/* Step 1 */}
                    <div className="space-y-1">
                      <div className="w-8 h-8 rounded-full bg-[#10B981] text-white font-black text-xs flex items-center justify-center mx-auto shadow-sm">
                        ✓
                      </div>
                      <div className="text-[11px] font-bold text-[#0F172A] dark:text-white">Application Submitted</div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400">{formatDate(activeApplication.applied_date)}</div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1">
                      <div className="w-8 h-8 rounded-full bg-[#10B981] text-white font-black text-xs flex items-center justify-center mx-auto shadow-sm">
                        ✓
                      </div>
                      <div className="text-[11px] font-bold text-[#0F172A] dark:text-white">Documents Attached</div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400">3 Files</div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto shadow-sm ${
                        activeApplication.status === 'Under Review' || activeApplication.status === 'Approved' || activeApplication.status === 'Rejected'
                          ? 'bg-[#10B981] text-white'
                          : 'bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-400 border border-slate-300 dark:border-slate-600'
                      }`}>
                        {activeApplication.status === 'Applied' ? '3' : '✓'}
                      </div>
                      <div className="text-[11px] font-bold text-[#0F172A] dark:text-white">Auditor Review</div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400">Desk Verification</div>
                    </div>

                    {/* Step 4 */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto shadow-sm ${
                        activeApplication.status === 'Approved' ? 'bg-[#10B981] text-white' :
                        activeApplication.status === 'Rejected' ? 'bg-rose-600 text-white' :
                        'bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-400 border border-slate-300 dark:border-slate-600'
                      }`}>
                        {activeApplication.status === 'Approved' ? '✓' : activeApplication.status === 'Rejected' ? '✕' : '4'}
                      </div>
                      <div className="text-[11px] font-bold text-[#0F172A] dark:text-white">Final Decision</div>
                      <div className="text-[10px] text-[#64748B] dark:text-slate-400">{activeApplication.status}</div>
                    </div>

                  </div>
                </div>

                {/* Auditor Remarks Card */}
                {activeApplication.remarks && (
                  <div className={`p-4 rounded-xl border text-xs ${
                    activeApplication.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' :
                    activeApplication.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300' :
                    'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                  }`}>
                    <div className="font-bold mb-1">Administrative Auditor Remarks:</div>
                    <div>{activeApplication.remarks}</div>
                  </div>
                )}

                {/* Attached Documents Table */}
                <div>
                  <h3 className="text-sm font-bold text-[#142B4A] dark:text-white mb-3 font-serif">Attached Supporting Documents</h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-[#F1F5F9] dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400">Document Type</th>
                          <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400">Filename</th>
                          <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400">Size</th>
                          <th className="p-3 font-semibold text-[#64748B] dark:text-slate-400">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        {(activeApplication.documents || [
                          {
                            document_id: 1,
                            application_id: activeApplication.application_id,
                            document_type: 'Marksheet',
                            original_filename: 'marksheet_transcript.pdf',
                            stored_filename: 'DOC_MARKSHEET.pdf',
                            file_path: '',
                            file_size_kb: 320,
                            mime_type: 'application/pdf',
                            uploaded_on: activeApplication.applied_date
                          },
                          {
                            document_id: 2,
                            application_id: activeApplication.application_id,
                            document_type: 'Income Certificate',
                            original_filename: 'income_cert.pdf',
                            stored_filename: 'DOC_INCOME.pdf',
                            file_path: '',
                            file_size_kb: 280,
                            mime_type: 'application/pdf',
                            uploaded_on: activeApplication.applied_date
                          }
                        ]).map((doc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-3 font-bold text-[#0F172A] dark:text-white">{doc.document_type}</td>
                            <td className="p-3 text-[#64748B] dark:text-slate-400">{doc.original_filename}</td>
                            <td className="p-3 text-[#64748B] dark:text-slate-400">{doc.file_size_kb} KB</td>
                            <td className="p-3">
                              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold px-2 py-0.5 rounded">
                                ✓ Securely Stored
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* ===================== PAGE: STUDENT PROFILE & CRITERIA EDITOR ===================== */}
      {currentPage === 'profile' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">Student Eligibility Profile</h1>
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              Updating your category, marks, course, or income will immediately re-run the rule-based recommendation engine.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700/80 p-8 shadow-sm">
            {/* Student & Academic Guide Info Banner */}
            <div className="mb-6 p-4 rounded-xl bg-[#F1F5F9] dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-[#F59E0B] tracking-wider">Candidate Credentials</div>
                <div className="text-base font-bold text-[#142B4A] dark:text-white font-serif">{currentStudent.full_name}</div>
                <div className="text-xs text-[#64748B] dark:text-slate-400">Roll Number: <strong className="text-[#142B4A] dark:text-amber-400 font-mono">{currentStudent.roll_number || '11'}</strong></div>
              </div>
              <div className="sm:text-right">
                <div className="text-[10px] uppercase font-bold text-[#10B981] tracking-wider">Academic Project Guide</div>
                <div className="text-xs font-bold text-[#142B4A] dark:text-white">{currentStudent.guide_name || "Ms. Umulkhair Ma'am"}</div>
                <div className="text-[11px] text-[#64748B] dark:text-slate-400">Department of Computer Applications</div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={currentStudent.full_name}
                  required
                  className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Social Category</label>
                  <select
                    name="category"
                    defaultValue={currentStudent.category}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  >
                    <option value="General" className="dark:bg-slate-800">General</option>
                    <option value="OBC" className="dark:bg-slate-800">OBC</option>
                    <option value="SC" className="dark:bg-slate-800">SC</option>
                    <option value="ST" className="dark:bg-slate-800">ST</option>
                    <option value="EWS" className="dark:bg-slate-800">EWS</option>
                    <option value="Minority" className="dark:bg-slate-800">Minority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Gender</label>
                  <select
                    name="gender"
                    defaultValue={currentStudent.gender}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  >
                    <option value="Male" className="dark:bg-slate-800">Male</option>
                    <option value="Female" className="dark:bg-slate-800">Female</option>
                    <option value="Other" className="dark:bg-slate-800">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Enrolled Course Stream</label>
                  <select
                    name="course"
                    defaultValue={currentStudent.course}
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  >
                    <option value="BCA" className="dark:bg-slate-800">BCA</option>
                    <option value="B.Tech Computer Science" className="dark:bg-slate-800">B.Tech Computer Science</option>
                    <option value="B.Sc Information Technology" className="dark:bg-slate-800">B.Sc Information Technology</option>
                    <option value="B.Tech Electrical" className="dark:bg-slate-800">B.Tech Electrical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Academic Marks %</label>
                  <input
                    type="number"
                    step="0.01"
                    name="marks_percentage"
                    defaultValue={currentStudent.marks_percentage}
                    required
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Annual Family Income (₹)</label>
                  <input
                    type="number"
                    name="annual_income"
                    defaultValue={currentStudent.annual_income}
                    required
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#64748B] dark:text-slate-400 mb-1">Home Domicile State</label>
                  <input
                    type="text"
                    name="state"
                    defaultValue={currentStudent.state}
                    required
                    className="w-full px-3 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A] dark:focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1a3860] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-sm py-3 rounded-lg transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Save & Recalculate Recommendations</span>
                  <ChevronRight className="w-4 h-4 text-[#F59E0B] dark:text-slate-950" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== PAGE: NOTIFICATIONS ===================== */}
      {currentPage === 'notifications' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#142B4A] dark:text-white">In-App Alerts & Notifications</h1>
              <p className="text-sm text-[#64748B] dark:text-slate-400">Real-time status updates and department remarks.</p>
            </div>
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-[#142B4A] dark:text-amber-400 hover:underline cursor-pointer"
            >
              Mark All Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications
              .filter(n => n.student_id === currentStudent.student_id)
              .map(notif => (
                <div
                  key={notif.notification_id}
                  className={`p-4 rounded-xl border transition ${
                    notif.is_read
                      ? 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700/80'
                      : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        notif.is_read
                          ? 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          : 'bg-[#142B4A] dark:bg-amber-500 text-white dark:text-slate-950'
                      }`}>
                        {notif.type}
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">{notif.title}</h4>
                    </div>
                    <span className="text-[11px] text-[#64748B] dark:text-slate-400">{formatDate(notif.created_at)}</span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">{notif.message}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
