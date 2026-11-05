import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isLiveSupabaseConfigured } from '../services/supabase';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

// Initial Seed Data matching PostgreSQL schema
const INITIAL_CUSTOMERS = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    advisor_id: 'b0000000-0000-0000-0000-000000000003',
    full_name: 'Karthik Narayanan',
    phone: '+91 98401 23456',
    email: 'karthik.n@gmail.com',
    city: 'Chennai',
    employment_type: 'Salaried',
    monthly_income: 75000,
    existing_emi: 12000,
    preferred_loan_type: 'personal',
    required_loan_amount: 500000,
    preferred_language: 'ta',
    credit_score: 740,
    consent_given: true,
    notes: 'Senior Software Engineer at Tidel Park. Wants personal loan for home renovation.',
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    advisor_id: 'b0000000-0000-0000-0000-000000000003',
    full_name: 'Ananya Sundaram',
    phone: '+91 98412 34567',
    email: 'ananya.sundar@outlook.com',
    city: 'Coimbatore',
    employment_type: 'Salaried',
    monthly_income: 110000,
    existing_emi: 18500,
    preferred_loan_type: 'home',
    required_loan_amount: 4500000,
    preferred_language: 'tanglish',
    credit_score: 785,
    consent_given: true,
    notes: 'Looking for competitive home loan for 3BHK flat in Saravanampatti.',
    created_at: '2025-01-18T10:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    advisor_id: 'b0000000-0000-0000-0000-000000000003',
    full_name: 'Murugan Textiles (P. Murugan)',
    phone: '+91 94433 45678',
    email: 'murugan.tex@yahoo.com',
    city: 'Madurai',
    employment_type: 'Business',
    monthly_income: 160000,
    existing_emi: 35000,
    preferred_loan_type: 'business',
    required_loan_amount: 2500000,
    preferred_language: 'ta',
    credit_score: 695,
    consent_given: true,
    notes: 'Working capital expansion for handloom powerloom unit.',
    created_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    advisor_id: 'b0000000-0000-0000-0000-000000000003',
    full_name: 'Vigneshwaran R',
    phone: '+91 97911 56789',
    email: 'vicky.r@gmail.com',
    city: 'Salem',
    employment_type: 'Salaried',
    monthly_income: 38000,
    existing_emi: 5000,
    preferred_loan_type: 'vehicle',
    required_loan_amount: 650000,
    preferred_language: 'en',
    credit_score: 710,
    consent_given: true,
    notes: 'Applying for EV car loan with Axis Bank.',
    created_at: '2025-01-25T14:00:00Z',
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    customer_id: 'd0000000-0000-0000-0000-000000000001',
    customer_name: 'Karthik Narayanan',
    advisor_id: 'b0000000-0000-0000-0000-000000000003',
    lender_id: 'c0000000-0000-0000-0000-000000000001',
    lender_name: 'HDFC Bank',
    loan_type: 'personal',
    requested_amount: 500000,
    sanctioned_amount: 500000,
    interest_rate: 10.75,
    tenure_months: 48,
    calculated_emi: 12870,
    status: 'approved',
    internal_notes: 'Approved by HDFC Credit Underwriting. Awaiting e-sign.',
    timeline: [
      { stage: 'new_lead', timestamp: '2025-01-10T10:00:00Z', note: 'Lead received' },
      { stage: 'eligibility_checked', timestamp: '2025-01-11T11:30:00Z', note: 'FOIR calculated at 33.1%' },
      { stage: 'documents_pending', timestamp: '2025-01-12T09:15:00Z', note: 'Requested payslips' },
      { stage: 'application_submitted', timestamp: '2025-01-14T14:20:00Z', note: 'Docs verified & logged' },
      { stage: 'under_verification', timestamp: '2025-01-15T16:00:00Z', note: 'Verification passed' },
      { stage: 'approved', timestamp: '2025-01-16T12:00:00Z', note: 'Sanction letter issued' },
    ],
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    customer_id: 'd0000000-0000-0000-0000-000000000002',
    customer_name: 'Ananya Sundaram',
    advisor_id: 'b0000000-0000-0000-0000-000000000003',
    lender_id: 'c0000000-0000-0000-0000-000000000002',
    lender_name: 'State Bank of India',
    loan_type: 'home',
    requested_amount: 4500000,
    sanctioned_amount: null,
    interest_rate: 8.5,
    tenure_months: 240,
    calculated_emi: 39045,
    status: 'documents_pending',
    internal_notes: 'Builder approval agreement & parent sale deed pending from customer.',
    timeline: [
      { stage: 'new_lead', timestamp: '2025-01-18T10:00:00Z', note: 'Inquiry on SBI MaxGain' },
      { stage: 'eligibility_checked', timestamp: '2025-01-18T14:00:00Z', note: 'Capacity verified' },
      { stage: 'documents_pending', timestamp: '2025-01-19T10:30:00Z', note: 'Awaiting property deed' },
    ],
    created_at: '2025-01-18T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    customer_id: 'd0000000-0000-0000-0000-000000000003',
    customer_name: 'Murugan Textiles (P. Murugan)',
    advisor_id: 'b0000000-0000-0000-0000-000000000003',
    lender_id: 'c0000000-0000-0000-0000-000000000003',
    lender_name: 'ICICI Bank',
    loan_type: 'business',
    requested_amount: 2500000,
    sanctioned_amount: null,
    interest_rate: 13.5,
    tenure_months: 36,
    calculated_emi: 84830,
    status: 'under_verification',
    internal_notes: 'Bank manager visiting factory premises today for valuation.',
    timeline: [
      { stage: 'new_lead', timestamp: '2025-01-20T10:00:00Z', note: 'Lead initiated' },
      { stage: 'eligibility_checked', timestamp: '2025-01-21T10:00:00Z', note: 'GST returns reviewed' },
      { stage: 'application_submitted', timestamp: '2025-01-23T11:00:00Z', note: 'Logged in ICICI SME' },
      { stage: 'under_verification', timestamp: '2025-01-26T14:00:00Z', note: 'Field visit scheduled' },
    ],
    created_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    customer_id: 'd0000000-0000-0000-0000-000000000004',
    customer_name: 'Vigneshwaran R',
    advisor_id: 'b0000000-0000-0000-0000-000000000003',
    lender_id: 'c0000000-0000-0000-0000-000000000004',
    lender_name: 'Axis Bank',
    loan_type: 'vehicle',
    requested_amount: 650000,
    sanctioned_amount: 650000,
    interest_rate: 9.15,
    tenure_months: 60,
    calculated_emi: 13540,
    status: 'disbursed',
    internal_notes: 'Disbursement UTR generated. Vehicle delivered to borrower.',
    timeline: [
      { stage: 'new_lead', timestamp: '2025-01-25T14:00:00Z', note: 'Auto lead' },
      { stage: 'approved', timestamp: '2025-01-28T10:00:00Z', note: 'Instant sanction' },
      { stage: 'disbursed', timestamp: '2025-01-30T16:00:00Z', note: 'Payment credited to dealer' },
    ],
    created_at: '2025-01-25T14:00:00Z',
  },
];

