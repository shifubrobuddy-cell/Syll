import React, { useState } from 'react';
import {
  Student
} from '../types';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  onLogin: (identifier: string, pass: string) => boolean;
  onRegister: (studentData: Omit<Student, 'student_id' | 'created_at'>) => void;
  onAdminBypass: () => void;
  students: Student[];
  onBackToHome?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLogin,
  onRegister,
  onAdminBypass,
  students,
  onBackToHome
}) => {
  // Mode: student login, admin login, or student register
  const [roleTab, setRoleTab] = useState<'student' | 'admin'>('student');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Student Login Fields
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  // Admin Login Fields
  const [adminKey, setAdminKey] = useState('admin@scholarship.gov.in');
  const [adminPass, setAdminPass] = useState('admin123');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Registration Fields
  const [regFullName, setRegFullName] = useState('Sania Shaikh');
  const [regRollNo, setRegRollNo] = useState('11');
  const [regEmail, setRegEmail] = useState('sania.shaikh@college.edu');
  const [regPassword, setRegPassword] = useState('password123');
  const [regConfirmPassword, setRegConfirmPassword] = useState('password123');
  const [regCourse, setRegCourse] = useState('BCA');
  const [regCategory, setRegCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority'>('OBC');
  const [regMarks, setRegMarks] = useState('84.5');
  const [regIncome, setRegIncome] = useState('200000');
  const [regState, setRegState] = useState('Maharashtra');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetNotice(null);
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your Email Address and Password.');
      return;
    }

    const success = onLogin(email.trim(), password.trim());
    if (!success) {
      setErrorMsg('Invalid login credentials. Click a Quick Demo profile below to sign in instantly.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onAdminBypass();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetNotice(null);

    if (!regFullName.trim() || !regEmail.trim()) {
      setErrorMsg('Full name and email are mandatory.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const parsedMarks = parseFloat(regMarks);
    const parsedIncome = parseFloat(regIncome);

    onRegister({
      full_name: regFullName.trim(),
      roll_number: regRollNo.trim() || '11',
      email: regEmail.trim(),
      password: regPassword,
      dob: '2005-06-20',
      gender: 'Female',
      category: regCategory,
      course: regCourse,
      marks_percentage: isNaN(parsedMarks) ? 84.5 : parsedMarks,
      annual_income: isNaN(parsedIncome) ? 200000 : parsedIncome,
      state: regState,
      guide_name: "Ms. Umulkhair Ma'am"
    });
  };

  const fillCredential = (chosenEmail: string, chosenPass: string) => {
    setEmail(chosenEmail);
    setPassword(chosenPass);
    setErrorMsg(null);
    setResetNotice(null);
    onLogin(chosenEmail, chosenPass);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#F59E0B] selection:text-white transition-colors">
      
      {/* Centered Card matching Screenshot_2026-10-29_224547_007dbd0a.png */}
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-3xl p-8 sm:p-10 border border-slate-200/70 dark:border-slate-700/80 shadow-xl transition-all">
        
        {/* Brand Crest Icon */}
        <div className="w-12 h-12 bg-[#142B4A] dark:bg-amber-500 rounded-2xl flex items-center justify-center shadow-md mx-auto mb-4">
          <span className="font-serif font-black text-2xl text-[#F59E0B] dark:text-slate-950">S</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white text-center tracking-tight">
          {isRegisterMode ? 'Student Registration' : 'Portal Sign In'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm text-center mt-2 mb-6">
          {isRegisterMode 
            ? 'Create your verified student profile to discover matching grants'
            : 'Access your scholarships, recommendations & submissions'}
        </p>

        {/* Reset Notice Alert */}
        {resetNotice && (
          <div className="mb-5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>{resetNotice}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Toggle Tab (Student vs Administrator) */}
        {!isRegisterMode && (
          <div className="bg-[#EFECE6] dark:bg-slate-800 p-1 rounded-xl flex mb-6">
            <button
              type="button"
              onClick={() => {
                setRoleTab('student');
                setErrorMsg(null);
                setResetNotice(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                roleTab === 'student'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleTab('admin');
                setErrorMsg(null);
                setResetNotice(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                roleTab === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Administrator
            </button>
          </div>
        )}

        {/* 1. STUDENT LOGIN FORM */}
        {!isRegisterMode && roleTab === 'student' && (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav.sharma@example.com"
                required
                className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setResetNotice('Password reset link sent to registered college email address.')}
                  className="text-xs font-medium text-[#142B4A] dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 text-sm pr-16 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white/90 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 shadow-xs transition cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1E3A5F] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold py-3.5 rounded-xl text-sm transition shadow-md mt-2 cursor-pointer"
            >
              Sign In to Account
            </button>

            <div className="text-center pt-2 text-xs text-slate-600 dark:text-slate-400">
              Don't have a student account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrorMsg(null);
                  setResetNotice(null);
                }}
                className="font-bold text-slate-900 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Register here
              </button>
            </div>
          </form>
        )}

        {/* 2. ADMINISTRATOR LOGIN FORM */}
        {!isRegisterMode && roleTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Auditor Email / Officer ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="admin@scholarship.gov.in"
                required
                className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Officer Security Key <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 text-sm pr-16 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white/90 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 shadow-xs transition cursor-pointer"
                >
                  {showAdminPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1E3A5F] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold py-3.5 rounded-xl text-sm transition shadow-md mt-2 cursor-pointer"
            >
              Sign In as Administrator
            </button>

            <button
              type="button"
              onClick={onAdminBypass}
              className="w-full bg-[#E6E0F0] dark:bg-slate-800 hover:bg-[#ded6ea] dark:hover:bg-slate-700 text-[#142B4A] dark:text-amber-400 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer border border-transparent dark:border-slate-700"
            >
              Quick 1-Click Auditor Access
            </button>
          </form>
        )}

        {/* 3. STUDENT REGISTRATION FORM */}
        {isRegisterMode && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={regRollNo}
                  onChange={(e) => setRegRollNo(e.target.value)}
                  placeholder="11"
                  required
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                College Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Password *</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Confirm *</label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A]/30 dark:focus:ring-amber-400/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Degree / Course *</label>
                <select
                  value={regCourse}
                  onChange={(e) => setRegCourse(e.target.value)}
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs"
                >
                  <option value="BCA">BCA</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.Sc IT">B.Sc IT</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Tech">M.Tech</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Category *</label>
                <select
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value as any)}
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="Minority">Minority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Marks (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={regMarks}
                  onChange={(e) => setRegMarks(e.target.value)}
                  required
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Family Income (₹) *</label>
                <input
                  type="number"
                  value={regIncome}
                  onChange={(e) => setRegIncome(e.target.value)}
                  required
                  className="w-full bg-[#EBF0FF] dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#142B4A] dark:bg-amber-500 hover:bg-[#1E3A5F] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold py-3 rounded-xl text-xs sm:text-sm transition shadow-md mt-2 cursor-pointer"
            >
              Register & Find Scholarships
            </button>

            <div className="text-center pt-1 text-xs text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrorMsg(null);
                  setResetNotice(null);
                }}
                className="font-bold text-slate-900 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Sign In here
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Quick Demo Access Bar */}
      <div className="mt-8 max-w-md w-full bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          ⚡ Quick 1-Click Demonstration Profiles
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillCredential('sania.shaikh@college.edu', 'password123')}
            className="p-2.5 rounded-xl bg-[#FAF9F7] dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-left transition cursor-pointer"
          >
            <div className="font-bold text-[#142B4A] dark:text-amber-300">Sania Shaikh (Roll #11)</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">BCA • OBC • 84.5%</div>
          </button>
          <button
            type="button"
            onClick={() => fillCredential('aarav.sharma@example.com', 'password123')}
            className="p-2.5 rounded-xl bg-[#FAF9F7] dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-left transition cursor-pointer"
          >
            <div className="font-bold text-[#142B4A] dark:text-amber-300">Aarav Sharma</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">From Screenshot Sample</div>
          </button>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
          Guide: <span className="font-semibold text-slate-700 dark:text-slate-300">Ms. Umulkhair Ma'am</span>
        </div>
      </div>

    </div>
  );
};
