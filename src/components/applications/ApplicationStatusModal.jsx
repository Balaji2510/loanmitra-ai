import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../contexts/DataContext';
import { STAGE_CONFIG } from '../../utils/formatters';

export function ApplicationStatusModal({ isOpen, onClose, application }) {
  const { updateApplicationStatus } = useData();

  const [status, setStatus] = useState(application?.status || 'new_lead');
  const [note, setNote] = useState('');

  if (!application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateApplicationStatus(application.id, status, note);
    onClose();
  };

  const stages = [
    { key: 'new_lead', label: '1. New Lead' },
    { key: 'contacted', label: '2. Contacted' },
    { key: 'eligibility_checked', label: '3. Eligibility Checked' },
    { key: 'documents_pending', label: '4. Documents Pending' },
    { key: 'application_submitted', label: '5. Application Submitted' },
    { key: 'under_verification', label: '6. Under Verification' },
    { key: 'approved', label: '7. Approved / Sanctioned' },
    { key: 'rejected', label: '8. Rejected' },
    { key: 'disbursed', label: '9. Disbursed' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Loan Application Stage"
      subtitle={`File for ${application.customer_name} • ${application.lender_name || 'Bank'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            New Workflow Stage *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm font-semibold focus:ring-2 focus:ring-electric-500 focus:outline-none"
          >
            {stages.map((st) => (
              <option key={st.key} value={st.key}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Status Transition Remark / Note
          </label>
          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Sanction letter issued by credit manager; e-mandate registered..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
          />
        </div>

        {status === 'approved' && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            💡 Marking this application as <strong>Approved</strong> will automatically generate an auditable commission record in the Commission Tracker.
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Confirm Transition
          </Button>
        </div>
      </form>
    </Modal>
  );
}