const INITIAL_FOLLOWUPS = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    customer_id: 'd0000000-0000-0000-0000-000000000002',
    customer_name: 'Ananya Sundaram',
    title: 'Collect Property Sale Agreement',
    description: 'Call Ananya to collect signed builder-buyer agreement for SBI Home Loan.',
    due_date: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), // Today
    status: 'pending',
    priority: 'high',
    suggested_message_ta: 'வணக்கம் அனன்யா அவர்களே, உங்கள் SBI வீட்டுக் கடனுக்குத் தேவையான விற்பனை ஒப்பந்த நகலை (Sale Agreement) தயவுசெய்து அனுப்பவும். நன்றி - LoanMitra AI.',
    suggested_message_en: 'Hello Ananya, please share the signed Sale Agreement to fast-track your SBI Home Loan sanction. Thanks - LoanMitra AI.',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    customer_id: 'd0000000-0000-0000-0000-000000000003',
    customer_name: 'Murugan Textiles (P. Murugan)',
    title: 'Follow up on GST Return Filings',
    description: 'Murugan needs to submit 6 months GSTR-3B for business loan approval.',
    due_date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // Tomorrow
    status: 'pending',
    priority: 'medium',
    suggested_message_ta: 'வணக்கம் திரு. முருகன், உங்கள் வணிகக் கடன் செயலாக்கத்திற்கு கடந்த 6 மாத GSTR-3B தாக்கல் ஆவணங்களை அனுப்பவும்.',
    suggested_message_en: 'Hello Mr. Murugan, please submit your past 6 months GSTR-3B copies to expedite your Business Loan approval.',
  },
];

