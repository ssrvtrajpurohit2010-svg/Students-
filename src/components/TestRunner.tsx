import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Flag, ArrowLeft, ArrowRight, Send, AlertTriangle, Sparkles, BookOpen, Layers, RefreshCw } from 'lucide-react';
import { Question, TestSession } from '../types';

interface TestRunnerProps {
  session: TestSession;
  onUpdateAnswer: (questionId: string, optionIndex: number) => void;
  onToggleFlag: (questionId: string) => void;
  onSubmitTest: () => void;
  onExitTest: () => void;
  isLoadingQuestions?: boolean;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  session,
  onUpdateAnswer,
  onToggleFlag,
  onSubmitTest,
  onExitTest,
  isLoadingQuestions = false,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(session.durationMinutes * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (session.status === 'completed' || isLoadingQuestions) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.status, isLoadingQuestions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoadingQuestions) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-white">Generating AI Mock Test Questions...</h2>
        <p className="text-xs text-slate-400">
          Preparing custom questions for {session.subject} ({session.topics.join(', ')}) with AI precision.
        </p>
      </div>
    );
  }

  const currentQ: Question | undefined = session.questions[currentIdx];
  const totalQ = session.questions.length;
  const answeredCount = Object.keys(session.userAnswers).length;

  if (!currentQ || totalQ === 0) {
    return (
      <div className="py-16 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Questions Available</h3>
        <p className="text-xs text-slate-400">Could not load test questions. Please try again or re-select topics.</p>
        <button onClick={onExitTest} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isFlagged = session.flaggedQuestions.includes(currentQ.id);
  const selectedOption = session.userAnswers[currentQ.id];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Test Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-800">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onExitTest}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
            title="Pause & Exit Test"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{session.subject}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {session.testType === 'mock_exam' ? 'Timed Mock Exam' : 'Practice Test'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>{session.topics.join(' • ')}</span>
            </p>
          </div>
        </div>

        {/* Timer & Answer Tracker */}
        <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`} />
            <span className={`font-mono text-sm font-bold ${timeLeft < 300 ? 'text-rose-600' : 'text-slate-900'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-900">{answeredCount}</span> of {totalQ} Answered
          </div>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Question & Options Area (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-800">
            
            {/* Question Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                  Question {currentIdx + 1} of {totalQ}
                </span>
                <span className="text-xs text-slate-500 font-medium">Topic: {currentQ.topic}</span>
              </div>

              <button
                onClick={() => onToggleFlag(currentQ.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isFlagged
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.questionText}
              </p>
            </div>

            {/* MCQ Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const optionLabel = String.fromCharCode(65 + optIdx);

                return (
                  <button
                    key={optIdx}
                    onClick={() => onUpdateAnswer(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {optionLabel}
                      </span>
                      <span className="font-medium">{option}</span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Question Navigation Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-slate-500 font-semibold">
                {currentIdx + 1} / {totalQ}
              </span>

              <button
                disabled={currentIdx === totalQ - 1}
                onClick={() => setCurrentIdx((prev) => Math.min(totalQ - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Question Palette Sidebar (1 col) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900">Question Navigator</h3>
            
            <div className="grid grid-cols-5 gap-2">
              {session.questions.map((q, idx) => {
                const isAnswered = session.userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIdx;
                const flagged = session.flaggedQuestions.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-lg text-xs font-bold transition-all relative flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white font-black'
                        : isAnswered
                        ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {flagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
                <span>Unanswered ({totalQ - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Flagged for Review ({session.flaggedQuestions.length})</span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all mt-2 shadow-xs"
            >
              Finish & Submit Test
            </button>

          </div>
        </div>

      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 text-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Submit Test Session?</h3>
            <p className="text-xs text-slate-600">
              You have answered <span className="font-bold text-emerald-600">{answeredCount}</span> out of{' '}
              <span className="font-bold text-slate-900">{totalQ}</span> questions.
              {totalQ - answeredCount > 0 && (
                <span className="block text-amber-600 font-bold mt-1">
                  ⚠️ {totalQ - answeredCount} unanswered questions remaining.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700"
              >
                Keep Reviewing
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  onSubmitTest();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold rounded-xl text-white shadow-xs"
              >
                Yes, Submit Test Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
