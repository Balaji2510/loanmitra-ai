import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatRupee, formatDate, STAGE_CONFIG } from '../../utils/formatters';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  IndianRupee,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export function CustomerDetailModal({ isOpen, onClose, customer }) {
  const { applications, followups, documents } = useData();
  const navigate = useNavigate();

  if (!customer) return null;

  const customerApps = applications.filter((a) => a.customer_id === customer.id);
  const customerFollowups = followups.filter((f) => f.customer_id === customer.id);
  const customerDocs = documents.filter((d) => d.customer_id === customer.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer.full_name}
      subtitle={`Customer ID: ${customer.id.substring(0, 13)}...`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Profile Card Summary */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block">Phone</span>
            <span className="text-xs sm:text-sm font-bold text-navy-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-electric-500" />
              {customer.phone}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Location</span>
            <span className="text-xs sm:text-sm font-bold text-navy-900 dark:text-white flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyanAccent-500" />
              {customer.city}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Monthly Income</span>
            <span className="text-xs sm:text-sm font-extrabold text-navy-900 dark:text-white mt-0.5 block font-sans">
              {formatRupee(customer.monthly_income)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">CIBIL Score</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block font-sans">
              {customer.credit_score || 720}
            </span>
          </div>
        </div>

        {/* Existing Obligations & Loan Needs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-darkCard">
            <span className="text-xs text-slate-500 block">Preferred Loan</span>
            <span className="text-sm font-bold text-navy-900 dark:text-white capitalize">
              {customer.preferred_loan_type} Loan
            </span>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-darkCard">
            <span className="text-xs text-slate-500 block">Required Amount</span>
            <span className="text-sm font-extrabold text-electric-600 dark:text-cyanAccent-400 font-sans">
              {formatRupee(customer.required_loan_amount)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-darkCard">
            <span className="text-xs text-slate-500 block">Existing Monthly EMI</span>
            <span className="text-sm font-bold text-rose-500 font-sans">
              {formatRupee(customer.existing_emi)}
            </span>
          </div>
        </div>

        {/* Loan Applications History */}
        <div>
          <h4 className="text-sm font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-electric-500" />
            <span>Loan Applications ({customerApps.length})</span>
          </h4>
          {customerApps.length === 0 ? (
            <p className="text-xs text-slate-400 p-3 bg-slate-50 dark:bg-navy-900 rounded-lg">
              No active loan applications yet.
            </p>
          ) : (
            <div className="space-y-2">
              {customerApps.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-darkCard flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-navy-900 dark:text-white">
                        {app.lender_name || 'Bank Partner'}
                      </span>
                      <Badge variant="primary" size="sm">
                        {STAGE_CONFIG[app.status]?.label || app.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatRupee(app.requested_amount)} • {app.tenure_months} Months • Created {formatDate(app.created_at)}
                    </p>
                  </div>
                  {app.calculated_emi && (
                    <span className="text-xs font-bold text-navy-900 dark:text-white">
                      EMI: {formatRupee(app.calculated_emi)}/mo
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              navigate('/eligibility');
            }}
          >
            Check FOIR Eligibility
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => {
              onClose();
              navigate('/ai-copilot');
            }}
          >
            Ask Gemini About Customer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
