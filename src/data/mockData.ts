import { Subject, Appointment, Subscription, StudentProfile, TestSession } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    color: 'from-blue-500 to-indigo-600',
    topics: [
      'Calculus & Integration',
      'Algebra & Quadratics',
      'Trigonometry & Identities',
      'Probability & Statistics',
      'Coordinate Geometry',
      'Matrices & Determinants',
      'Vectors & 3D Geometry'
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-600',
    topics: [
      'Kinematics & Dynamics',
      'Electromagnetism & Circuits',
      'Thermodynamics & Heat',
      'Optics & Light Waves',
      'Modern Physics & Atoms',
      'Work, Energy & Power',
      'Gravitation'
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'FlaskConical',
    color: 'from-emerald-500 to-teal-600',
    topics: [
      'Organic Reaction Mechanisms',
      'Chemical Bonding & Structure',
      'Electrochemistry & Kinetics',
      'Periodic Table & Elements',
      'Thermodynamics in Chemistry',
      'States of Matter & Gas Laws',
      'Coordination Chemistry'
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: 'Dna',
    color: 'from-rose-500 to-pink-600',
    topics: [
      'Human Physiology',
      'Genetics & Evolution',
      'Cell Biology & Organelles',
      'Plant Physiology & Photosynthesis',
      'Ecology & Environment',
      'Biotechnology & Applications'
    ]
  },
  {
    id: 'cs',
    name: 'Computer Science',
    icon: 'Code',
    color: 'from-violet-500 to-purple-600',
    topics: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (Java/Python)',
      'Database Management Systems (SQL)',
      'Computer Networks & Protocols',
      'Operating System Concepts',
      'Web Development Fundamentals'
    ]
  },
  {
    id: 'reasoning',
    name: 'Logical Reasoning & Aptitude',
    icon: 'BrainCircuit',
    color: 'from-cyan-500 to-blue-600',
    topics: [
      'Numerical Aptitude & Series',
      'Syllogism & Logical Deduction',
      'Data Interpretation & Graphs',
      'Verbal Reasoning & Comprehension',
      'Puzzles & Seating Arrangements'
    ]
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.student@school.edu',
  grade: 'Class 12 / Competitive Aspirant',
  targetExam: 'JEE / NEET / Board Finals',
};

export const INITIAL_SUBSCRIPTION: Subscription = {
  isActive: true,
  planName: '₹1 Monthly Unlimited Student Pass',
  priceINR: 1,
  currency: 'INR',
  billingCycle: 'monthly',
  startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  nextBillingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  paymentMethod: 'UPI (student@upi)',
  transactionId: 'TXN-9823412-INR1',
  autoRenew: true
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    studentName: 'Aarav Sharma',
    subject: 'Mathematics',
    topics: ['Calculus & Integration', 'Trigonometry & Identities'],
    testType: 'mock_exam',
    difficulty: 'intermediate',
    scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '15:30',
    durationMinutes: 30,
    status: 'scheduled',
    notes: 'Focus on definite integration formulas and trig substitutions.',
    reminderEnabled: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-102',
    studentName: 'Aarav Sharma',
    subject: 'Physics',
    topics: ['Kinematics & Dynamics', 'Work, Energy & Power'],
    testType: 'practice',
    difficulty: 'competitive',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '10:00',
    durationMinutes: 45,
    status: 'scheduled',
    notes: 'Preparation for upcoming competitive entrance mock.',
    reminderEnabled: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-100',
    studentName: 'Aarav Sharma',
    subject: 'Chemistry',
    topics: ['Organic Reaction Mechanisms'],
    testType: 'practice',
    difficulty: 'intermediate',
    scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '11:00',
    durationMinutes: 20,
    status: 'completed',
    sessionId: 'session-demo-chem',
    notes: 'Completed yesterday with 85% accuracy.',
    reminderEnabled: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

export const DEMO_COMPLETED_TEST: TestSession = {
  id: 'session-demo-chem',
  appointmentId: 'apt-100',
  title: 'Chemistry: Organic Reaction Mechanisms Practice',
  subject: 'Chemistry',
  topics: ['Organic Reaction Mechanisms'],
  testType: 'practice',
  difficulty: 'intermediate',
  durationMinutes: 20,
  questions: [
    {
      id: 'q1',
      questionText: 'Which of the following carbocations is the most stable due to resonance and hyperconjugation?',
      options: [
        'Primary Ethyl Carbocation (CH3-CH2+)',
        'Secondary Isopropyl Carbocation ((CH3)2CH+)',
        'Tertiary Butyl Carbocation ((CH3)3C+)',
        'Allyl Carbocation with electron donating group'
      ],
      correctOptionIndex: 2,
      explanation: 'Tertiary butyl carbocation has 9 hyperconjugative alpha-hydrogens, making it exceptionally stable due to strong hyperconjugation and inductive effect of three methyl groups.',
      topic: 'Organic Reaction Mechanisms',
      difficulty: 'intermediate'
    },
    {
      id: 'q2',
      questionText: 'An SN2 substitution reaction proceeds with which stereochemical outcome?',
      options: [
        'Complete Retention of Configuration',
        'Racemization (50% inversion, 50% retention)',
        'Walden Inversion (100% Inversion of Configuration)',
        'No change in chirality'
      ],
      correctOptionIndex: 2,
      explanation: 'SN2 reactions occur via backside attack of the nucleophile on the carbon-leaving group bond, leading to concerted bond formation/cleavage and 100% Walden inversion.',
      topic: 'Organic Reaction Mechanisms',
      difficulty: 'intermediate'
    },
    {
      id: 'q3',
      questionText: 'What is the primary product formed when ethanol reacts with concentrated H2SO4 at 170°C?',
      options: [
        'Diethyl Ether (CH3CH2OCH2CH3)',
        'Ethene (CH2=CH2)',
        'Ethyl Hydrogen Sulfate (CH3CH2OSO3H)',
        'Ethane (CH3-CH3)'
      ],
      correctOptionIndex: 1,
      explanation: 'At high temperature (170°C), concentrated sulfuric acid acts as a strong dehydrating agent converting ethanol to ethene via E1 elimination.',
      topic: 'Organic Reaction Mechanisms',
      difficulty: 'intermediate'
    }
  ],
  userAnswers: {
    'q1': 2,
    'q2': 2,
    'q3': 0
  },
  flaggedQuestions: [],
  timeRemainingSeconds: 0,
  status: 'completed',
  score: 2,
  totalQuestions: 3,
  completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  timeSpentSeconds: 420
};
