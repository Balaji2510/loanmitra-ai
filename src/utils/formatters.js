// Indian Currency & Formatting Utilities

export function formatRupee(amount, options = {}) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Number(amount);
  
  if (options.compact && Math.abs(num) >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (options.compact && Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${Number(value).toFixed(2)}%`;
}

export function formatDate(dateStr, includeTime = false) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';

  const datePart = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (!includeTime) return datePart;

  const timePart = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart}, ${timePart}`;
}

export const LOAN_TYPE_LABELS = {
  personal: { en: 'Personal Loan', ta: 'தனிநபர் கடன்', color: 'blue' },
  home: { en: 'Home Loan', ta: 'வீட்டுக் கடன்', color: 'emerald' },
  business: { en: 'Business Loan', ta: 'வணிகக் கடன்', color: 'purple' },
  vehicle: { en: 'Vehicle Loan', ta: 'வாகனக் கடன்', color: 'amber' },
  education: { en: 'Education Loan', ta: 'கல்விக் கடன்', color: 'cyan' },
  lap: { en: 'Loan Against Property', ta: 'சொத்து பிணைக் கடன்', color: 'indigo' },
  gold: { en: 'Gold Loan', ta: 'தங்கக் கடன்', color: 'yellow' },
};

export const STAGE_CONFIG = {
  new_lead: { step: 1, label: 'New Lead', color: 'bg-slate-500 text-white' },
  contacted: { step: 2, label: 'Contacted', color: 'bg-blue-500 text-white' },
  eligibility_checked: { step: 3, label: 'Eligibility Checked', color: 'bg-indigo-500 text-white' },
  documents_pending: { step: 4, label: 'Documents Pending', color: 'bg-amber-500 text-white' },
  application_submitted: { step: 5, label: 'Application Submitted', color: 'bg-cyan-600 text-white' },
  under_verification: { step: 6, label: 'Under Verification', color: 'bg-purple-600 text-white' },
  approved: { step: 7, label: 'Approved', color: 'bg-emerald-600 text-white' },
  rejected: { step: 8, label: 'Rejected', color: 'bg-rose-600 text-white' },
  disbursed: { step: 9, label: 'Disbursed', color: 'bg-teal-600 text-white' },
};
