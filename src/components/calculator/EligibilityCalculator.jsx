import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { formatRupee, formatPercent } from '../../utils/formatters';
import { useLanguage } from '../../locales/i18n';
import {
  Calculator,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function EligibilityCalculator() {
  const { t } = useLanguage();

  const [inputs, setInputs] = useState({
    monthlyIncome: 75000,
    existingEmi: 12000,
    employmentType: 'Salaried',
    creditScore: 740,
    requiredLoanAmount: 1500000,
    interestRate: 10.5,
    tenureMonths: 60,
    loanType: 'personal',
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateEligibility = async () => {
    setLoading(true);
    try {
      // Call backend API /api/eligibility
      const res = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
      } else {
        // Fallback calculation directly in frontend
        calculateLocal();
      }
    } catch (e) {
      calculateLocal();
    } finally {
      setLoading(false);
    }
  };

  const calculateLocal = () => {
    const income = Number(inputs.monthlyIncome);
    const existing = Number(inputs.existingEmi);
    const rate = Number(inputs.interestRate);
    const tenure = Number(inputs.tenureMonths);
    const score = Number(inputs.creditScore);

    let maxFoir = inputs.loanType === 'home' ? 55 : 50;
    if (score < 650) maxFoir -= 10;
    if (score >= 750) maxFoir += 5;

    const totalAllowedEmi = income * (maxFoir / 100);
    const availableEmiCapacity = Math.max(0, totalAllowedEmi - existing);
    const currentFoir = Number(((existing / income) * 100).toFixed(1));

    const r = rate / (12 * 100);
    const factor = Math.pow(1 + r, tenure);
    const requestedMonthlyEmi = Math.round((inputs.requiredLoanAmount * r * factor) / (factor - 1));
    const projectedFoir = Number((((existing + requestedMonthlyEmi) / income) * 100).toFixed(1));

    let estimatedEligibleLoanAmount = 0;
    if (availableEmiCapacity > 0) {
      estimatedEligibleLoanAmount = Math.round((availableEmiCapacity * (factor - 1)) / (r * factor));
    }

    const eligibleEmi = Math.min(requestedMonthlyEmi, availableEmiCapacity);
    const totalRepayment = eligibleEmi * tenure;
    const totalInterest = Math.max(0, totalRepayment - estimatedEligibleLoanAmount);

    setResults({
      maxAllowedFoirPct: maxFoir,
      currentFoir,
      projectedFoir,
      availableEmiCapacity,
      requestedMonthlyEmi,
      estimatedEligibleLoanAmount,
      totalInterest,
      totalRepayment,
      eligibilityGrade: projectedFoir <= maxFoir ? 'High' : 'Moderate',
      advisoryNotes: [
        projectFoirAdvisory(projectedFoir, maxFoir),
        score >= 720
          ? 'Strong CIBIL credit profile. Eligible for prime lender rates (HDFC, SBI, ICICI).'
          : 'Moderate CIBIL. NBFCs (Bajaj Finserv, Tata Capital) recommended.',
      ],
    });
  };

  const projectFoirAdvisory = (projected, max) => {
    if (projected <= max) {
      return `Total debt obligations will be ${projected}%, safely within the ${max}% FOIR ceiling.`;
    }
    return `Projected debt ratio of ${projected}% exceeds the ${max}% benchmark. Consider lengthening tenure to reduce monthly EMI.`;
  };

  // Run on first load
  React.useEffect(() => {
    calculateEligibility();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Form Column */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-electric-500" />
            <span>Borrower Financial Inputs</span>
          </h3>

          <div className="space-y-4">
            {/* Loan Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Loan Category
              </label>
              <select
                value={inputs.loanType}
                onChange={(e) => setInputs({ ...inputs, loanType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
              >
                <option value="personal">Personal Loan</option>
                <option value="home">Home Loan</option>
                <option value="business">Business Loan</option>
                <option value="vehicle">Vehicle Loan</option>
                <option value="lap">Loan Against Property</option>
                <option value="gold">Gold Loan</option>
              </select>
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Net Income (₹)
              </label>
              <input
                type="number"
                step="5000"
                value={inputs.monthlyIncome}
                onChange={(e) => setInputs({ ...inputs, monthlyIncome: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Existing EMI */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Existing Monthly EMIs (₹)
              </label>
              <input
                type="number"
                step="1000"
                value={inputs.existingEmi}
                onChange={(e) => setInputs({ ...inputs, existingEmi: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Requested Loan Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Desired Loan Amount (₹)
              </label>
              <input
                type="number"
                step="50000"
                value={inputs.requiredLoanAmount}
                onChange={(e) => setInputs({ ...inputs, requiredLoanAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-electric-500 focus:outline-none"
              />
            </div>

            {/* Tenure & Rate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  value={inputs.tenureMonths}
                  onChange={(e) => setInputs({ ...inputs, tenureMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={inputs.interestRate}
                  onChange={(e) => setInputs({ ...inputs, interestRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Credit Score Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  CIBIL Score
                </label>
                <span className="text-xs font-extrabold text-navy-900 dark:text-white">
                  {inputs.creditScore}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="850"
                value={inputs.creditScore}
                onChange={(e) => setInputs({ ...inputs, creditScore: Number(e.target.value) })}
                className="w-full accent-electric-600"
              />
            </div>

            <Button
              variant="primary"
              className="w-full mt-2"
              loading={loading}
              onClick={calculateEligibility}
            >
              Recalculate FOIR & Capacity
            </Button>
          </div>
        </Card>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-7 space-y-4">
        {results ? (
          <>
            {/* Primary Capacity Card */}
            <Card className="p-6 bg-gradient-to-br from-navy-900 to-navy-800 text-white border-0 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyanAccent-500/10 rounded-full blur-3xl -z-0" />
              <div className="relative z-10">
                <span className="text-xs font-bold tracking-wider uppercase text-cyanAccent-400">
                  Estimated Eligible Loan Amount
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-sans">
                  {formatRupee(results.estimatedEligibleLoanAmount)}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Based on available monthly EMI headroom of{' '}
                  <strong className="text-white">{formatRupee(results.availableEmiCapacity)}</strong>
                </p>

                <div className="mt-6 pt-5 border-t border-navy-700/80 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Current FOIR</span>
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      {results.currentFoir}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Projected FOIR</span>
                    <span
                      className={`text-sm sm:text-base font-extrabold ${
                        results.projectedFoir <= results.maxAllowedFoirPct
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {results.projectedFoir}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Permissible Cap</span>
                    <span className="text-sm sm:text-base font-extrabold text-cyanAccent-400">
                      {results.maxAllowedFoirPct}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Repayment Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Monthly EMI for Desired Amount
                </span>
                <p className="text-xl font-extrabold text-navy-900 dark:text-white mt-1 font-sans">
                  {formatRupee(results.requestedMonthlyEmi)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  For {formatRupee(inputs.requiredLoanAmount)} @ {inputs.interestRate}%
                </p>
              </Card>

              <Card className="p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Total Repayment (P + I)
                </span>
                <p className="text-xl font-extrabold text-navy-900 dark:text-white mt-1 font-sans">
                  {formatRupee(results.totalRepayment)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Total Interest: {formatRupee(results.totalInterest)}
                </p>
              </Card>
            </div>

            {/* Advisory Remarks */}
            <Card className="p-5">
              <h4 className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyanAccent-500" />
                <span>Underwriting Assessment Notes</span>
              </h4>
              <div className="space-y-2">
                {results.advisoryNotes?.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-navy-900 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Mandatory Regulatory Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mandatory Regulatory Notice:</strong> The calculations above represent preliminary mathematical FOIR estimates only and do NOT constitute an offer or guarantee of loan sanction. Final approval, exact rate of interest, and credit sanction are at the sole discretion of the respective lending institution.
              </span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