const INITIAL_COMMISSIONS = [
  {
    id: '90000000-0000-0000-0000-000000000001',
    application_id: 'e0000000-0000-0000-0000-000000000001',
    customer_name: 'Karthik Narayanan',
    lender_name: 'HDFC Bank',
    loan_type: 'personal',
    loan_amount: 500000,
    commission_rate_pct: 1.5,
    commission_amount: 7500,
    advisor_share_amount: 3750,
    company_share_amount: 3750,
    status: 'approved',
    payout_date: '2025-02-15',
    notes: 'HDFC Personal Loan sanction commission (50% advisor split).',
  },
  {
    id: '90000000-0000-0000-0000-000000000002',
    application_id: 'e0000000-0000-0000-0000-000000000004',
    customer_name: 'Vigneshwaran R',
    lender_name: 'Axis Bank',
    loan_type: 'vehicle',
    loan_amount: 650000,
    commission_rate_pct: 1.25,
    commission_amount: 8125,
    advisor_share_amount: 4062,
    company_share_amount: 4063,
    status: 'paid',
    payout_date: '2025-02-01',
    notes: 'Axis Bank auto loan disbursement payout.',
  },
];

const INITIAL_DOCUMENTS = [
  {
    id: 'doc-001',
    customer_id: 'd0000000-0000-0000-0000-000000000001',
    customer_name: 'Karthik Narayanan',
    file_name: 'karthik_salary_slip_nov2024.pdf',
    doc_type: 'salary_slip',
    file_size: 420000,
    human_verified: true,
    verification_status: 'verified_by_advisor',
    ai_extracted_data: {
      employer: 'Cognizant Technology Solutions',
      gross_pay: 82500,
      net_pay: 75000,
      period: 'November 2024',
      pan: 'BCDPK****K',
    },
    created_at: '2025-01-12T10:00:00Z',
  },
];

