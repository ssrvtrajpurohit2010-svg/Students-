import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Generate Custom Test Questions endpoint
app.post('/api/generate-test', async (req, res) => {
  try {
    const {
      subject = 'Mathematics',
      topics = [],
      difficulty = 'intermediate',
      numberOfQuestions = 5,
      testType = 'practice',
    } = req.body;

    const topicListStr = Array.isArray(topics) && topics.length > 0 ? topics.join(', ') : 'General Concepts';
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Generate exactly ${numberOfQuestions} multiple choice questions (MCQs) for a student taking a ${testType === 'mock_exam' ? 'Mock Examination' : 'Practice Test'}.
Subject: ${subject}
Selected Topics: ${topicListStr}
Difficulty Level: ${difficulty}

Each question must have:
- Clear questionText (include concise formulas or scenario if applicable)
- Exactly 4 options
- correctOptionIndex (0, 1, 2, or 3)
- Detailed step-by-step explanation explaining why the correct answer is right and why others are incorrect.
- Specified topic name`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an expert exam setter and academic professor creating high quality, accurate multiple choice test questions with explanations for Indian and Global curriculum students (High school to Competitive entrance level).',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              description: 'List of test questions',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctOptionIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  topic: { type: Type.STRING },
                },
                required: ['questionText', 'options', 'correctOptionIndex', 'explanation'],
              },
            },
          },
        });

        const jsonStr = response.text ? response.text.trim() : '[]';
        const parsedQuestions = JSON.parse(jsonStr);

        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          const formattedQuestions = parsedQuestions.map((q, idx) => ({
            id: q.id || `gen-q-${Date.now()}-${idx}`,
            questionText: q.questionText,
            options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
            correctOptionIndex: typeof q.correctOptionIndex === 'number' && q.correctOptionIndex >= 0 && q.correctOptionIndex < 4 ? q.correctOptionIndex : 0,
            explanation: q.explanation || 'Detailed explanation provided by AI Tutor.',
            topic: q.topic || (topics[idx % topics.length] || subject),
            difficulty,
          }));

          return res.json({ success: true, questions: formattedQuestions });
        }
      } catch (geminiError) {
        console.error('Gemini test generation error, falling back to smart dynamic generator:', geminiError);
      }
    }

    // Fallback dynamic test generator if Gemini key missing or error
    const fallbackQuestions = generateFallbackQuestions(subject, topics, numberOfQuestions, difficulty);
    return res.json({ success: true, questions: fallbackQuestions, fallback: true });
  } catch (error: any) {
    console.error('Test generation server error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate test questions' });
  }
});

// AI Solution Explanation endpoint
app.post('/api/ai-explain', async (req, res) => {
  try {
    const {
      questionText,
      options = [],
      correctAnswerIndex = 0,
      userAnswerIndex,
      topic = 'General Topic',
      subject = 'Subject',
      userQuery,
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback explanation
      const userSelectedText = typeof userAnswerIndex === 'number' && options[userAnswerIndex] ? options[userAnswerIndex] : 'Not answered';
      const correctText = options[correctAnswerIndex] || 'Correct Option';
      const isCorrect = userAnswerIndex === correctAnswerIndex;

      return res.json({
        explanation: `### 🎯 Concept Overview
This question tests your knowledge in **${subject} - ${topic}**.

---

### 🔍 Step-by-Step Solution
1. **Core Principle**: Analyze the key definitions and formulas related to **${topic}**.
2. **Analysis**:
   - The correct answer is **Option ${String.fromCharCode(65 + correctAnswerIndex)}: "${correctText}"**.
   - ${isCorrect ? 'Great job! You selected the correct answer.' : `Your selected answer was **"${userSelectedText}"**. Notice where the reasoning diverges.`}
3. **Why Other Options are Incorrect**:
   - The alternative options do not satisfy the required conditions or misuse fundamental principles.

---

### 💡 Pro Tip for Exam Success
When tackling ${topic} questions, always check your initial units and verify key boundary conditions before committing to an option!`,
      });
    }

    const prompt = `You are a supportive AI Academic Tutor explaining a test question solution to a student.

Subject: ${subject}
Topic: ${topic}
Question: "${questionText}"
Options:
${options.map((opt: string, idx: number) => `${String.fromCharCode(65 + idx)}) ${opt}`).join('\n')}

Correct Answer: Option ${String.fromCharCode(65 + correctAnswerIndex)} ("${options[correctAnswerIndex] || ''}")
Student Selected: ${typeof userAnswerIndex === 'number' ? `Option ${String.fromCharCode(65 + userAnswerIndex)} ("${options[userAnswerIndex] || ''}")` : 'No option selected'}
${userQuery ? `Student's Specific Question: "${userQuery}"` : ''}

Please write a comprehensive, clear, encouraging, and structured explanation in Markdown with the following sections:
1. **Concept Overview** (Quick 2-sentence breakdown of the core concept)
2. **Step-by-Step Derivation / Solution** (Numbered clear steps leading to the correct answer)
3. **Option-by-Option Analysis** (Why the correct option is right and why distractors are wrong)
4. **Key Formula / Memory Trick** (Highlight important formulas or mnemonics)
5. **AI Tutor's Pro Tip** (Actionable advice for similar exam problems)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a master academic teacher known for making complex topics extremely simple, intuitive, and fun to learn.',
      },
    });

    return res.json({ explanation: response.text || 'Explanation unavailable.' });
  } catch (err: any) {
    console.error('AI Explain error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate explanation' });
  }
});

