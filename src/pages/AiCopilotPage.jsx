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
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Square,
  Radio,
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

  // Voice Assistant state - DEFAULT TO ALWAYS AUTO-SPEAK!
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem('loanmitra_auto_speak');
    return saved !== null ? saved === 'true' : true;
  });
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  // Pre-load and cache speech synthesis voices immediately
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    utteranceRef.current = null;
  };

  const speakText = (text, msgId = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking && speakingMessageId === msgId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    // Clean markdown, symbols, asterisks, bullet points for natural, fluid speech
    const cleanText = text
      .replace(/[*#_`~>-]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/₹/g, 'Rupees ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // Chrome GC workaround: keep reference in ref and window to prevent garbage collection cut-off
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (language === 'ta') {
      const tamilVoice = voices.find(
        (v) => v.lang.toLowerCase().includes('ta') || v.name.toLowerCase().includes('tamil')
      );
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
      utterance.lang = 'ta-IN';
    } else {
      const inVoice = voices.find(
        (v) =>
          v.lang === 'en-IN' ||
          v.lang.toLowerCase().includes('india') ||
          v.lang.startsWith('en')
      );
      if (inVoice) {
        utterance.voice = inVoice;
      }
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageId(msgId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      utteranceRef.current = null;
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis notification:', err);
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.__loanmitra_utterance = utterance;

    // Resume engine before speaking to prevent browser sleep
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  const toggleAutoSpeak = () => {
    const nextVal = !autoSpeak;
    setAutoSpeak(nextVal);
    localStorage.setItem('loanmitra_auto_speak', String(nextVal));
    if (!nextVal) stopSpeaking();
  };

  const toggleListening = () => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert('Voice dictation is supported in Google Chrome, Microsoft Edge, and Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition start failed:', e);
      setIsListening(false);
    }
  };

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

    stopSpeaking();

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
          provider: data.provider || 'gemini-3.5-flash',
          isDemoMode: data.isDemoMode,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botReply]);

        // Auto speak response if enabled
        if (autoSpeak && data.reply) {
          speakText(data.reply, botReply.id);
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Chat Error:', err);
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
      if (autoSpeak) {
        speakText(fallbackReply.content, fallbackReply.id);
      }
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
            Voice-enabled advisor copilot with speech synthesis and voice commands
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute / Unmute Voice Output */}
          <button
            onClick={toggleAutoSpeak}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              autoSpeak
                ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyanAccent-400 border-cyan-300 dark:border-cyan-600 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title={autoSpeak ? 'Mute AI voice output' : 'Enable AI voice output'}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{autoSpeak ? 'Voice Speaking' : 'Muted'}</span>
          </button>

          {/* Stop speech button if currently speaking */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1 animate-pulse shadow-sm"
              title="Stop Speaking"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Voice</span>
            </button>
          )}

          <button
            onClick={() => {
              stopSpeaking();
              setMessages([
                {
                  id: 'msg-reset',
                  role: 'assistant',
                  content: 'Conversation history cleared. How can I help with your loan files now?',
                  timestamp: new Date().toISOString(),
                },
              ]);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Status Indicator Banner */}
      {isSpeaking && (
        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 via-electric-500/10 to-transparent border border-cyan-500/20 flex items-center justify-between text-xs text-cyan-700 dark:text-cyanAccent-300">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-500 animate-ping" />
            <span className="font-semibold">AI Voice Assistant is speaking aloud...</span>
          </div>
          <button
            onClick={stopSpeaking}
            className="font-bold underline hover:text-rose-500 transition-colors"
          >
            Click to stop audio
          </button>
        </div>
      )}

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
          const isCurrentSpeaking = isSpeaking && speakingMessageId === msg.id;

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
                    : isCurrentSpeaking
                    ? 'bg-cyan-50/80 dark:bg-navy-900 border-2 border-cyanAccent-400 text-navy-900 dark:text-slate-100 shadow-lg shadow-cyanAccent-500/10'
                    : 'bg-slate-50 dark:bg-navy-900/80 text-navy-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Content formatted with line breaks */}
                <div className="whitespace-pre-line font-sans font-medium">
                  {msg.content}
                </div>

                {/* Footer copy & status */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 gap-3">
                    <span className="flex items-center gap-1 truncate">
                      <ShieldCheck className="w-3 h-3 text-cyanAccent-500 shrink-0" />
                      <span>Grounded Banking Guidelines</span>
                    </span>

                    <div className="flex items-center gap-3 shrink-0">
                      {isCurrentSpeaking && (
                        <span className="flex items-center gap-1 text-cyan-600 dark:text-cyanAccent-400 font-semibold animate-pulse">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speaking out loud...</span>
                        </span>
                      )}

                      {/* Copy Button */}
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

      {/* Input bar with Mic Voice input */}
      <div className="relative">
        <textarea
          rows="2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? '🎙️ Listening to your voice... Speak now in Tamil or English'
              : t('ai.inputPlaceholder')
          }
          className={`w-full pl-4 pr-24 py-3 rounded-2xl border bg-white dark:bg-surface-darkCard text-xs sm:text-sm text-navy-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:outline-none shadow-sm resize-none font-tamil transition-all ${
            isListening
              ? 'border-rose-500 ring-2 ring-rose-400/30 bg-rose-50/20'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        />

        <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak to AI (Voice Input)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-electric-600 to-cyanAccent-600 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
