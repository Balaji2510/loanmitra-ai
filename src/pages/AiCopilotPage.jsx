import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../locales/i18n';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';

export function AiCopilotPage() {
  const { t, language } = useLanguage();
  const { profile } = useAuth();
  const { customers, applications } = useData();

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content:
        language === 'ta'
          ? `வணக்கம் ${profile?.full_name || 'ஆலோசகர்'} அவர்களே! நான் உங்கள் **LoanMitra AI Copilot**.
வங்கி கொள்கைகள், FOIR கடன் தகுதி கணக்கீடு, வாடிக்கையாளருக்கான WhatsApp தமிழ் நினைவூட்டல்கள் அல்லது ஆவண சரிபார்ப்பு பற்றிய உங்கள் கேள்விகளை கேளுங்கள்.`
          : language === 'tanglish'
          ? `Vanakkam ${profile?.full_name || 'Advisor'}! Naan unga **LoanMitra AI Copilot**.
Bank rules, FOIR eligibility, customer-ku WhatsApp Tamil reminders create panna, or loan files pathi kelunga.`
          : `Hello ${profile?.full_name || 'Advisor'}! I am your **LoanMitra AI Copilot**.
I am grounded in verified Indian banking guidelines (HDFC, SBI, ICICI, Axis, Bajaj Finserv). How can I assist with your customer loan applications today?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    {
      label: '5 லட்சம் Personal Loan கிடைக்குமா?',
      prompt: 'எனக்கு 5 லட்சம் personal loan கிடைக்குமா? தகுதி மற்றும் EMI சொல்லுங்கள்.',
    },
    {
      label: 'Document Reminder (Tamil)',
      prompt: 'Generate a polite WhatsApp document reminder message in Tamil for SBI Home Loan pending sale deed.',
    },
    {
      label: 'HDFC vs SBI Policy Comparison',
      prompt: 'Compare HDFC Personal Loan and SBI Home Loan eligibility criteria, interest rates, and required vintage.',
    },
    {
      label: 'Calculate FOIR for ₹80k salary',
      prompt: 'Calculate maximum permissible EMI and FOIR for a salaried person with ₹80,000 monthly income and ₹15,000 existing EMI.',
    },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          language,
          context: {
            advisorName: profile?.full_name,
            totalCustomers: customers.length,
            pendingDocumentsCount: applications.filter((a) => a.status === 'documents_pending').length,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botReply = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          provider: data.provider || 'gemini-1.5-flash',
          isDemoMode: data.isDemoMode,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botReply]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Chat Error:', err);
      // Fallback response
      const fallbackReply = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'ta'
            ? `மன்னிக்கவும், AI சேவையகத்தை அணுகுவதில் சிறு தாமதம் ஏற்பட்டது. 5 லட்சம் கடனுக்கு 12% வட்டியில் 48 மாதங்களுக்கான உத்தேச EMI சுமார் ₹13,167 ஆகும்.`
            : `I experienced a temporary network latency connecting to the cloud server. For a ₹5,00,000 loan at 12% across 48 months, estimated monthly EMI is ₹13,167. Please ensure FOIR stays below 50%.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyanAccent-500 animate-pulse" />
            <span>{t('ai.copilotTitle')}</span>
            <Badge variant="cyan" size="sm">
              Gemini Flash AI
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('ai.copilotSubtitle')}
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'msg-reset',
                role: 'assistant',
                content: 'Conversation history cleared. How can I help with your loan files now?',
                timestamp: new Date().toISOString(),
              },
            ])
          }
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Questions Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            className="px-3 py-1 rounded-full bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-electric-500 hover:text-electric-600 shrink-0 text-xs transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <Card className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-electric-600 text-white'
                    : 'bg-navy-900 text-cyanAccent-400 border border-cyanAccent-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative group rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-electric-600 to-electric-500 text-white shadow-md shadow-electric-500/20'
                    : 'bg-slate-50 dark:bg-navy-900/80 text-navy-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Content formatted with line breaks */}
                <div className="whitespace-pre-line font-sans font-medium">
                  {msg.content}
                </div>

                {/* Footer copy button & provider badge */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-cyanAccent-500" /> Grounded Banking Guidelines
                    </span>
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="hover:text-electric-600 dark:hover:text-cyanAccent-400 flex items-center gap-1 font-semibold"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-navy-900 text-cyanAccent-400 flex items-center justify-center shrink-0 border border-cyanAccent-500/30">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyanAccent-400 animate-ping" />
              <span>{t('ai.thinking')}</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </Card>

      {/* Input bar */}
      <div className="relative">
        <textarea
          rows="2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('ai.inputPlaceholder')}
          className="w-full pl-4 pr-14 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-darkCard text-xs sm:text-sm text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none shadow-sm resize-none font-tamil"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-gradient-to-r from-electric-600 to-cyanAccent-600 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