// Interactive AI Tutor Chat endpoint
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, chatHistory = [], questionContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `I'm your AI Study Assistant! I can help you understand ${questionContext?.topic || 'your test topics'}, solve difficult problems step-by-step, or review key formulas. Feel free to ask any question about your syllabus!`,
      });
    }

    let contextPrompt = 'You are an encouraging AI Tutor for students taking practice tests and mock exams.\n';
    if (questionContext) {
      contextPrompt += `Current Question Context:
Question: "${questionContext.questionText}"
Topic: ${questionContext.topic || 'General'}
Correct Answer: ${questionContext.correctAnswer}\n`;
    }

    const messagesFormatted = [
      { role: 'user', parts: [{ text: `${contextPrompt}\nStudent asked: "${message}"` }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: `${contextPrompt} Keep answers concise, highly illustrative, and student-friendly. Use bullet points or code/math notation where appropriate.`,
      },
    });

    return res.json({ reply: response.text || 'I am here to help with your test preparation!' });
  } catch (err: any) {
    console.error('AI Chat error:', err);
    return res.status(500).json({ error: err.message || 'Failed to process chat' });
  }
});

// Helper for dynamic fallback questions
function generateFallbackQuestions(subject: string, topics: string[], count: number, difficulty: string) {
  const selectedTopics = topics.length > 0 ? topics : [subject];
  const questions = [];

  for (let i = 0; i < count; i++) {
    const t = selectedTopics[i % selectedTopics.length];
    questions.push({
      id: `fallback-q-${Date.now()}-${i}`,
      questionText: `[${subject} - ${t}] Which statement regarding ${t} is fundamental in ${difficulty} level problems?`,
      options: [
        `The rate of change is directly proportional to the applied potential/force in ${t}.`,
        `The total system energy remains non-conserved during elastic transformations.`,
        `The primary coefficient is inversely dependent on the boundary constant.`,
        `All state functions depend exclusively on the pathway taken during the process.`
      ],
      correctOptionIndex: 0,
      explanation: `In ${t}, the fundamental relationship states that the rate of change directly scales with the applied driving potential or force under standard state conditions.`,
      topic: t,
      difficulty: difficulty as any,
    });
  }

  return questions;
}

// Start Server & Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
