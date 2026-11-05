# LoanMitra AI

> **Smart Loans. Faster Approvals.**  
> An AI-powered, bilingual (Tamil, English, Tanglish) loan advisory platform and CRM built for individual financial advisors, branch managers, and loan consultancy firms.

---

## 🌟 Overview

**LoanMitra AI** combines a modern fintech CRM with Google Gemini AI intelligence and deterministic banking underwriting rules. The platform empowers loan advisors across Tamil Nadu and Indian metros to manage borrower pipelines, calculate strict FOIR limits, match applicants against verified lender policies (HDFC, SBI, ICICI, Axis, Bajaj, Tata Capital), and converse naturally in **Tamil (தமிழ்)**, **Tanglish**, and **English**.

---

## 🚀 Key Features

### 1. Bilingual AI Copilot (Gemini Flash)
- **Natural Language Advisory:** Converses natively in Tamil, English, and Tanglish.
- **Banking Policy Grounding:** Grounded in verified bank and NBFC eligibility matrices—never hallucinates interest rates or guarantees loan approvals.
- **Automated Communication:** Generates ready-to-send WhatsApp / SMS reminder messages in Tamil and English with custom document checklists.
- **Secure Serverless Proxy:** All Gemini API interactions are secured through `/api/assistant.js` serverless functions—API keys are never exposed in client code.

### 2. Multimodal AI Document Intelligence
- **Vision Document Classifier:** Extracts and categorizes salary slips, 6-month bank statements, PAN, Aadhaar, ITR, and business GST certificates via Gemini Flash Vision (`/api/documents/analyze.js`).
- **Human-in-the-Loop Audit:** Enforces advisor review before using extracted financial figures for credit scoring.
- **Missing Document Detection:** Automatically computes document checklists based on loan category.
- **Privacy First:** Data masking for PAN and Aadhaar; explicit borrower consent checks.

### 3. Customer CRM & Pipeline Management
- **Full Customer Lifecycle:** Add, edit, search, filter, and view customer borrowing profiles, income parameters, and credit scores.
- **9-Stage Loan Workflow:** Track applications through:
  `New Lead` ➔ `Contacted` ➔ `Eligibility Checked` ➔ `Documents Pending` ➔ `Application Submitted` ➔ `Under Verification` ➔ `Approved` ➔ `Rejected` ➔ `Disbursed`.
- **Visual Lifecycle Timeline:** Real-time progress bar with audit logging.

### 4. Loan Eligibility & Interactive EMI Engine
- **Deterministic FOIR Engine:** Calculates Fixed Obligation to Income Ratio (FOIR), available monthly EMI capacity, and reverse EMI maximum borrowing limits.
- **Interactive EMI Amortization:** Dynamic sliders, monthly repayment breakdown, and Recharts graphical split between Principal and Total Interest.
- **Rupee Currency Standards:** Full support for Indian numbering and Rupee formatting (`₹1,50,000`, `₹1.25 Cr`).

### 5. Smart Bank Matching Matrix
- **Lender Guidelines:** Stores verified underwriting matrices for HDFC Bank, State Bank of India (SBI), ICICI Bank, Axis Bank, Bajaj Finserv, Tata Capital, and Muthoot Finance.
- **Gap & Eligibility Analysis:** Real-time breakdown of criteria passed, criteria failed, missing info, processing fees, and estimated EMI ranges.

### 6. Follow-up Reminders & Commission Tracking
- **Follow-up CRM:** Filter tasks by *Today*, *Upcoming*, *Overdue*, and *Completed*.
- **Commission Split Ledger:** Transparent, auditable commission tracking between advisor and agency with configurable split percentages.

### 7. Multi-Role Authorization & Security
- **3 User Roles:** `Super Admin`, `Company Admin`, and `Loan Advisor`.
- **Instant Role Toggle:** Built-in sandbox role switcher for friction-free evaluation.
- **Row Level Security:** Complete PostgreSQL RLS migrations ensuring multi-tenant organization isolation.

### 8. Progressive Web App (PWA)
- Installable on desktop and mobile home screens.
- Touch-optimized responsive interface with dark mode and light mode.
- Offline static app shell caching (sensitive borrower documents are strictly excluded from public service-worker caches).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide React, React Router 6, Recharts |
| **Typography** | Plus Jakarta Sans, Noto Sans Tamil (Google Fonts) |
| **Backend** | Vercel Serverless Functions (Node.js runtime in `/api`) |
| **Database** | Supabase PostgreSQL, Supabase Auth, Storage & Row Level Security (RLS) |
| **AI** | Google Gemini API (Gemini 1.5 Flash multimodal vision & chat) |
| **Deployment** | Vercel (`vercel.json` SPA and serverless rewrites) |
| **PWA** | Web App Manifest, Service Worker (`sw.js`) |

