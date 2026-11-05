import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../locales/i18n';

export function ApplicationModal({ isOpen, onClose, applicationToEdit = null }) {
  const { customers, addApplication, updateApplication } = useData();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    customer_id: customers[0]?.id || '',
    lender_name: 'HDFC Bank',
    loan_type: 'personal',
    requested_amount: 500000,
    tenure_months: 48,
    interest_rate: 10.75,
    status: 'new_lead',
    internal_notes: '',
  });

  useEffect(() => {
    if (applicationToEdit) {
      setFormData({
        customer_id: applicationToEdit.customer_id || customers[0]?.id || '',
        lender_name: applicationToEdit.lender_name || 'HDFC Bank',
        loan_type: applicationToEdit.loan_type || 'personal',
        requested_amount: applicationToEdit.requested_amount || 500000,
        tenure_months: applicationToEdit.tenure_months || 48,
        interest_rate: applicationToEdit.interest_rate || 10.75,
        status: applicationToEdit.status || 'new_lead',
        internal_notes: applicationToEdit.internal_notes || '',
      });
    } else {
      setFormData({
        customer_id: customers[0]?.id || '',
        lender_name: 'HDFC Bank',
        loan_type: 'personal',
        requested_amount: 500000,
        tenure_months: 48,
        interest_rate: 10.75,
        status: 'new_lead',
        internal_notes: '',
      });
    }
  }, [applicationToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === formData.customer_id);

    // Calculate initial EMI
    const r = Number(formData.interest_rate) / (12 * 100);
    const n = Number(formData.tenure_months);
    const factor = Math.pow(1 + r, n);
    const calculated_emi = Math.round((Number(formData.requested_amount) * r * factor) / (factor - 1));

    if (applicationToEdit) {
      updateApplication(applicationToEdit.id, {
        ...formData,
        customer_name: cust ? cust.full_name : applicationToEdit.customer_name,
        requested_amount: Number(formData.requested_amount),
        tenure_months: Number(formData.tenure_months),
        interest_rate: Number(formData.interest_rate),
        calculated_emi,
      });
    } else {
      addApplication({
        ...formData,
        customer_name: cust ? cust.full_name : 'Customer',
        requested_amount: Number(formData.requested_amount),
        tenure_months: Number(formData.tenure_months),
        interest_rate: Number(formData.interest_rate),
        calculated_emi,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={applicationToEdit ? 'Edit Loan Application Details' : t('applications.newApplication')}
      subtitle={applicationToEdit ? `Updating parameters for ${applicationToEdit.customer_name}` : "Initiate a new loan file for a registered customer"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Select Customer */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Borrower Customer *
            </label>
            <select
              value={formData.customer_id}
              onChange={(e) => {
                const cust = customers.find((c) => c.id === e.target.value);
                setFormData({
                  ...formData,
                  customer_id: e.target.value,
                  loan_type: cust?.preferred_loan_type || formData.loan_type,
                  requested_amount: cust?.required_loan_amount || formData.requested_amount,
                });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.phone} - {c.city})
                </option>
              ))}
            </select>
          </div>

          {/* Partner Lender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Bank / NBFC
            </label>
            <select
              value={formData.lender_name}
              onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="State Bank of India">State Bank of India</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="Axis Bank">Axis Bank</option>
              <option value="Bajaj Finserv">Bajaj Finserv</option>
              <option value="Tata Capital">Tata Capital</option>
              <option value="Muthoot Finance">Muthoot Finance</option>
            </select>
          </div>

          {/* Loan Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Loan Type
            </label>
            <select
              value={formData.loan_type}
              onChange={(e) => setFormData({ ...formData, loan_type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="personal">Personal Loan</option>
              <option value="home">Home Loan</option>
              <option value="business">Business Loan</option>
              <option value="vehicle">Vehicle Loan</option>
              <option value="education">Education Loan</option>
              <option value="lap">Loan Against Property</option>
              <option value="gold">Gold Loan</option>
            </select>
          </div>

          {/* Requested Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Requested Loan Amount (₹)
            </label>
            <input
              type="number"
              value={formData.requested_amount}
              onChange={(e) => setFormData({ ...formData, requested_amount: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          {/* Tenure */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tenure (Months)
            </label>
            <input
              type="number"
              value={formData.tenure_months}
              onChange={(e) => setFormData({ ...formData, tenure_months: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Indicative Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              step="0.05"
              value={formData.interest_rate}
              onChange={(e) => setFormData({ ...formData, interest_rate: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Initial Stage
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="new_lead">1. New Lead</option>
              <option value="contacted">2. Contacted</option>
              <option value="eligibility_checked">3. Eligibility Checked</option>
              <option value="documents_pending">4. Documents Pending</option>
              <option value="application_submitted">5. Application Submitted</option>
            </select>
          </div>

          {/* Internal Notes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Underwriting Remarks
            </label>
            <textarea
              rows="2"
              value={formData.internal_notes}
              onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
              placeholder="Notes on document readiness or lender relationship..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            Create Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
