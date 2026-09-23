import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AppointmentsTab } from './components/AppointmentsTab';
import { AppointmentModal } from './components/AppointmentModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { MockTestGeneratorTab } from './components/MockTestGeneratorTab';
import { TestRunner } from './components/TestRunner';
import { SolutionReview } from './components/SolutionReview';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { PerformanceTab } from './components/PerformanceTab';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_SUBSCRIPTION,
  DEMO_COMPLETED_TEST,
} from './data/mockData';
import { Appointment, Question, Subscription, TestSession, DifficultyLevel, TestType } from './types';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'appointments' | 'take_test' | 'review' | 'subscription' | 'analytics'>('appointments');

  // Core Persistent State
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('edutest_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [subscription, setSubscription] = useState<Subscription>(() => {
    const saved = localStorage.getItem('edutest_subscription');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION;
  });

  const [completedSessions, setCompletedSessions] = useState<TestSession[]>(() => {
    const saved = localStorage.getItem('edutest_completed_sessions');
    return saved ? JSON.parse(saved) : [DEMO_COMPLETED_TEST];
  });

  // Current active test session
  const [currentSession, setCurrentSession] = useState<TestSession | null>(DEMO_COMPLETED_TEST);
  const [isLoadingTestQuestions, setIsLoadingTestQuestions] = useState(false);

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [aiTutorQuestion, setAiTutorQuestion] = useState<Question | undefined>(undefined);
  const [aiTutorUserAnsIdx, setAiTutorUserAnsIdx] = useState<number | undefined>(undefined);
  const [aiTutorExplanation, setAiTutorExplanation] = useState<string | undefined>(undefined);
  const [isLoadingAIExplanation, setIsLoadingAIExplanation] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('edutest_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('edutest_subscription', JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem('edutest_completed_sessions', JSON.stringify(completedSessions));
  }, [completedSessions]);

  // Appointment scheduling handler
  const handleScheduleAppointment = (newAptData: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppointment: Appointment = {
      ...newAptData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'scheduled',
    };
    setAppointments([newAppointment, ...appointments]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  // Subscription activation handler (₹1 / month)
  const handleActivateSubscription = (paymentMethod: string) => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    setSubscription({
      isActive: true,
      planName: '₹1 Monthly Student Pass',
      priceINR: 1,
      currency: 'INR',
      billingCycle: 'monthly',
      startDate: today.toISOString().split('T')[0],
      nextBillingDate: nextMonth.toISOString().split('T')[0],
      paymentMethod,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      autoRenew: true,
    });
  };

  // Generate & Launch Test Session
  const handleGenerateAndStartTest = async (config: {
    subject: string;
    topics: string[];
    difficulty: DifficultyLevel;
    numberOfQuestions: number;
    testType: TestType;
    durationMinutes: number;
    appointmentId?: string;
  }) => {
    setIsLoadingTestQuestions(true);
    setActiveTab('take_test');

    try {
      const res = await fetch('/api/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: config.subject,
          topics: config.topics,
          difficulty: config.difficulty,
          numberOfQuestions: config.numberOfQuestions,
          testType: config.testType,
        }),
      });

      const data = await res.json();
      const questions: Question[] = data.questions || [];

      const newSession: TestSession = {
        id: `session-${Date.now()}`,
        appointmentId: config.appointmentId,
        title: `${config.subject}: ${config.topics.join(', ')}`,
        subject: config.subject,
        topics: config.topics,
        testType: config.testType,
        difficulty: config.difficulty,
        durationMinutes: config.durationMinutes,
        questions,
        userAnswers: {},
        flaggedQuestions: [],
        timeRemainingSeconds: config.durationMinutes * 60,
        status: 'in_progress',
      };

      setCurrentSession(newSession);
    } catch (error) {
      console.error('Failed to generate test:', error);
    } finally {
      setIsLoadingTestQuestions(false);
    }
  };

  // Start test directly from appointment card
  const handleStartTestFromAppointment = (apt: Appointment) => {
    handleGenerateAndStartTest({
      subject: apt.subject,
      topics: apt.topics,
      difficulty: apt.difficulty,
      numberOfQuestions: 5,
      testType: apt.testType,
      durationMinutes: apt.durationMinutes,
      appointmentId: apt.id,
    });
  };

  // Test Runner callbacks
  const handleUpdateAnswer = (questionId: string, optionIndex: number) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      userAnswers: {
        ...currentSession.userAnswers,
        [questionId]: optionIndex,
      },
    });
  };

  const handleToggleFlag = (questionId: string) => {
    if (!currentSession) return;
    const isFlagged = currentSession.flaggedQuestions.includes(questionId);
    const updatedFlags = isFlagged
      ? currentSession.flaggedQuestions.filter((id) => id !== questionId)
      : [...currentSession.flaggedQuestions, questionId];

    setCurrentSession({
      ...currentSession,
      flaggedQuestions: updatedFlags,
    });
  };

  const handleSubmitTest = () => {
    if (!currentSession) return;

    let score = 0;
    currentSession.questions.forEach((q) => {
      if (currentSession.userAnswers[q.id] === q.correctOptionIndex) {
        score++;
      }
    });

    const completed: TestSession = {
      ...currentSession,
      status: 'completed',
      score,
      totalQuestions: currentSession.questions.length,
      completedAt: new Date().toISOString(),
    };

    // Update appointment status if linked
    if (currentSession.appointmentId) {
      setAppointments(
        appointments.map((a) => (a.id === currentSession.appointmentId ? { ...a, status: 'completed' } : a))
      );
    }

    setCompletedSessions([completed, ...completedSessions]);
    setCurrentSession(completed);
    setActiveTab('review');
  };

  // Trigger AI Tutor Explanation for a question
  const handleOpenAITutor = async (question: Question, userAnswerIdx?: number) => {
    setAiTutorQuestion(question);
    setAiTutorUserAnsIdx(userAnswerIdx);
    setIsAITutorOpen(true);
    setIsLoadingAIExplanation(true);
    setAiTutorExplanation(undefined);

    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.questionText,
          options: question.options,
          correctAnswerIndex: question.correctOptionIndex,
          userAnswerIndex: userAnswerIdx,
          topic: question.topic,
          subject: currentSession?.subject || 'Subject',
        }),
      });

      const data = await res.json();
      setAiTutorExplanation(data.explanation || question.explanation);
    } catch (err) {
      console.error('Failed to get AI explanation:', err);
      setAiTutorExplanation(question.explanation);
    } finally {
      setIsLoadingAIExplanation(false);
    }
  };

  const upcomingCount = appointments.filter((a) => a.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Global Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        studentProfile={INITIAL_STUDENT_PROFILE}
        onQuickStartTest={() => setActiveTab('take_test')}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        upcomingCount={upcomingCount}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'appointments' && (
          <AppointmentsTab
            appointments={appointments}
            onOpenBookModal={() => setIsBookModalOpen(true)}
            onStartTestFromAppointment={handleStartTestFromAppointment}
            onCancelAppointment={handleCancelAppointment}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            isSubscribed={subscription.isActive}
          />
        )}

        {activeTab === 'take_test' && (
          currentSession && currentSession.status === 'in_progress' ? (
            <TestRunner
              session={currentSession}
              onUpdateAnswer={handleUpdateAnswer}
              onToggleFlag={handleToggleFlag}
              onSubmitTest={handleSubmitTest}
              onExitTest={() => setActiveTab('appointments')}
              isLoadingQuestions={isLoadingTestQuestions}
            />
          ) : (
            <MockTestGeneratorTab
              onGenerateAndStartTest={(config) => handleGenerateAndStartTest(config)}
              isSubscribed={subscription.isActive}
              onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            />
          )
        )}

        {activeTab === 'review' && currentSession && (
          <SolutionReview
            session={currentSession}
            onOpenAITutor={handleOpenAITutor}
            onRetakeTest={() => {
              if (currentSession) {
                handleGenerateAndStartTest({
                  subject: currentSession.subject,
                  topics: currentSession.topics,
                  difficulty: currentSession.difficulty,
                  numberOfQuestions: currentSession.questions.length || 5,
                  testType: currentSession.testType,
                  durationMinutes: currentSession.durationMinutes,
                });
              }
            }}
            onBackToDashboard={() => setActiveTab('appointments')}
          />
        )}

        {activeTab === 'analytics' && (
          <PerformanceTab
            completedSessions={completedSessions}
            appointments={appointments}
            onQuickStartTest={() => setActiveTab('take_test')}
          />
        )}

      </main>

      {/* Modals & AI Drawer */}
      <AppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onScheduleAppointment={handleScheduleAppointment}
        studentName={INITIAL_STUDENT_PROFILE.name}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        subscription={subscription}
        onActivateSubscription={handleActivateSubscription}
      />

      <AIAssistantDrawer
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        question={aiTutorQuestion}
        subject={currentSession?.subject}
        userAnswerIndex={aiTutorUserAnsIdx}
        explanationText={aiTutorExplanation}
        isLoadingExplanation={isLoadingAIExplanation}
      />

    </div>
  );
}
