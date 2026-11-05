// Vercel Serverless Function: /api/eligibility
// Core Financial Eligibility Calculator Engine

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const {
      monthlyIncome = 0,
      existingEmi = 0,
      employmentType = 'Salaried',
      creditScore = 700,
      requiredLoanAmount = 500000,
      interestRate = 11.5,
      tenureMonths = 48,
      loanType = 'personal'
    } = req.body;

    const income = Number(monthlyIncome);
    const existingObligations = Number(existingEmi);
    const rate = Number(interestRate);
    const tenure = Number(tenureMonths);
    const requested = Number(requiredLoanAmount);
    const score = Number(creditScore);

    if (income <= 0) {
      return res.status(400).json({ error: 'Monthly income must be greater than zero.' });
    }

    // 1. Determine Benchmark FOIR (Fixed Obligation to Income Ratio) limit
    // Tiered based on income & loan type
    let maxAllowedFoirPct = 50; // standard 50%
    if (loanType === 'home' || loanType === 'lap') {
      maxAllowedFoirPct = income > 100000 ? 60 : 55;
    } else if (income > 80000) {
      maxAllowedFoirPct = 55;
    } else if (income < 30000) {
      maxAllowedFoirPct = 40;
    }

    // 2. Credit score penalty or bonus
    if (score < 650) {
      maxAllowedFoirPct -= 10;
    } else if (score >= 750) {
      maxAllowedFoirPct += 5;
    }

    // Total permissible monthly debt obligation
    const totalPermissibleEmi = (income * (maxAllowedFoirPct / 100));
    const availableEmiCapacity = Math.max(0, totalPermissibleEmi - existingObligations);

    // Current FOIR with existing obligations
    const currentFoir = Number(((existingObligations / income) * 100).toFixed(2));

    // 3. Requested Loan EMI calculation
    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const monthlyRate = rate / (12 * 100);
    let requestedMonthlyEmi = 0;
    if (monthlyRate > 0 && tenure > 0) {
      const factor = Math.pow(1 + monthlyRate, tenure);
      requestedMonthlyEmi = Math.round((requested * monthlyRate * factor) / (factor - 1));
    }

    // Projected FOIR if requested loan is taken
    const projectedFoir = Number((((existingObligations + requestedMonthlyEmi) / income) * 100).toFixed(2));

    // 4. Maximum eligible loan amount based on available EMI capacity
    // Reverse EMI: P = [EMI * ((1+R)^N - 1)] / [R * (1+R)^N]
    let estimatedEligibleLoanAmount = 0;
    if (availableEmiCapacity > 0 && monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, tenure);
      estimatedEligibleLoanAmount = Math.round((availableEmiCapacity * (factor - 1)) / (monthlyRate * factor));
    }

    // Cap to reasonable product ceilings
    const ceilings = { personal: 4000000, home: 100000000, business: 10000000, vehicle: 5000000, lap: 50000000, gold: 10000000, education: 5000000 };
    const maxCeiling = ceilings[loanType] || 5000000;
    estimatedEligibleLoanAmount = Math.min(estimatedEligibleLoanAmount, maxCeiling);

    const eligibleEmi = Math.min(requestedMonthlyEmi, availableEmiCapacity);
    const totalRepayment = eligibleEmi * tenure;
    const totalInterest = Math.max(0, totalRepayment - requested);

    // Approval status indicator
    let eligibilityGrade = 'High';
    let advisoryNotes = [];

    if (score < 650) {
      eligibilityGrade = 'Low';
      advisoryNotes.push('CIBIL score below 650. Lenders may require co-borrower or higher interest rate.');
    } else if (projectedFoir > maxAllowedFoirPct) {
      eligibilityGrade = 'Moderate';
      advisoryNotes.push(`Projected FOIR (${projectedFoir}%) exceeds benchmark (${maxAllowedFoirPct}%). Consider longer tenure to reduce monthly EMI.`);
    } else {
      advisoryNotes.push('Excellent debt-to-income profile with high likelihood of lender sanction.');
    }

    return res.status(200).json({
      success: true,
      inputs: {
        monthlyIncome: income,
        existingEmi: existingObligations,
        employmentType,
        creditScore: score,
        requiredLoanAmount: requested,
        interestRate: rate,
        tenureMonths: tenure,
        loanType
      },
      results: {
        maxAllowedFoirPct,
        currentFoir,
        projectedFoir,
        availableEmiCapacity,
        requestedMonthlyEmi,
        estimatedEligibleLoanAmount,
        totalInterest,
        totalRepayment,
        eligibilityGrade,
        advisoryNotes,
      },
      legalDisclaimer: 'Preliminary AI financial calculation only. Not an actual loan guarantee or lender commitment. Actual interest rates, loan amount, and sanction are at the sole discretion of the respective lending institution based on document appraisal.'
    });
  } catch (error) {
    console.error('Eligibility Calculation Error:', error);
    return res.status(500).json({ error: 'Internal server error calculating eligibility.', details: error.message });
  }
}
