import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../locales/i18n';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatRupee, formatPercent } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Percent,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  AlertCircle,
} from 'lucide-react';

export function LendersPage() {
  const { customers } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [loanCategory, setLoanCategory] = useState('personal');
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const payload = {
        loanCategory: loanCategory || selectedCustomer?.preferred_loan_type || 'personal',
        monthlyIncome: selectedCustomer?.monthly_income || 50000,
        creditScore: selectedCustomer?.credit_score || 720,
        loanAmount: selectedCustomer?.required_loan_amount || 500000,
        employmentType: selectedCustomer?.employment_type || 'Salaried',
        tenureMonths: 48,
      };

      const res = await fetch('/api/lenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setMatchData(data);
      }
    } catch (err) {
      console.error('Fetch lender matches error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [selectedCustomerId, loanCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-electric-500" />
          <span>{t('lenders.title')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('lenders.subtitle')}
        </p>
      </div>

      {/* Target Selector Bar */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Evaluate Against Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                const cust = customers.find((c) => c.id === e.target.value);
                if (cust) setLoanCategory(cust.preferred_loan_type);
              }}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.city} • CIBIL: {c.credit_score} • {formatRupee(c.monthly_income)}/mo)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Loan Category Policy
            </label>
            <select
              value={loanCategory}
              onChange={(e) => setLoanCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="personal">Personal Loan Policies</option>
              <option value="home">Home Loan Policies</option>
              <option value="business">Business Loan Policies</option>
              <option value="vehicle">Vehicle Loan Policies</option>
              <option value="lap">Loan Against Property (LAP)</option>
              <option value="gold">Gold Loan Policies</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              className="w-full"
              loading={loading}
              onClick={fetchMatches}
            >
              Evaluate Deterministic Rules
            </Button>
          </div>
        </div>
      </Card>

      {/* Match Results Matrix */}
      {matchData && (
        <div className="space-y-6">
          {/* Direct Matches Section */}
          <div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Full Policy Matches ({matchData.matches?.length || 0})</span>
            </h3>

            {matchData.matches?.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-900 text-center text-xs text-slate-400 border border-slate-200 dark:border-slate-800">
                No lender passed 100% of criteria for this profile. Review partial matches below.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {matchData.matches.map((lender) => (
                  <Card key={lender.lenderId} className="p-5 border-emerald-500/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-sm text-navy-900 dark:text-white border border-slate-200 dark:border-slate-700">
                          {lender.lenderCode}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-navy-900 dark:text-white">
                            {lender.lenderName}
                          </h4>
                          <span className="text-xs text-slate-400 capitalize">
                            {lender.category} • {lender.loanCategory} Loan
                          </span>
                        </div>
                      </div>
                      <Badge variant="success" size="md">
                        {lender.matchScore}% Match
                      </Badge>
                    </div>

                    {/* Rates & EMI Summary */}
                    <div className="grid grid-cols-2 gap-3 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-navy-900/60 text-xs">
                      <div>
                        <span className="text-slate-400 block">Interest Rate Range</span>
                        <span className="font-bold text-navy-900 dark:text-white">
                          {lender.interestRateMin}% - {lender.interestRateMax}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Estimated Monthly EMI</span>
                        <span className="font-bold text-electric-600 dark:text-cyanAccent-400 font-sans">
                          {formatRupee(lender.estimatedEmiMin)} - {formatRupee(lender.estimatedEmiMax)}
                        </span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/40 dark:border-slate-800">
                        <span className="text-slate-400">Processing Fee: </span>
                        <span className="font-medium text-navy-900 dark:text-slate-200">
                          {lender.processingFee}
                        </span>
                      </div>
                    </div>

                    {/* Passed Criteria */}
                    <div className="mt-3.5 space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        Passed Criteria:
                      </span>
                      {lender.criteriaPassed.map((cp, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{cp}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => navigate('/ai-copilot')}
                        className="text-xs font-bold text-electric-600 dark:text-cyanAccent-400 hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Explain with Gemini</span>
                      </button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('/applications')}
                      >
                        Create Application
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Partial Matches Section */}
          {matchData.partialMatches?.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>Partial Matches / Gaps Detected ({matchData.partialMatches.length})</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {matchData.partialMatches.map((lender) => (
                  <Card key={lender.lenderId} className="p-5 border-amber-500/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-sm text-navy-900 dark:text-white border border-slate-200 dark:border-slate-700">
                          {lender.lenderCode}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-navy-900 dark:text-white">
                            {lender.lenderName}
                          </h4>
                          <span className="text-xs text-slate-400 capitalize">
                            {lender.category} • {lender.loanCategory} Loan
                          </span>
                        </div>
                      </div>
                      <Badge variant="warning" size="md">
                        {lender.matchScore}% Match
                      </Badge>
                    </div>

                    {/* Criteria Failed Gap */}
                    <div className="mt-3.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs space-y-1">
                      <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                        Eligibility Gaps:
                      </span>
                      {lender.criteriaFailed.map((cf, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-rose-700 dark:text-rose-300">
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{cf}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
