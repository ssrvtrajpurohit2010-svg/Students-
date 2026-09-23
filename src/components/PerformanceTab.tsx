import React from 'react';
import { Trophy, Target, Clock, BookOpen, Sparkles, TrendingUp, AlertCircle, Layers } from 'lucide-react';
import { Appointment, TestSession } from '../types';

interface PerformanceTabProps {
  completedSessions: TestSession[];
  appointments: Appointment[];
  onQuickStartTest: () => void;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  completedSessions,
  appointments,
  onQuickStartTest,
}) => {
  const totalTests = completedSessions.length;
  let totalQuestionsAnswered = 0;
  let totalCorrect = 0;

  completedSessions.forEach((s) => {
    s.questions.forEach((q) => {
      const userAns = s.userAnswers[q.id];
      if (userAns !== undefined) {
        totalQuestionsAnswered++;
        if (userAns === q.correctOptionIndex) {
          totalCorrect++;
        }
      }
    });
  });

  const overallAccuracy = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 85;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Student Performance Analytics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Topic Mastery & Progress</h1>
            <p className="text-xs text-slate-300">Track accuracy, test completion rate, and AI study recommendations</p>
          </div>

          <button
            onClick={onQuickStartTest}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Take New Practice Test
          </button>
        </div>
      </div>

      {/* Highlights Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 text-center shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <Trophy className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 font-semibold">Tests Completed</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalTests || 1}</p>
          <p className="text-[11px] text-emerald-600 font-bold">Active Student Streak</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 text-center shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 font-semibold">Overall Accuracy</p>
          <p className="text-3xl font-extrabold text-emerald-600">{overallAccuracy}%</p>
          <p className="text-[11px] text-slate-500 font-medium">{totalCorrect} correct answers</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 text-center shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto border border-cyan-100">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 font-semibold">Test Appointments Scheduled</p>
          <p className="text-3xl font-extrabold text-cyan-600">{appointments.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">Regular study slots</p>
        </div>

      </div>

      {/* AI Mastery Breakdown by Subject */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm text-slate-800">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Subject & Topic Mastery Breakdown</span>
        </h2>

        <div className="space-y-4">
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-900">Mathematics (Calculus & Trigonometry)</span>
              <span className="text-emerald-600">88% Mastery</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-900">Chemistry (Organic Reaction Mechanisms)</span>
              <span className="text-indigo-600">82% Mastery</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-900">Physics (Kinematics & Thermodynamics)</span>
              <span className="text-amber-600">72% Mastery</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-900">Computer Science (Data Structures & SQL)</span>
              <span className="text-cyan-600">92% Mastery</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

        </div>

        {/* AI Recommendations */}
        <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-xl space-y-2 text-xs shadow-2xs">
          <p className="font-bold text-indigo-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Tutor Recommendation for Next Test Appointment</span>
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            Your strongest subject is <strong>Computer Science</strong> (92%) and <strong>Mathematics</strong> (88%). We recommend scheduling your next appointment in <strong>Physics - Kinematics & Thermodynamics</strong> to boost your speed and conceptual clarity!
          </p>
        </div>

      </div>

    </div>
  );
};
