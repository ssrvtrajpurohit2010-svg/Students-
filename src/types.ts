export type TestType = 'practice' | 'mock_exam';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'competitive';

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  topics: string[];
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  hints?: string[];
}

export interface TestSession {
  id: string;
  appointmentId?: string;
  title: string;
  subject: string;
  topics: string[];
  testType: TestType;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  questions: Question[];
  userAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  flaggedQuestions: string[]; // questionIds
  timeRemainingSeconds: number;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  totalQuestions?: number;
  completedAt?: string;
  timeSpentSeconds?: number;
}

export interface Appointment {
  id: string;
  studentName: string;
  subject: string;
  topics: string[];
  testType: TestType;
  difficulty: DifficultyLevel;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  durationMinutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  reminderEnabled: boolean;
  createdAt: string;
  sessionId?: string;
}

export interface Subscription {
  isActive: boolean;
  planName: string;
  priceINR: number;
  currency: string;
  billingCycle: 'monthly';
  startDate: string;
  nextBillingDate: string;
  paymentMethod?: string;
  transactionId?: string;
  autoRenew: boolean;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  questionContext?: {
    questionText: string;
    options: string[];
    userAnswer?: string;
    correctAnswer: string;
  };
}

export interface StudentProfile {
  name: string;
  email: string;
  grade: string;
  targetExam: string;
  avatarUrl?: string;
}
