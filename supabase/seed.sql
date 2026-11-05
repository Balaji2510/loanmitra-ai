-- ============================================================================
-- LOANMITRA AI - Seed Data (Realistic Indian Banking Policies & Demo Data)
-- ============================================================================

-- 1. Demo Organization
INSERT INTO organizations (id, name, slug, default_commission_rate, settings)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'LoanMitra Prime Advisory Services',
    'loanmitra-prime',
    1.75,
    '{"city": "Chennai", "state": "Tamil Nadu", "allow_tanglish": true}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. Demo Profiles
INSERT INTO profiles (id, organization_id, full_name, email, phone, role, preferred_language, commission_split_pct)
VALUES 
    (
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Rajesh K (Super Admin)',
        'admin@loanmitra.ai',
        '+91 98401 12345',
        'super_admin',
        'ta',
        60.00
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'Meenakshi Sundaram (Branch Admin)',
        'meenakshi@loanmitra.ai',
        '+91 98402 56789',
        'company_admin',
        'ta',
        55.00
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'Suresh Kumar (Senior Loan Advisor)',
        'suresh@loanmitra.ai',
        '+91 98403 98765',
        'loan_advisor',
        'tanglish',
        50.00
    )
ON CONFLICT (id) DO NOTHING;

-- 3. Top Indian Lenders
INSERT INTO lenders (id, name, code, category, logo_url, website)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'HDFC Bank', 'HDFC', 'Bank', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=128&q=80', 'https://www.hdfcbank.com'),
    ('c0000000-0000-0000-0000-000000000002', 'State Bank of India', 'SBI', 'Bank', 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=128&q=80', 'https://sbi.co.in'),
    ('c0000000-0000-0000-0000-000000000003', 'ICICI Bank', 'ICICI', 'Bank', 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=128&q=80', 'https://www.icicibank.com'),
    ('c0000000-0000-0000-0000-000000000004', 'Axis Bank', 'AXIS', 'Bank', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&q=80', 'https://www.axisbank.com'),
    ('c0000000-0000-0000-0000-000000000005', 'Bajaj Finserv', 'BAJAJ', 'NBFC', 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=128&q=80', 'https://www.bajajfinserv.in'),
    ('c0000000-0000-0000-0000-000000000006', 'Tata Capital', 'TATA', 'NBFC', 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=128&q=80', 'https://www.tatacapital.com'),
    ('c0000000-0000-0000-0000-000000000007', 'Muthoot Finance', 'MUTHOOT', 'NBFC', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=128&q=80', 'https://www.muthootfinance.com')
ON CONFLICT (id) DO NOTHING;

-- 4. Verified Lender Policies (Realistic eligibility matrix for smart matching engine)
INSERT INTO lender_policies (
    lender_id, loan_category, min_income, min_credit_score, 
    interest_rate_min, interest_rate_max, max_foir_pct, 
    min_tenure_months, max_tenure_months, max_loan_amount, 
    processing_fee, employment_requirements, policy_description
)
VALUES
    -- HDFC Bank Personal Loan
    (
        'c0000000-0000-0000-0000-000000000001', 'personal', 35000, 720,
        10.50, 14.50, 50.00, 12, 60, 4000000,
        '0.99% to 2.50% (Min ₹1,999)', ARRAY['Salaried'],
        'Requires minimum 2 years work experience and 6 months salary credit with top corporate or listed entity.'
    ),
    -- SBI Home Loan
    (
        'c0000000-0000-0000-0000-000000000002', 'home', 25000, 700,
        8.40, 9.65, 55.00, 60, 360, 100000000,
        '0.35% (Max ₹10,000 + GST)', ARRAY['Salaried', 'Self-Employed', 'Business', 'Professional'],
        'Lowest floating rates pegged to EBLR. Special 0.05% discount for women borrowers.'
    ),
    -- ICICI Bank Business Loan
    (
        'c0000000-0000-0000-0000-000000000003', 'business', 50000, 680,
        13.00, 17.50, 45.00, 12, 48, 5000000,
        '1.50% to 2.00%', ARRAY['Business', 'Self-Employed'],
        'Minimum business vintage of 3 years with audited ITR and GST returns for past 12 months.'
    ),
    -- Axis Bank Vehicle Loan
    (
        'c0000000-0000-0000-0000-000000000004', 'vehicle', 25000, 680,
        8.85, 11.25, 50.00, 12, 84, 5000000,
        '₹3,500 to ₹5,500 flat', ARRAY['Salaried', 'Self-Employed'],
        'Up to 100% on-road financing for select prime passenger vehicles.'
    ),
    -- Bajaj Finserv Personal Loan (Fast Disbursal)
    (
        'c0000000-0000-0000-0000-000000000005', 'personal', 25000, 650,
        11.50, 18.00, 55.00, 12, 84, 3500000,
        '2.00% to 3.50%', ARRAY['Salaried', 'Self-Employed'],
        'Flexible hybrid flexi loan variant available. Instant digital in-principle approval within 20 minutes.'
    ),
    -- Tata Capital LAP (Loan Against Property)
    (
        'c0000000-0000-0000-0000-000000000006', 'lap', 40000, 675,
        9.25, 12.50, 60.00, 36, 180, 50000000,
        '1.00% + GST', ARRAY['Salaried', 'Self-Employed', 'Business'],
        'Up to 65% market value of residential or commercial property with clear legal title.'
    ),
    -- Muthoot Finance Gold Loan
    (
        'c0000000-0000-0000-0000-000000000007', 'gold', 10000, 500,
        9.90, 16.00, 75.00, 3, 36, 10000000,
        '₹50 to 0.5%', ARRAY['Salaried', 'Self-Employed', 'Business', 'Professional'],
        'Up to 75% LTV against 18-24 Karat gold ornaments. Minimal paperwork, same-day disbursement.'
    );

-- 5. Realistic Demo Customers
INSERT INTO customers (
    id, organization_id, advisor_id, full_name, phone, email, 
    city, employment_type, monthly_income, existing_emi, 
    preferred_loan_type, required_loan_amount, preferred_language, 
    credit_score, consent_given, notes
)
VALUES
    (
        'd0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000003',
        'Karthik Narayanan',
        '+91 98401 23456',
        'karthik.n@gmail.com',
        'Chennai',
        'Salaried',
        75000.00,
        12000.00,
        'personal',
        500000.00,
        'ta',
        740,
        true,
        'Senior Software Engineer at Tidel Park. Wants personal loan for home renovation.'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000003',
        'Ananya Sundaram',
        '+91 98412 34567',
        'ananya.sundar@outlook.com',
        'Coimbatore',
        'Salaried',
        110000.00,
        18500.00,
        'home',
        4500000.00,
        'tanglish',
        785,
        true,
        'Looking for competitive home loan for 3BHK flat in Saravanampatti.'
    ),
    (
        'd0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000003',
        'Murugan Textiles (P. Murugan)',
        '+91 94433 45678',
        'murugan.tex@yahoo.com',
        'Madurai',
        'Business',
        160000.00,
        35000.00,
        'business',
        2500000.00,
        'ta',
        695,
        true,
        'Working capital expansion for handloom powerloom unit.'
    ),
    (
        'd0000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000003',
        'Vigneshwaran R',
        '+91 97911 56789',
        'vicky.r@gmail.com',
        'Salem',
        'Salaried',
        38000.00,
        5000.00,
        'vehicle',
        650000.00,
        'en',
        710,
        true,
        'Applying for EV car loan.'
    )
ON CONFLICT (id) DO NOTHING;

-- 6. Demo Applications with Timeline
INSERT INTO applications (
    id, organization_id, customer_id, advisor_id, lender_id, 
    loan_type, requested_amount, sanctioned_amount, interest_rate, 
    tenure_months, calculated_emi, status, internal_notes, timeline
)
VALUES
    (
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000001',
        'personal',
        500000.00,
        500000.00,
        10.75,
        48,
        12870.00,
        'approved',
        'Approved by HDFC Credit Underwriting. Awaiting e-sign.',
        '[
            {"stage": "new_lead", "timestamp": "2025-01-10T10:00:00Z", "note": "Lead received via referral"},
            {"stage": "eligibility_checked", "timestamp": "2025-01-11T11:30:00Z", "note": "FOIR calculated at 33.1%, eligible up to 6.2 Lakhs"},
            {"stage": "documents_pending", "timestamp": "2025-01-12T09:15:00Z", "note": "Requested 3 months payslip and Form 16"},
            {"stage": "application_submitted", "timestamp": "2025-01-14T14:20:00Z", "note": "Docs verified and logged in HDFC portal"},
            {"stage": "under_verification", "timestamp": "2025-01-15T16:00:00Z", "note": "Field verification completed"},
            {"stage": "approved", "timestamp": "2025-01-16T12:00:00Z", "note": "Sanction letter generated"}
        ]'::jsonb
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        'home',
        4500000.00,
        null,
        8.50,
        240,
        39045.00,
        'documents_pending',
        'Builder approval agreement & parent sale deed pending from customer.',
        '[
            {"stage": "new_lead", "timestamp": "2025-01-18T10:00:00Z", "note": "Inquiry on SBI MaxGain"},
            {"stage": "eligibility_checked", "timestamp": "2025-01-18T14:00:00Z", "note": "Income verified, high capacity"},
            {"stage": "documents_pending", "timestamp": "2025-01-19T10:30:00Z", "note": "Awaiting property legal papers"}
        ]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- 7. Demo Follow-ups
INSERT INTO followups (
    id, organization_id, customer_id, advisor_id, title, description, 
    due_date, status, priority, suggested_message_ta, suggested_message_en
)
VALUES
    (
        'f0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000003',
        'Collect Property Sale Agreement',
        'Call Ananya to collect the signed copy of the builder-buyer agreement for SBI Home Loan.',
        timezone('utc', now() + interval '2 hours'),
        'pending',
        'high',
        'வணக்கம் அனன்யா அவர்களே, உங்கள் SBI வீட்டுக் கடனுக்குத் தேவையான விற்பனை ஒப்பந்த நகலை (Sale Agreement) தயவுசெய்து அனுப்பவும். நன்றி - LoanMitra AI.',
        'Hello Ananya, please share the signed Sale Agreement to fast-track your SBI Home Loan sanction. Thanks - LoanMitra AI.'
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000003',
        'Follow up on GST Return Filings',
        'Murugan needs to submit 6 months GSTR-3B for business loan approval.',
        timezone('utc', now() + interval '1 day'),
        'pending',
        'medium',
        'வணக்கம் திரு. முருகன், உங்கள் வணிகக் கடன் செயலாக்கத்திற்கு கடந்த 6 மாத GSTR-3B தாக்கல் ஆவணங்களை அனுப்பவும்.',
        'Hello Mr. Murugan, please submit your past 6 months GSTR-3B copies to expedite your Business Loan approval.'
    )
ON CONFLICT (id) DO NOTHING;

-- 8. Demo Commissions
INSERT INTO commissions (
    id, organization_id, application_id, advisor_id, 
    loan_amount, commission_rate_pct, commission_amount, 
    advisor_share_amount, company_share_amount, status, payout_date, notes
)
VALUES
    (
        '90000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000003',
        500000.00,
        1.50,
        7500.00,
        3750.00,
        3750.00,
        'approved',
        '2025-02-05',
        'HDFC Personal Loan commission (50% advisor share).'
    )
ON CONFLICT (id) DO NOTHING;
