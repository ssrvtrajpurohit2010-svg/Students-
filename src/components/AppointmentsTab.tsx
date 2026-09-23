import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, Plus, Play, CheckCircle2, AlertCircle, Trash2, Filter, Sparkles, Layers, ChevronRight } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentsTabProps {
  appointments: Appointment[];
  onOpenBookModal: () => void;
  onStartTestFromAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onOpenSubscriptionModal: () => void;
  isSubscribed: boolean;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  onOpenBookModal,
  onStartTestFromAppointment,
  onCancelAppointment,
  onOpenSubscriptionModal,
  isSubscribed,
}) => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'scheduled') return apt.status === 'scheduled';
    if (filter === 'completed') return apt.status === 'completed';
    return true;
  });

  const upcomingCount = appointments.filter((a) => a.status === 'scheduled').length;
  const nextScheduled = appointments.find((a) => a.status === 'scheduled');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner / Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Student Test Scheduler & AI Tutor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Test Appointments & Scheduled Exams
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Schedule test appointments for any subject, choose specific topics or custom syllabus, and get AI-assisted step-by-step solution explanations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenBookModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Book Test Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Callout if not active */}
      {!isSubscribed && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950 shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              Your ₹1 / month Student Educational Pass is currently inactive. Activate now to get unlimited mock tests & AI solution support.
            </p>
          </div>
          <button
            onClick={onOpenSubscriptionModal}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs whitespace-nowrap shadow-xs transition-all"
          >
            Activate ₹1 Pass
          </button>
        </div>
      )}

      {/* Next Upcoming Slot Highlight */}
      {nextScheduled && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Next Appointment Slot</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Slot ID: {nextScheduled.id}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {nextScheduled.subject}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  {nextScheduled.testType === 'mock_exam' ? 'Mock Exam' : 'Practice Test'}
                </span>
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Topics: {nextScheduled.topics.join(', ')}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {nextScheduled.scheduledDate} at {nextScheduled.scheduledTime}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {nextScheduled.durationMinutes} Mins Duration
                </span>
              </div>
            </div>

            <button
              onClick={() => onStartTestFromAppointment(nextScheduled)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Test Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Appointments List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Scheduled & Past Appointments</h2>
            <p className="text-xs text-slate-500">Total {appointments.length} appointments booked</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'scheduled' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'completed' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Completed ({appointments.length - upcomingCount})
            </button>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm text-slate-500">No test appointments found for this filter.</p>
            <button
              onClick={onOpenBookModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Book New Appointment Slot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((apt) => {
              const isScheduled = apt.status === 'scheduled';
              return (
                <div
                  key={apt.id}
                  className={`bg-white border rounded-2xl p-5 transition-all space-y-4 shadow-sm hover:shadow-md ${
                    isScheduled
                      ? 'border-indigo-200 hover:border-indigo-400'
                      : 'border-slate-200 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{apt.subject}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isScheduled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {apt.testType === 'mock_exam' ? 'Mock Examination' : 'Practice Test'} • {apt.difficulty}
                      </p>
                    </div>

                    {isScheduled && (
                      <button
                        onClick={() => onCancelAppointment(apt.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-all"
                        title="Cancel Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Topics List */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topics Chosen:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {apt.topics.map((t) => (
                        <span key={t} className="text-xs bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{apt.notes}"
                    </p>
                  )}

                  {/* Slot Time & Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
                    <div className="flex items-center gap-3 text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {apt.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {apt.scheduledTime} ({apt.durationMinutes} mins)
                      </span>
                    </div>

                    {isScheduled ? (
                      <button
                        onClick={() => onStartTestFromAppointment(apt)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all flex items-center gap-1 text-xs shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Take Test</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
