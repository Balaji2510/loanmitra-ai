-- ============================================================================
-- LOANMITRA AI - Comprehensive Database Schema Migration
-- Production-Ready PostgreSQL Schema with RLS, Multi-Tenancy & Audit Logging
-- ============================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- Custom Enum Types
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'company_admin', 'loan_advisor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE loan_type AS ENUM (
        'personal', 'home', 'business', 'vehicle', 'education', 'lap', 'gold'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'new_lead',
        'contacted',
        'eligibility_checked',
        'documents_pending',
        'application_submitted',
        'under_verification',
        'approved',
        'rejected',
        'disbursed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE doc_type AS ENUM (
        'salary_slip',
        'bank_statement',
        'pan_card',
        'aadhaar_card',
        'business_doc',
        'itr',
        'other'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM (
        'pending_upload',
        'ai_extracted',
        'verified_by_advisor',
        'rejected'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE followup_status AS ENUM (
        'pending',
        'completed',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE commission_status AS ENUM (
        'pending',
        'approved',
        'paid'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 1. Organizations (Multi-tenant consultancy firms & agencies)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    default_commission_rate NUMERIC(5, 2) DEFAULT 1.50,
    settings JSONB DEFAULT '{"allow_tanglish": true, "default_currency": "INR"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 2. Profiles (Extended user details linked to auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- Matches auth.users.id
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'loan_advisor',
    preferred_language TEXT NOT NULL DEFAULT 'en', -- 'en', 'ta', 'tanglish'
    avatar_url TEXT,
    commission_split_pct NUMERIC(5, 2) DEFAULT 50.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 3. Customers (CRM Leads & Borrowers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT NOT NULL,
    employment_type TEXT NOT NULL, -- 'Salaried', 'Self-Employed', 'Business', 'Professional'
    monthly_income NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    existing_emi NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    preferred_loan_type loan_type NOT NULL DEFAULT 'personal',
    required_loan_amount NUMERIC(15, 2) NOT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'en', -- 'en', 'ta', 'tanglish'
    credit_score INT,
    consent_given BOOLEAN NOT NULL DEFAULT true,
    consent_recorded_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 4. Lenders (Banks & NBFCs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    category TEXT DEFAULT 'Bank', -- 'Bank', 'NBFC', 'Fintech'
    logo_url TEXT,
    website TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 5. Loan Products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS loan_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lender_id UUID NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    loan_type loan_type NOT NULL,
    min_interest_rate NUMERIC(5, 2) NOT NULL,
    max_interest_rate NUMERIC(5, 2) NOT NULL,
    min_tenure_months INT NOT NULL DEFAULT 12,
    max_tenure_months INT NOT NULL DEFAULT 60,
    min_amount NUMERIC(15, 2) NOT NULL DEFAULT 50000,
    max_amount NUMERIC(15, 2) NOT NULL DEFAULT 5000000,
    processing_fee_pct NUMERIC(5, 2) DEFAULT 1.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 6. Lender Policies (Deterministic Rules Engine)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lender_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lender_id UUID NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
    loan_product_id UUID REFERENCES loan_products(id) ON DELETE CASCADE,
    loan_category loan_type NOT NULL,
    min_income NUMERIC(15, 2) NOT NULL,
    min_credit_score INT NOT NULL DEFAULT 650,
    interest_rate_min NUMERIC(5, 2) NOT NULL,
    interest_rate_max NUMERIC(5, 2) NOT NULL,
    max_foir_pct NUMERIC(5, 2) NOT NULL DEFAULT 50.00, -- Maximum Fixed Obligation to Income Ratio
    min_tenure_months INT NOT NULL DEFAULT 12,
    max_tenure_months INT NOT NULL DEFAULT 60,
    max_loan_amount NUMERIC(15, 2) NOT NULL,
    processing_fee TEXT NOT NULL DEFAULT '1% + GST',
    employment_requirements TEXT[] DEFAULT ARRAY['Salaried', 'Self-Employed'],
    policy_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 7. Loan Applications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    lender_id UUID REFERENCES lenders(id) ON DELETE SET NULL,
    loan_product_id UUID REFERENCES loan_products(id) ON DELETE SET NULL,
    loan_type loan_type NOT NULL,
    requested_amount NUMERIC(15, 2) NOT NULL,
    sanctioned_amount NUMERIC(15, 2),
    interest_rate NUMERIC(5, 2),
    tenure_months INT NOT NULL,
    calculated_emi NUMERIC(15, 2),
    status application_status NOT NULL DEFAULT 'new_lead',
    internal_notes TEXT,
    rejection_reason TEXT,
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 8. Documents (AI Document Understanding & Storage)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    doc_type doc_type NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INT NOT NULL,
    verification_status verification_status NOT NULL DEFAULT 'ai_extracted',
    ai_extracted_data JSONB DEFAULT '{}'::jsonb,
    human_verified BOOLEAN NOT NULL DEFAULT false,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    consent_timestamp TIMESTAMPTZ DEFAULT timezone('utc', now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 9. Eligibility Results History
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS eligibility_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    calculated_foir NUMERIC(5, 2) NOT NULL,
    available_emi_capacity NUMERIC(15, 2) NOT NULL,
    estimated_eligible_amount NUMERIC(15, 2) NOT NULL,
    estimated_monthly_emi NUMERIC(15, 2) NOT NULL,
    total_interest NUMERIC(15, 2) NOT NULL,
    total_repayment NUMERIC(15, 2) NOT NULL,
    credit_score INT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 10. Follow-ups
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    advisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    status followup_status NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
    suggested_message_ta TEXT,
    suggested_message_en TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 11. Commissions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    advisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    loan_amount NUMERIC(15, 2) NOT NULL,
    commission_rate_pct NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    commission_amount NUMERIC(15, 2) NOT NULL,
    advisor_share_amount NUMERIC(15, 2) NOT NULL,
    company_share_amount NUMERIC(15, 2) NOT NULL,
    status commission_status NOT NULL DEFAULT 'pending',
    payout_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 12. AI Conversations & Messages (Isolated by Org & Advisor)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    advisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    language TEXT NOT NULL DEFAULT 'en', -- 'en', 'ta', 'tanglish'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    intent TEXT,
    token_count INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- 13. Audit Logs (Security & Compliance)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ----------------------------------------------------------------------------
-- Indexes for High Performance
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_org ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_org_advisor ON customers(organization_id, advisor_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_applications_org_status ON applications(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_customer ON applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_app ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_followups_due_status ON followups(organization_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_commissions_org_advisor ON commissions(organization_id, advisor_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(organization_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- Row Level Security (RLS) Setup
-- ----------------------------------------------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE lender_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION auth_current_user_profile()
RETURNS profiles AS $$
    SELECT * FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Policies: Profiles
CREATE POLICY "Users can read profiles within same org or self"
    ON profiles FOR SELECT
    USING (
        id = auth.uid()
        OR organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );

CREATE POLICY "Admins can update profiles in their org"
    ON profiles FOR UPDATE
    USING (
        id = auth.uid()
        OR (
            organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
            AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'company_admin')
        )
    );

-- Policies: Customers
CREATE POLICY "Staff can view customers in their organization"
    ON customers FOR SELECT
    USING (
        organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );

CREATE POLICY "Staff can insert customers into their organization"
    ON customers FOR INSERT
    WITH CHECK (
        organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );

CREATE POLICY "Staff can update customers in their organization"
    ON customers FOR UPDATE
    USING (
        organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );

-- Policies: Applications
CREATE POLICY "Access applications by organization"
    ON applications FOR ALL
    USING (
        organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );

-- Policies: Followups
CREATE POLICY "Access followups by organization"
    ON followups FOR ALL
    USING (
        organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );

-- Policies: Documents
CREATE POLICY "Access documents via customer's organization"
    ON documents FOR ALL
    USING (
        customer_id IN (
            SELECT id FROM customers WHERE organization_id = (
                SELECT organization_id FROM profiles WHERE id = auth.uid()
            )
        )
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );

-- Policies: Lenders & Policies (Publicly readable by authenticated staff)
CREATE POLICY "Authenticated users can view lenders"
    ON lenders FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view policies"
    ON lender_policies FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view loan products"
    ON loan_products FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policies: Commissions
CREATE POLICY "Advisors see own, Admins see org commissions"
    ON commissions FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'company_admin')
        AND organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
        OR advisor_id = auth.uid()
    );

-- Policies: AI Conversations & Messages
CREATE POLICY "Advisors can manage own AI conversations"
    ON ai_conversations FOR ALL
    USING (
        advisor_id = auth.uid()
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );

CREATE POLICY "Advisors can manage own AI messages"
    ON ai_messages FOR ALL
    USING (
        conversation_id IN (
            SELECT id FROM ai_conversations WHERE advisor_id = auth.uid()
        )
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
    );