export function DataProvider({ children }) {
  const { profile } = useAuth();

  // Local storage backed state
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('loanmitra_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('loanmitra_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [followups, setFollowups] = useState(() => {
    const saved = localStorage.getItem('loanmitra_followups');
    return saved ? JSON.parse(saved) : INITIAL_FOLLOWUPS;
  });

  const [commissions, setCommissions] = useState(() => {
    const saved = localStorage.getItem('loanmitra_commissions');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('loanmitra_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  // Sync state to localStorage for demo persistence
  useEffect(() => {
    localStorage.setItem('loanmitra_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('loanmitra_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('loanmitra_followups', JSON.stringify(followups));
  }, [followups]);

  useEffect(() => {
    localStorage.setItem('loanmitra_commissions', JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem('loanmitra_documents', JSON.stringify(documents));
  }, [documents]);

  // Customer Actions
  const addCustomer = (customerData) => {
    const newCust = {
      ...customerData,
      id: `d${Date.now()}`,
      organization_id: profile?.organization_id || 'a0000000-0000-0000-0000-000000000001',
      advisor_id: profile?.id,
      created_at: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id, updatedFields) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields, updated_at: new Date().toISOString() } : c))
    );
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setApplications((prev) => prev.filter((a) => a.customer_id !== id));
    setFollowups((prev) => prev.filter((f) => f.customer_id !== id));
  };

  // Application Actions
  const addApplication = (appData) => {
    const newApp = {
      ...appData,
      id: `e${Date.now()}`,
      organization_id: profile?.organization_id,
      advisor_id: profile?.id,
      timeline: [
        {
          stage: appData.status || 'new_lead',
          timestamp: new Date().toISOString(),
          note: 'Application record created',
        },
      ],
      created_at: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);

    // If approved or disbursed, automatically create commission record
    if (newApp.status === 'approved' || newApp.status === 'disbursed') {
      createCommissionRecord(newApp);
    }
    return newApp;
  };

  const updateApplicationStatus = (id, newStatus, note = '') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const updatedTimeline = [
          ...(app.timeline || []),
          {
            stage: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${newStatus}`,
          },
        ];
        const updated = {
          ...app,
          status: newStatus,
          timeline: updatedTimeline,
          updated_at: new Date().toISOString(),
        };

        if (newStatus === 'approved' && !commissions.some((c) => c.application_id === id)) {
          createCommissionRecord(updated);
        }
        return updated;
      })
    );
  };

  // Commission Helper
  const createCommissionRecord = (app) => {
    const rate = 1.5; // 1.5% commission
    const totalComm = Math.round((app.requested_amount || app.sanctioned_amount || 0) * (rate / 100));
    const advisorShare = Math.round(totalComm * 0.5);
    const companyShare = totalComm - advisorShare;

    const comm = {
      id: `comm-${Date.now()}`,
      application_id: app.id,
      customer_name: app.customer_name,
      lender_name: app.lender_name || 'Bank Partner',
      loan_type: app.loan_type,
      loan_amount: app.requested_amount || app.sanctioned_amount,
      commission_rate_pct: rate,
      commission_amount: totalComm,
      advisor_share_amount: advisorShare,
      company_share_amount: companyShare,
      status: app.status === 'disbursed' ? 'paid' : 'approved',
      payout_date: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      notes: 'Auto-generated commission entry from application status update.',
    };
    setCommissions((prev) => [comm, ...prev]);
  };

  // Follow-up Actions
  const addFollowup = (followupData) => {
    const newFollowup = {
      ...followupData,
      id: `f${Date.now()}`,
      organization_id: profile?.organization_id,
      advisor_id: profile?.id,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setFollowups((prev) => [newFollowup, ...prev]);
    return newFollowup;
  };

  const markFollowupCompleted = (id) => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'completed', completed_at: new Date().toISOString() } : f))
    );
  };

  // Document Actions
  const addDocument = (docData) => {
    const newDoc = {
      ...docData,
      id: `doc-${Date.now()}`,
      human_verified: false,
      created_at: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const toggleDocumentVerification = (id, verified) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              human_verified: verified,
              verification_status: verified ? 'verified_by_advisor' : 'ai_extracted',
              verified_at: verified ? new Date().toISOString() : null,
            }
          : d
      )
    );
  };

  // Live aggregate metrics directly calculated from actual database records
  const stats = {
    totalCustomers: customers.length,
    newLeads: applications.filter((a) => a.status === 'new_lead').length,
    activeApplications: applications.filter((a) => !['rejected', 'disbursed'].includes(a.status)).length,
    pendingDocuments: applications.filter((a) => a.status === 'documents_pending').length,
    approvedLoans: applications.filter((a) => a.status === 'approved').length,
    rejectedApplications: applications.filter((a) => a.status === 'rejected').length,
    totalDisbursement: applications
      .filter((a) => ['approved', 'disbursed'].includes(a.status))
      .reduce((sum, a) => sum + (Number(a.sanctioned_amount || a.requested_amount) || 0), 0),
    monthlyCommission: commissions.reduce((sum, c) => sum + (Number(c.commission_amount) || 0), 0),
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        applications,
        followups,
        commissions,
        documents,
        stats,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addApplication,
        updateApplicationStatus,
        addFollowup,
        markFollowupCompleted,
        addDocument,
        toggleDocumentVerification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
