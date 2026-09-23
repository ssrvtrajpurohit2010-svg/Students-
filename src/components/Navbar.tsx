import React from 'react';
import { Calendar, GraduationCap, Sparkles, Trophy, CreditCard, Clock, Play } from 'lucide-react';
import { Subscription, StudentProfile } from '../types';

interface NavbarProps {
  activeTab: 'appointments' | 'take_test' | 'review' | 'subscription' | 'analytics';
  setActiveTab: (tab: 'appointments' | 'take_test' | 'review' | 'subscription' | 'analytics') => void;
  subscription: Subscription;
  studentProfile: StudentProfile;
  onQuickStartTest: () => void;
  onOpenSubscriptionModal: () => void;
  upcomingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  studentProfile,
  onQuickStartTest,
  onOpenSubscriptionModal,
  upcomingCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('appointments')}>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-100 text-white font-bold">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-800">
                  EduTest AI
                </span>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Student Pass
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Appointments & AI Solution Tutor</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              id="nav-appointments-tab"
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'appointments'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Appointments</span>
              {upcomingCount > 0 && (
                <span className="ml-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {upcomingCount}
                </span>
              )}
            </button>

            <button
              id="nav-take-test-tab"
              onClick={() => setActiveTab('take_test')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'take_test'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Play className="w-4 h-4 text-emerald-600" />
              <span>Mock Test Generator</span>
            </button>

            <button
              id="nav-review-tab"
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'review'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Tutor & Solutions</span>
            </button>

            <button
              id="nav-analytics-tab"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Trophy className="w-4 h-4 text-purple-600" />
              <span>Performance</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* ₹1 Subscription Badge */}
            <button
              id="subscription-status-badge"
              onClick={onOpenSubscriptionModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                subscription.isActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/80'
              }`}
              title="Click to view subscription details"
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Pass:</span>
              <span className="font-bold text-slate-900">₹1 / Mo</span>
              {subscription.isActive ? (
                <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                  ACTIVE
                </span>
              ) : (
                <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-bold">
                  Activate
                </span>
              )}
            </button>

            {/* Quick Test Launcher */}
            <button
              id="quick-start-test-btn"
              onClick={onQuickStartTest}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Instant</span> Mock Test
            </button>

            {/* Student Profile avatar */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xs border border-indigo-200">
                {studentProfile.name.charAt(0)}
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'appointments' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Appointments
          </button>

          <button
            onClick={() => setActiveTab('take_test')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'take_test' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" /> Mock Test
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'review' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Explainer
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-purple-600" /> Performance
          </button>
        </div>
      </div>
    </header>
  );
};
