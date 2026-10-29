import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Shield,
  User,
  Compass,
  BookmarkCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  FileCheck,
  Sun,
  Moon
} from 'lucide-react';
import { Student } from '../types';

export type Page =
  | 'home'
  | 'recommendations'
  | 'catalog'
  | 'details'
  | 'apply'
  | 'my-applications'
  | 'status'
  | 'profile'
  | 'notifications'
  | 'login'
  | 'register'
  | 'how-it-works'
  | 'admin-dashboard'
  | 'admin-scholarships'
  | 'admin-students'
  | 'admin-verify'
  | 'admin-reports';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  userRole: 'student' | 'admin';
  setUserRole: (role: 'student' | 'admin') => void;
  currentStudent: Student;
  unreadNotifCount: number;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  userRole,
  setUserRole,
  currentStudent,
  unreadNotifCount,
  isAuthenticated,
  onLogout,
  onOpenLogin,
  theme,
  toggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white dark:bg-[#0F172A] border-b border-slate-200/90 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Official Full Logo matching Screenshot */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick(isAuthenticated && userRole === 'admin' ? 'admin-dashboard' : 'home')}
          >
            <div className="p-1 rounded-xl bg-transparent dark:bg-white/95 transition-all">
              <img
                src="/assets/aistudio/scholarship_logo_full_c25f5592.png"
                alt="Scholarship Recommendation System"
                className="h-10 sm:h-12 w-auto object-contain transition duration-200 group-hover:opacity-90"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback-nav');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            </div>
            {/* Fallback branded text if image is unavailable */}
            <div id="logo-fallback-nav" className="hidden items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#142B4A] dark:bg-amber-500 text-[#F59E0B] dark:text-slate-950 flex items-center justify-center font-serif font-black text-xl shadow">
                S
              </div>
              <div className="leading-tight">
                <span className="font-serif font-bold text-lg text-[#142B4A] dark:text-white block">Scholarship</span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500 dark:text-slate-400">RECOMMENDATION SYSTEM</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links: Home, Scholarships, How It Works */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-semibold transition-colors ${
                currentPage === 'home'
                  ? 'text-[#142B4A] dark:text-amber-400 font-bold border-b-2 border-[#142B4A] dark:border-amber-400 pb-0.5'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick(isAuthenticated && userRole === 'student' ? 'recommendations' : 'catalog')}
              className={`text-sm font-semibold transition-colors ${
                currentPage === 'catalog' || currentPage === 'recommendations'
                  ? 'text-[#142B4A] dark:text-amber-400 font-bold border-b-2 border-[#142B4A] dark:border-amber-400 pb-0.5'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400'
              }`}
            >
              Scholarships
            </button>
            <button
              onClick={() => {
                if (currentPage !== 'home') {
                  setCurrentPage('home');
                }
                setTimeout(() => {
                  const el = document.getElementById('how-it-works-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400 transition-colors"
            >
              How It Works
            </button>

            {isAuthenticated && userRole === 'student' && (
              <>
                <button
                  onClick={() => handleNavClick('my-applications')}
                  className={`text-sm font-semibold transition-colors ${
                    currentPage === 'my-applications' || currentPage === 'status'
                      ? 'text-[#142B4A] dark:text-amber-400 font-bold border-b-2 border-[#142B4A] dark:border-amber-400 pb-0.5'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400'
                  }`}
                >
                  My Applications
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`text-sm font-semibold transition-colors ${
                    currentPage === 'profile'
                      ? 'text-[#142B4A] dark:text-amber-400 font-bold border-b-2 border-[#142B4A] dark:border-amber-400 pb-0.5'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400'
                  }`}
                >
                  Profile
                </button>
              </>
            )}

            {isAuthenticated && userRole === 'admin' && (
              <>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`text-sm font-semibold transition-colors ${
                    currentPage === 'admin-dashboard'
                      ? 'text-[#142B4A] dark:text-amber-400 font-bold border-b-2 border-[#142B4A] dark:border-amber-400 pb-0.5'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('admin-scholarships')}
                  className={`text-sm font-semibold transition-colors ${
                    currentPage === 'admin-scholarships'
                      ? 'text-[#142B4A] dark:text-amber-400 font-bold border-b-2 border-[#142B4A] dark:border-amber-400 pb-0.5'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400'
                  }`}
                >
                  Manage Grants
                </button>
                <button
                  onClick={() => handleNavClick('admin-verify')}
                  className={`text-sm font-semibold transition-colors ${
                    currentPage === 'admin-verify'
                      ? 'text-[#142B4A] dark:text-amber-400 font-bold border-b-2 border-[#142B4A] dark:border-amber-400 pb-0.5'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400'
                  }`}
                >
                  Verify Dossiers
                </button>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition flex items-center justify-center shadow-xs cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark / Light Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-90 duration-300" />
              )}
            </button>

            {!isAuthenticated ? (
              // Unauthenticated Actions matching Screenshot
              <>
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#142B4A] dark:bg-amber-500 dark:text-slate-950 hover:bg-[#1E3A5F] dark:hover:bg-amber-400 transition shadow-md cursor-pointer"
                >
                  Get Started
                </button>
              </>
            ) : (
              // Authenticated State with Role and Identity
              <>
                {userRole === 'student' && (
                  <button
                    onClick={() => handleNavClick('notifications')}
                    className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-slate-200 dark:border-slate-700"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4 text-[#142B4A] dark:text-amber-400" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F59E0B] text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Role Switcher */}
                <div className="hidden sm:flex items-center bg-[#E5E4E2] dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => {
                      setUserRole('student');
                      handleNavClick('home');
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      userRole === 'student'
                        ? 'bg-[#142B4A] dark:bg-amber-500 text-white dark:text-slate-950 shadow'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('admin');
                      handleNavClick('admin-dashboard');
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      userRole === 'admin'
                        ? 'bg-[#142B4A] dark:bg-amber-500 text-white dark:text-slate-950 shadow'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    Auditor
                  </button>
                </div>

                {/* Identity Chip */}
                <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-700 text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#E6E0F0] dark:bg-slate-800 text-[#142B4A] dark:text-amber-400 font-bold flex items-center justify-center text-xs">
                    {userRole === 'student' ? 'ST' : 'AD'}
                  </div>
                  <div className="text-xs leading-none">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block truncate max-w-[120px]">
                      {userRole === 'student' ? currentStudent.full_name : 'Auditor'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {userRole === 'student' ? `Roll #${currentStudent.roll_number || '11'}` : 'Admin Desk'}
                    </span>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition flex items-center space-x-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-[#142B4A] dark:hover:text-amber-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 bg-white dark:bg-[#0F172A]">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick(isAuthenticated && userRole === 'student' ? 'recommendations' : 'catalog')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Scholarships
            </button>
            <button
              onClick={() => {
                handleNavClick('home');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              How It Works
            </button>

            {isAuthenticated ? (
              <>
                {userRole === 'student' ? (
                  <>
                    <button
                      onClick={() => handleNavClick('my-applications')}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      My Applications
                    </button>
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavClick('admin-dashboard')}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNavClick('admin-scholarships')}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Manage Grants
                    </button>
                    <button
                      onClick={() => handleNavClick('admin-verify')}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Verify Dossiers
                    </button>
                  </>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 flex flex-col space-y-2 px-2">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#142B4A] dark:bg-amber-500 dark:text-slate-950 rounded-xl shadow"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs py-10 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
            <div className="font-bold text-[#142B4A] dark:text-slate-100 font-serif text-sm">Scholarship Recommendation System</div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl">
            Automated multi-criteria rule matching system aligning student merit, income thresholds, community reservations, and course eligibility with absolute algorithmic transparency.
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3 text-[11px]">
          <span className="bg-[#FAF9F7] dark:bg-slate-800 border border-[#E5E4E2] dark:border-slate-700 text-[#6F4E37] dark:text-amber-400 px-3 py-1.5 rounded-xl font-medium shadow-sm">
            Student: <strong className="text-slate-900 dark:text-white font-bold">Sania Shaikh</strong> (Roll No: <strong>11</strong>)
          </span>
          <span className="bg-[#FAF9F7] dark:bg-slate-800 border border-[#E5E4E2] dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl font-medium shadow-sm">
            Project Guide: <strong className="text-[#6F4E37] dark:text-amber-400 font-bold">Ms. Umulkhair Ma'am</strong>
          </span>
          <span className="bg-[#E6E0F0] dark:bg-slate-800 text-[#142B4A] dark:text-purple-300 border border-purple-200/50 dark:border-slate-700 px-3 py-1.5 rounded-xl font-semibold">
            Palette: Mocha Brown • Platinum Silver • Pale Lavender
          </span>
        </div>
      </div>
    </footer>
  );
};
