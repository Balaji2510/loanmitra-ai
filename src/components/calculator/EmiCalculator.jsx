import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { formatRupee } from '../../utils/formatters';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { IndianRupee, PieChart as PieIcon, RefreshCw } from 'lucide-react';

export function EmiCalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(15);

  const tenureMonths = tenureYears * 12;
  const monthlyRate = rate / (12 * 100);

  // EMI formula
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const monthlyEmi = Math.round((amount * monthlyRate * factor) / (factor - 1));
  const totalPayment = monthlyEmi * tenureMonths;
  const totalInterest = totalPayment - amount;

  const chartData = [
    { name: 'Principal Loan Amount', value: amount, color: '#2563EB' },
    { name: 'Total Interest Payable', value: Math.max(0, totalInterest), color: '#06B6D4' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Controls Column */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-bold text-navy-900 dark:text-white mb-5 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-electric-500" />
            <span>Interactive Loan Parameters</span>
          </h3>

          <div className="space-y-6">
            {/* Loan Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Loan Amount
                </label>
                <span className="text-sm font-extrabold text-electric-600 dark:text-cyanAccent-400 font-sans">
                  {formatRupee(amount)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="20000000"
                step="50000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-electric-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹50K</span>
                <span>₹1 Cr</span>
                <span>₹2 Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Interest Rate (% p.a.)
                </label>
                <span className="text-sm font-extrabold text-electric-600 dark:text-cyanAccent-400 font-sans">
                  {rate}%
                </span>
              </div>
              <input
                type="range"
                min="7.0"
                max="24.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-electric-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>7% (Home)</span>
                <span>12% (Personal)</span>
                <span>24% (Unsecured)</span>
              </div>
            </div>

            {/* Tenure Years */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Loan Tenure
                </label>
                <span className="text-sm font-extrabold text-electric-600 dark:text-cyanAccent-400 font-sans">
                  {tenureYears} Years ({tenureMonths} Months)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-electric-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Results & Visual Breakdown */}
      <div className="lg:col-span-7 space-y-4">
        {/* EMI Primary Display */}
        <Card className="p-6 bg-gradient-to-tr from-navy-900 to-electric-900 text-white shadow-xl">
          <span className="text-xs font-bold text-cyanAccent-400 uppercase tracking-wider">
            Monthly Loan Repayment (EMI)
          </span>
          <p className="text-4xl sm:text-5xl font-extrabold text-white mt-1 font-sans">
            {formatRupee(monthlyEmi)}
            <span className="text-sm font-normal text-slate-300 ml-2">/ month</span>
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-navy-700/80">
            <div>
              <span className="text-xs text-slate-400 block">Total Principal</span>
              <span className="text-lg font-bold text-white font-sans">{formatRupee(amount)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Total Interest Payable</span>
              <span className="text-lg font-bold text-cyanAccent-400 font-sans">
                {formatRupee(totalInterest)}
              </span>
            </div>
          </div>
        </Card>

        {/* Visual Ratio Breakdown */}
        <Card className="p-5">
          <h4 className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PieIcon className="w-4 h-4 text-electric-500" />
            <span>Breakup of Total Payment (Principal vs Interest)</span>
          </h4>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => formatRupee(val)}
                    contentStyle={{
                      backgroundColor: '#101B35',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded bg-electric-600" />
                <div>
                  <span className="text-xs text-slate-500 block">Principal Amount</span>
                  <span className="text-sm font-bold text-navy-900 dark:text-white font-sans">
                    {formatRupee(amount)} (
                    {((amount / totalPayment) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded bg-cyanAccent-500" />
                <div>
                  <span className="text-xs text-slate-500 block">Total Interest</span>
                  <span className="text-sm font-bold text-navy-900 dark:text-white font-sans">
                    {formatRupee(totalInterest)} (
                    {((totalInterest / totalPayment) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Total Payable Over Loan Term</span>
                <span className="text-base font-extrabold text-navy-900 dark:text-white font-sans">
                  {formatRupee(totalPayment)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
