// Vercel Serverless Function: /api/lenders
// Smart Bank Matching Engine - Deterministic Policy Evaluation

const LENDER_POLICIES_CACHE = [
  {
    lenderId: 'c0000000-0000-0000-0000-000000000001',
    lenderName: 'HDFC Bank',
    lenderCode: 'HDFC',
    category: 'Bank',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=128&q=80',
    loanCategory: 'personal',
    minIncome: 35000,
    minCreditScore: 720,
    interestRateMin: 10.50,
    interestRateMax: 14.50,
    maxFoirPct: 50.00,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    maxLoanAmount: 4000000,
    processingFee: '0.99% to 2.50% (Min ₹1,999)',
    employmentRequirements: ['Salaried'],
    description: 'Requires min 2 years total work experience and 6 months salary credit in corporate bank account.'
  },
  {
    lenderId: 'c0000000-0000-0000-0000-000000000002',
    lenderName: 'State Bank of India',
    lenderCode: 'SBI',
    category: 'Bank',
    logo: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=128&q=80',
    loanCategory: 'home',
    minIncome: 25000,
    minCreditScore: 700,
    interestRateMin: 8.40,
    interestRateMax: 9.65,
    maxFoirPct: 55.00,
    minTenureMonths: 60,
    maxTenureMonths: 360,
    maxLoanAmount: 100000000,
    processingFee: '0.35% (Max ₹10,000 + GST)',
    employmentRequirements: ['Salaried', 'Self-Employed', 'Business', 'Professional'],
    description: 'Lowest floating rates pegged to EBLR. Concession of 0.05% for women borrowers.'
  },
  {
    lenderId: 'c0000000-0000-0000-0000-000000000003',
    lenderName: 'ICICI Bank',
    lenderCode: 'ICICI',
    category: 'Bank',
    logo: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=128&q=80',
    loanCategory: 'business',
    minIncome: 50000,
    minCreditScore: 680,
    interestRateMin: 13.00,
    interestRateMax: 17.50,
    maxFoirPct: 45.00,
    minTenureMonths: 12,
    maxTenureMonths: 48,
    maxLoanAmount: 5000000,
    processingFee: '1.50% to 2.00%',
    employmentRequirements: ['Business', 'Self-Employed'],
    description: 'Min business vintage of 3 years with audited ITR and GST returns for past 12 months.'
  },
  {
    lenderId: 'c0000000-0000-0000-0000-000000000004',
    lenderName: 'Axis Bank',
    lenderCode: 'AXIS',
    category: 'Bank',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&q=80',
    loanCategory: 'vehicle',
    minIncome: 25000,
    minCreditScore: 680,
    interestRateMin: 8.85,
    interestRateMax: 11.25,
    maxFoirPct: 50.00,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    maxLoanAmount: 5000000,
    processingFee: '₹3,500 to ₹5,500 flat',
    employmentRequirements: ['Salaried', 'Self-Employed'],
    description: 'Up to 100% on-road financing for select prime passenger vehicles.'
  },
  {
    lenderId: 'c0000000-0000-0000-0000-000000000005',
    lenderName: 'Bajaj Finserv',
    lenderCode: 'BAJAJ',
    category: 'NBFC',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=128&q=80',
    loanCategory: 'personal',
    minIncome: 25000,
    minCreditScore: 650,
    interestRateMin: 11.50,
    interestRateMax: 18.00,
    maxFoirPct: 55.00,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    maxLoanAmount: 3500000,
    processingFee: '2.00% to 3.50%',
    employmentRequirements: ['Salaried', 'Self-Employed'],
    description: 'Flexible hybrid flexi loan variant available. Instant digital in-principle sanction.'
  },
  {
    lenderId: 'c0000000-0000-0000-0000-000000000006',
    lenderName: 'Tata Capital',
    lenderCode: 'TATA',
    category: 'NBFC',
    logo: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=128&q=80',
    loanCategory: 'lap',
    minIncome: 40000,
    minCreditScore: 675,
    interestRateMin: 9.25,
    interestRateMax: 12.50,
    maxFoirPct: 60.00,
    minTenureMonths: 36,
    maxTenureMonths: 180,
    maxLoanAmount: 50000000,
    processingFee: '1.00% + GST',
    employmentRequirements: ['Salaried', 'Self-Employed', 'Business'],
    description: 'Up to 65% market value of residential or commercial property with clear legal title.'
  },
  {
    lenderId: 'c0000000-0000-0000-0000-000000000007',
    lenderName: 'Muthoot Finance',
    lenderCode: 'MUTHOOT',
    category: 'NBFC',
    logo: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=128&q=80',
    loanCategory: 'gold',
    minIncome: 10000,
    minCreditScore: 500,
    interestRateMin: 9.90,
    interestRateMax: 16.00,
    maxFoirPct: 75.00,
    minTenureMonths: 3,
    maxTenureMonths: 36,
    maxLoanAmount: 10000000,
    processingFee: '₹50 to 0.5%',
    employmentRequirements: ['Salaried', 'Self-Employed', 'Business', 'Professional'],
    description: 'Up to 75% LTV against 18-24 Karat gold ornaments. Minimal paperwork, same-day cash.'
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const params = req.method === 'POST' ? req.body : req.query;
    const {
      loanCategory = 'personal',
      monthlyIncome = 0,
      creditScore = 700,
      loanAmount = 500000,
      tenureMonths = 48,
      employmentType = 'Salaried'
    } = params;

    const income = Number(monthlyIncome);
    const score = Number(creditScore);
    const amount = Number(loanAmount);
    const tenure = Number(tenureMonths);

    // Filter policies matching the loan category
    const relevantPolicies = LENDER_POLICIES_CACHE.filter(
      (p) => !loanCategory || p.loanCategory === loanCategory
    );

    const matches = [];
    const partialMatches = [];
    const nonMatches = [];

    for (const policy of relevantPolicies) {
      const criteriaPassed = [];
      const criteriaFailed = [];
      const missingInfo = [];

      // Check Income
      if (income >= policy.minIncome) {
        criteriaPassed.push(`Income ₹${income.toLocaleString('en-IN')} meets min requirement of ₹${policy.minIncome.toLocaleString('en-IN')}`);
      } else {
        criteriaFailed.push(`Monthly income (₹${income.toLocaleString('en-IN')}) is below required ₹${policy.minIncome.toLocaleString('en-IN')}`);
      }

      // Check Credit Score
      if (score >= policy.minCreditScore) {
        criteriaPassed.push(`CIBIL score ${score} meets minimum threshold of ${policy.minCreditScore}`);
      } else {
        criteriaFailed.push(`CIBIL score (${score}) is below lender cutoff of ${policy.minCreditScore}`);
      }

      // Check Employment Type
      if (policy.employmentRequirements.includes(employmentType)) {
        criteriaPassed.push(`Employment type '${employmentType}' is accepted`);
      } else {
        criteriaFailed.push(`Employment type '${employmentType}' not supported. Requires: ${policy.employmentRequirements.join(', ')}`);
      }

      // Check Loan Amount
      if (amount <= policy.maxLoanAmount) {
        criteriaPassed.push(`Requested ₹${amount.toLocaleString('en-IN')} within max limit of ₹${policy.maxLoanAmount.toLocaleString('en-IN')}`);
      } else {
        criteriaFailed.push(`Requested ₹${amount.toLocaleString('en-IN')} exceeds lender ceiling of ₹${policy.maxLoanAmount.toLocaleString('en-IN')}`);
      }

      // Calculate estimated EMI range
      const rMin = (policy.interestRateMin / 100) / 12;
      const rMax = (policy.interestRateMax / 100) / 12;
      const fMin = Math.pow(1 + rMin, tenure);
      const fMax = Math.pow(1 + rMax, tenure);
      const estimatedEmiMin = Math.round((amount * rMin * fMin) / (fMin - 1));
      const estimatedEmiMax = Math.round((amount * rMax * fMax) / (fMax - 1));

      const evaluation = {
        ...policy,
        estimatedEmiMin,
        estimatedEmiMax,
        criteriaPassed,
        criteriaFailed,
        missingInfo,
        matchScore: Math.round((criteriaPassed.length / (criteriaPassed.length + criteriaFailed.length)) * 100)
      };

      if (criteriaFailed.length === 0) {
        matches.push(evaluation);
      } else if (criteriaFailed.length === 1) {
        partialMatches.push(evaluation);
      } else {
        nonMatches.push(evaluation);
      }
    }

    return res.status(200).json({
      success: true,
      query: { loanCategory, monthlyIncome: income, creditScore: score, loanAmount: amount, employmentType, tenureMonths: tenure },
      totalEvaluated: relevantPolicies.length,
      matches,
      partialMatches,
      nonMatches,
      notice: 'Preliminary bank matching based on published guidelines. Sanctions are subject to credit bureau and field verification.'
    });
  } catch (error) {
    console.error('Lender Matching Error:', error);
    return res.status(500).json({ error: 'Failed to evaluate lender matching.', details: error.message });
  }
}
