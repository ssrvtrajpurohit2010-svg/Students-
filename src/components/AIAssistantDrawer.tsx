import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, BookOpen, HelpCircle, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { AIChatMessage, Question } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question;
  subject?: string;
  userAnswerIndex?: number;
  explanationText?: string;
  isLoadingExplanation?: boolean;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  question,
  subject = 'Academic Subject',
  userAnswerIndex,
  explanationText,
  isLoadingExplanation = false,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am your AI Study Assistant. I am here to explain any step of this solution in simple terms. What concept would you like me to clarify?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg: AIChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          chatHistory: messages.map((m) => ({ role: m.sender, text: m.text })),
          questionContext: question
            ? {
                questionText: question.questionText,
                topic: question.topic,
                correctAnswer: question.options[question.correctOptionIndex],
              }
            : undefined,
        }),
      });

      const data = await res.json();
      const botMsg: AIChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Let me help explain that concept for you!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: AIChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: 'I can explain: The correct option follows from applying the fundamental rule. Let me know if you need a specific example!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl text-slate-800">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>AI Tutor Solution Assistant</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full uppercase font-bold">
                  24/7 Active
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Step-by-step solution explainer & doubt solver</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Solution Panel + Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f8fafc]">
          
          {/* Question Context Card */}
          {question && (
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-indigo-900 font-bold">
                <span>{subject} • {question.topic}</span>
                <span className="bg-indigo-100 px-2 py-0.5 rounded text-indigo-800">Question Context</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{question.questionText}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                  <span className="font-bold">Correct Answer:</span> Option {String.fromCharCode(65 + question.correctOptionIndex)} ({question.options[question.correctOptionIndex]})
                </div>
                {typeof userAnswerIndex === 'number' && (
                  <div className={`p-2 rounded-lg border text-xs font-semibold ${
                    userAnswerIndex === question.correctOptionIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <span className="font-bold">Your Choice:</span> Option {String.fromCharCode(65 + userAnswerIndex)} ({question.options[userAnswerIndex]})
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Explanation Text Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Step-by-Step AI Explanation</span>
            </h3>

            {isLoadingExplanation ? (
              <div className="py-6 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">AI Tutor is generating detailed solution breakdown...</p>
              </div>
            ) : (
              <div className="prose max-w-none text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                {explanationText || question?.explanation || 'Select a question to view full solution breakdown.'}
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ask Follow-up Questions to AI Tutor</h4>
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none font-medium shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed font-medium">{msg.text}</p>
                  <span className={`text-[10px] block text-right mt-1 opacity-75 ${msg.sender === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 italic font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Tutor is thinking...</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI Tutor: 'Why is option B incorrect?' or 'Explain step 2'..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-medium placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
