import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, Layers, Check, Clock, Zap, Settings, ShieldCheck } from 'lucide-react';
import { INITIAL_SUBJECTS } from '../data/mockData';
import { DifficultyLevel, TestType } from '../types';

interface MockTestGeneratorTabProps {
  onGenerateAndStartTest: (config: {
    subject: string;
    topics: string[];
    difficulty: DifficultyLevel;
    numberOfQuestions: number;
    testType: TestType;
    durationMinutes: number;
  }) => void;
  isSubscribed: boolean;
  onOpenSubscriptionModal: () => void;
}

export const MockTestGeneratorTab: React.FC<MockTestGeneratorTabProps> = ({
  onGenerateAndStartTest,
  isSubscribed,
  onOpenSubscriptionModal,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('math');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Calculus & Integration']);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [testType, setTestType] = useState<TestType>('mock_exam');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(20);

  const currentSubjectObj = INITIAL_SUBJECTS.find((s) => s.id === selectedSubjectId) || INITIAL_SUBJECTS[0];

  const handleToggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleAddCustomTopic = () => {
    if (customTopicInput.trim() && !selectedTopics.includes(customTopicInput.trim())) {
      setSelectedTopics([...selectedTopics, customTopicInput.trim()]);
      setCustomTopicInput('');
    }
  };

  const handleStart = () => {
    onGenerateAndStartTest({
      subject: currentSubjectObj.name,
      topics: selectedTopics,
      difficulty,
      numberOfQuestions,
      testType,
      durationMinutes,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Question Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Instant AI Mock Test Generator</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Pick your target subject, customize topics or add custom syllabus, select difficulty level, and take an instant AI test with solution explainer.
        </p>
      </div>

      {!isSubscribed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4 text-amber-950 text-xs sm:text-sm shadow-2xs">
          <span className="font-medium">Subscribe to ₹1 / month Student Pass for unlimited test attempts & AI solution explanations.</span>
          <button
            onClick={onOpenSubscriptionModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg whitespace-nowrap shadow-xs transition-all"
          >
            Get ₹1 Pass
          </button>
        </div>
      )}

      {/* Main Generator Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm text-slate-800">
        
        {/* Step 1: Subject Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>1. Select Target Subject</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {INITIAL_SUBJECTS.map((sub) => {
              const isSelected = sub.id === selectedSubjectId;
              return (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setSelectedTopics([sub.topics[0]]);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 font-bold shadow-2xs'
                      : 'bg-slate-50/80 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-bold">{sub.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{sub.topics.length} Topics</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Topics Checklist */}
        <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>2. Choose Topics for {currentSubjectObj.name}</span>
            </label>
            <span className="text-xs text-indigo-700 font-bold">{selectedTopics.length} Selected</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {currentSubjectObj.topics.map((topic) => {
              const isChecked = selectedTopics.includes(topic);
              return (
                <button
                  type="button"
                  key={topic}
                  onClick={() => handleToggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                  <span>{topic}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex gap-2">
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="Add custom chapter/syllabus topic..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="button"
              onClick={handleAddCustomTopic}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold rounded-xl text-white shadow-xs"
            >
              + Add Custom Topic
            </button>
          </div>
        </div>

        {/* Step 3: Test Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Test Mode</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value as TestType)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              <option value="mock_exam">⏱️ Timed Mock Exam</option>
              <option value="practice">📖 Practice Test</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              <option value="beginner">Beginner Level</option>
              <option value="intermediate">Intermediate (Board Exam)</option>
              <option value="advanced">Advanced Level</option>
              <option value="competitive">Competitive Level (JEE / NEET)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Questions & Duration</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>

              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value={15}>15 Mins</option>
                <option value={30}>30 Mins</option>
                <option value={45}>45 Mins</option>
              </select>
            </div>
          </div>

        </div>

        {/* Start Test Button */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Play className="w-5 h-5 fill-current text-emerald-400" />
          <span>Generate AI Mock Test & Start Now</span>
        </button>

      </div>

    </div>
  );
};