---

## 📂 Project Structure

```
LoanMithra/
├── api/
│   ├── assistant.js             # Bilingual Gemini AI Copilot serverless function
│   ├── documents/
│   │   └── analyze.js           # Gemini Vision Multimodal document OCR & extraction
│   ├── eligibility.js           # FOIR & debt capacity financial calculation engine
│   └── lenders.js               # Deterministic lender matching engine
├── public/
│   ├── icons/                   # PWA app icons (192x192, 512x512, SVG)
│   ├── manifest.json            # Web App Manifest
│   └── sw.js                    # Service Worker with security-guarded caching
├── src/
│   ├── components/
│   │   ├── common/              # Button, Card, Badge, Modal, StatCard
│   │   ├── layout/              # Navbar, Sidebar, LanguageSwitcher, ThemeToggle, AppLayout
│   │   ├── dashboard/           # MetricsOverview, StatusChart, DisbursementChart, Followups
│   │   ├── calculator/          # EligibilityCalculator, EmiCalculator
│   │   ├── customers/           # CustomerModal, CustomerDetailModal
│   │   └── applications/        # ApplicationModal, ApplicationStatusModal, ApplicationTimeline
│   ├── contexts/
│   │   ├── AuthContext.jsx      # Role-based access, Supabase session & demo roles
│   │   ├── DataContext.jsx      # Customer, application, follow-up & commission state
│   │   └── ThemeContext.jsx     # Dark mode / Light mode manager
│   ├── locales/
│   │   ├── en.json              # English translations
│   │   ├── ta.json              # Tamil (தமிழ்) translations
│   │   ├── tanglish.json        # Tanglish translations
│   │   └── i18n.jsx             # Runtime LanguageContext & t() helper
│   ├── pages/                   # Dashboard, Customers, Applications, Eligibility, Lenders,
│   │                            # Followups, Commissions, AiCopilot, Documents, Admin, Profile, Login
│   ├── services/
│   │   └── supabase.js          # Supabase client initializer
│   ├── utils/
│   │   └── formatters.js        # Rupee currency (₹), date, percentage & status formatters
│   ├── App.jsx                  # React Router configuration & Protected Routes
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Tailwind directives & glassmorphism utilities
├── supabase/
│   ├── migrations/
│   │   └── 20250101000000_init_schema.sql  # Complete schema, enums, RLS policies & indexes
│   └── seed.sql                 # Starter bank policies, demo org, profiles & applications
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json                  # Vercel deployment configuration
```

---

## ⚡ Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/loanmitra-ai.git
cd loanmitra-ai
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your credentials:
```env
# Google Gemini AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key

# Supabase Project (https://supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vite Frontend Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(Note: LoanMitra AI includes an interactive demo sandbox mode that runs seamlessly out of the box even before remote database keys are linked).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Setup (Supabase)

1. Open your **Supabase Dashboard** ➔ **SQL Editor**.
2. Run the script in `supabase/migrations/20250101000000_init_schema.sql` to generate all tables, enums, indexes, and Row Level Security policies.
3. Run `supabase/seed.sql` to populate realistic Indian lender policies, demo organizations, profiles, and initial applications.

---

## 🚢 Vercel Deployment

Deploy frontend and serverless API endpoints together on Vercel:

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) ➔ **Add New Project** ➔ Import repository.
3. Set the Environment Variables (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Click **Deploy**. Vercel will automatically compile the Vite client and deploy the `/api` serverless functions.

---

## 🔒 Security & Regulatory Guardrails

- **Zero Client Key Exposure:** Gemini API keys and Supabase service role keys reside strictly in `/api/*` serverless backend functions.
- **No Autonomous Lending Decisions:** The platform enforces strict human-in-the-loop validation for all AI-extracted financial documents.
- **Row Level Security (RLS):** Every query is authenticated and restricted by organization and advisor scope.
- **Privacy Compliance:** Aadhaar and PAN numbers are masked before display; customer consent is recorded before document processing.

---

## 📄 License
MIT License. Built for financial advisors with precision and security.
