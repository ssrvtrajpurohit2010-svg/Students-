import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, HelpCircle, Trophy, Clock, BookOpen, RotateCcw, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { Question, TestSession } from '../types';

interface SolutionReviewProps {
  session: TestSession;
  onOpenAITutor: (question: Question, userAnswerIdx?: number) => void;
  onRetakeTest: () => void;
  onBackToDashboard: () => void;
}

export const SolutionReview: React.FC<SolutionReviewProps> = ({
  session,
  onOpenAITutor,
  onRetakeTest,
  onBackToDashboard,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  const totalQuestions = session.questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  session.questions.forEach((q) => {
    const userAns = session.userAnswers[q.id];
    if (userAns === undefined) {
      unattemptedCount++;
    } else if (userAns === q.correctOptionIndex) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const filteredQuestions = session.questions.filter((q) => {
    const userAns = session.userAnswers[q.id];
    if (selectedFilter === 'correct') return userAns === q.correctOptionIndex;
    if (selectedFilter === 'incorrect') return userAns !== undefined && userAns !== q.correctOptionIndex;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-800">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Test Completed
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{session.title}</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>{session.subject} • {session.topics.join(', ')}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRetakeTest}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Retake Test</span>
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Overall Score</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-700">{percentage}%</p>
            <p className="text-[11px] text-slate-500 font-medium">{correctCount} of {totalQuestions} Correct</p>
          </div>

          <div className="bg-slate-50 border border-emerald-200 rounded-xl p-4 text-center space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Correct Answers</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{correctCount}</p>
            <p className="text-[11px] text-slate-500 font-medium">Accurate Solutions</p>
          </div>

          <div className="bg-slate-50 border border-rose-200 rounded-xl p-4 text-center space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Incorrect</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600">{incorrectCount}</p>
            <p className="text-[11px] text-slate-500 font-medium">Needs AI Review</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Skipped / Unanswered</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{unattemptedCount}</p>
            <p className="text-[11px] text-slate-500 font-medium">Not Attempted</p>
          </div>

        </div>

      </div>

      {/* Solutions Review Section */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Question Solutions & AI Explanation</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h2>
            <p className="text-xs text-slate-500 font-medium">Click "Explain with AI Tutor" on any question for step-by-step logic</p>
          </div>

          {/* Filter Options */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalQuestions})
            </button>
            <button
              onClick={() => setSelectedFilter('correct')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFilter === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              onClick={() => setSelectedFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFilter === 'incorrect' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Incorrect ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Questions Cards */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const originalIndex = session.questions.findIndex((orig) => orig.id === q.id);
            const userAnsIdx = session.userAnswers[q.id];
            const isCorrect = userAnsIdx === q.correctOptionIndex;
            const isUnattempted = userAnsIdx === undefined;

            return (
              <div
                key={q.id}
                className={`bg-white border rounded-2xl p-6 transition-all space-y-4 shadow-sm text-slate-800 ${
                  isUnattempted
                    ? 'border-amber-200'
                    : isCorrect
                    ? 'border-emerald-200'
                    : 'border-rose-200'
                }`}
              >
                
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      Q{originalIndex + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{q.topic}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    isUnattempted
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : isCorrect
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {isUnattempted ? (
                      <>
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Skipped</span>
                      </>
                    ) : isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.questionText}</p>

                {/* Options Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isCorrectOpt = optIdx === q.correctOptionIndex;
                    const isUserChosen = userAnsIdx === optIdx;

                    let optStyle = 'bg-slate-50 border-slate-200 text-slate-600';
                    if (isCorrectOpt) {
                      optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                    } else if (isUserChosen && !isCorrectOpt) {
                      optStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${optStyle}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 font-bold">{String.fromCharCode(65 + optIdx)})</span>
                          <span>{opt}</span>
                        </span>

                        {isCorrectOpt && (
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                            Correct Answer
                          </span>
                        )}
                        {isUserChosen && !isCorrectOpt && (
                          <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Initial Explanation Snippet */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Solution Logic:</p>
                  <p className="leading-relaxed font-medium">{q.explanation}</p>
                </div>

                {/* Ask AI Tutor Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onOpenAITutor(q, userAnsIdx)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-xs active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Explain Solution with AI Tutor</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
