import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../locales/i18n';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatDate } from '../utils/formatters';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Phone,
} from 'lucide-react';

export function FollowupsPage() {
  const { customers, followups, addFollowup, markFollowupCompleted } = useData();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'today', 'upcoming', 'overdue', 'completed'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [newFollowupData, setNewFollowupData] = useState({
    customer_id: customers[0]?.id || '',
    title: '',
    description: '',
    priority: 'medium',
    due_date: new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16),
  });

  const now = new Date();

  const filteredFollowups = followups.filter((f) => {
    const due = new Date(f.due_date);
    const isCompleted = f.status === 'completed';

    if (activeFilter === 'completed') return isCompleted;
    if (isCompleted) return false;

    if (activeFilter === 'today') {
      return due.toDateString() === now.toDateString();
    }
    if (activeFilter === 'overdue') {
      return due < now && due.toDateString() !== now.toDateString();
    }
    if (activeFilter === 'upcoming') {
      return due > now;
    }
    return true;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newFollowupData.customer_id);
    const custName = cust ? cust.full_name : 'Customer';

    addFollowup({
      ...newFollowupData,
      customer_name: custName,
      suggested_message_ta: `வணக்கம் ${custName} அவர்களே, உங்கள் கடன் விண்ணப்ப நிலவரம் குறித்து பேச அழைக்கிறேன். தயவுசெய்து தொடர்பு கொள்ளவும். - LoanMitra AI`,
      suggested_message_en: `Hello ${custName}, following up regarding your loan application progress with LoanMitra AI. Please let us know a good time to connect.`,
    });

    setIsAddModalOpen(false);
    setNewFollowupData({
      customer_id: customers[0]?.id || '',
      title: '',
      description: '',
      priority: 'medium',
      due_date: new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16),
    });
  };

  const copyMessage = (id, message) => {
    navigator.clipboard.writeText(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-electric-500" />
            <span>{t('followups.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('followups.subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          {t('followups.newReminder')}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All Pending' },
          { key: 'today', label: "Today's Schedule" },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'overdue', label: 'Overdue' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeFilter === tab.key
                ? 'bg-electric-600 text-white shadow-md shadow-electric-600/20'
                : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Follow-up Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFollowups.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white dark:bg-surface-darkCard rounded-2xl border border-slate-200 dark:border-slate-800">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold">No follow-ups found for this filter.</p>
          </div>
        ) : (
          filteredFollowups.map((f) => (
            <Card key={f.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-navy-900 dark:text-white">
                      {f.title}
                    </h3>
                    <p className="text-xs font-semibold text-electric-600 dark:text-cyanAccent-400 mt-0.5">
                      Customer: {f.customer_name}
                    </p>
                  </div>
                  <Badge
                    variant={
                      f.priority === 'high'
                        ? 'danger'
                        : f.priority === 'medium'
                        ? 'warning'
                        : 'default'
                    }
                    size="sm"
                  >
                    {f.priority}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {f.description}
                </p>

                {/* AI Suggested Bilingual Template */}
                {f.suggested_message_ta && (
                  <div className="mt-3.5 p-3 rounded-xl bg-cyanAccent-50/60 dark:bg-cyanAccent-500/10 border border-cyanAccent-200 dark:border-cyanAccent-500/20 text-xs">
                    <span className="text-[10px] font-bold text-cyanAccent-600 dark:text-cyanAccent-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Ready-to-send Tamil WhatsApp Message:
                    </span>
                    <p className="font-tamil text-slate-800 dark:text-cyanAccent-100 italic leading-relaxed">
                      "{f.suggested_message_ta}"
                    </p>
                    <button
                      onClick={() => copyMessage(f.id, f.suggested_message_ta)}
                      className="mt-2 text-[11px] font-bold text-electric-600 dark:text-cyanAccent-400 flex items-center gap-1 hover:underline"
                    >
                      {copiedId === f.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t('followups.copyMessage')}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer status & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Due: {formatDate(f.due_date, true)}
                </span>

                {f.status !== 'completed' ? (
                  <button
                    onClick={() => markFollowupCompleted(f.id)}
                    className="px-3 py-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('followups.markDone')}</span>
                  </button>
                ) : (
                  <Badge variant="success" size="sm">
                    Completed
                  </Badge>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* New Follow-up Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Customer Follow-up"
        subtitle="Set task reminders with automated bilingual outreach"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Borrower
            </label>
            <select
              value={newFollowupData.customer_id}
              onChange={(e) =>
                setNewFollowupData({ ...newFollowupData, customer_id: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reminder Subject *
            </label>
            <input
              type="text"
              required
              value={newFollowupData.title}
              onChange={(e) => setNewFollowupData({ ...newFollowupData, title: e.target.value })}
              placeholder="e.g. Collect 3 months payslips"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={newFollowupData.priority}
                onChange={(e) =>
                  setNewFollowupData({ ...newFollowupData, priority: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Scheduled Time
              </label>
              <input
                type="datetime-local"
                value={newFollowupData.due_date}
                onChange={(e) =>
                  setNewFollowupData({ ...newFollowupData, due_date: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Follow-up Details
            </label>
            <textarea
              rows="2"
              value={newFollowupData.description}
              onChange={(e) =>
                setNewFollowupData({ ...newFollowupData, description: e.target.value })
              }
              placeholder="Notes on specific documents or queries to discuss..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Schedule Reminder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
