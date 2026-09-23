import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, Layers, Check, X, Sparkles, AlertCircle } from 'lucide-react';
import { INITIAL_SUBJECTS } from '../data/mockData';
import { Appointment, DifficultyLevel, TestType } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  studentName: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onScheduleAppointment,
  studentName,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('math');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Calculus & Integration']);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [testType, setTestType] = useState<TestType>('mock_exam');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  
  // Schedule date & time defaults
  const todayStr = new Date().toISOString().split('T')[0];
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [scheduledTime, setScheduledTime] = useState('16:00');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleAppointment({
      studentName,
      subject: currentSubjectObj.name,
      topics: selectedTopics,
      testType,
      difficulty,
      scheduledDate,
      scheduledTime,
      durationMinutes,
      notes: notes.trim() || undefined,
      reminderEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Book Test Appointment</h2>
              <p className="text-xs text-slate-500 font-medium">Schedule a subject test or AI mock exam slot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm bg-[#f8fafc]">
          
          {/* Step 1: Subject Selection */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              1. Select Subject
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                    className={`p-3 rounded-xl border text-left font-bold transition-all flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-extrabold text-xs">{sub.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{sub.topics.length} Topics</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Topics Selection */}
          <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                2. Choose Topics for {currentSubjectObj.name}
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
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Topic Input */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="Add custom topic / chapter..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
              />
              <button
                type="button"
                onClick={handleAddCustomTopic}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-lg text-indigo-700 border border-slate-200"
              >
                + Add Topic
              </button>
            </div>
          </div>

          {/* Step 3: Test Mode & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-extrabold text-slate-900 block">Test Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTestType('mock_exam')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                    testType === 'mock_exam' ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  ⏱️ Timed Mock Exam
                </button>
                <button
                  type="button"
                  onClick={() => setTestType('practice')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                    testType === 'practice' ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  📖 Practice Mode
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-extrabold text-slate-900 block">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
              >
                <option value="beginner">Beginner (Foundational)</option>
                <option value="intermediate">Intermediate (Standard Board)</option>
                <option value="advanced">Advanced (Deep Conceptual)</option>
                <option value="competitive">Competitive Exam Level (JEE / NEET / SAT)</option>
              </select>
            </div>
          </div>

          {/* Step 4: Schedule Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Appointment Date</label>
              <input
                type="date"
                value={scheduledDate}
                min={todayStr}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Time Slot</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Duration (Minutes)</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
              >
                <option value={15}>15 Minutes (Quick Test)</option>
                <option value={30}>30 Minutes (Standard)</option>
                <option value={45}>45 Minutes (Full Mock)</option>
                <option value={60}>60 Minutes (Intensive)</option>
              </select>
            </div>
          </div>

          {/* Notes & Reminder */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Study Goal / Focus Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Focus on integration by parts and trigonometric substitution formulas"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium placeholder:text-slate-400"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500"
              />
              <span>Send appointment reminder before slot starts</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Confirm & Book Appointment Slot</span>
          </button>

        </form>
      </div>
    </div>
  );
};
