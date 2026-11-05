import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../locales/i18n';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatRupee, formatDate } from '../utils/formatters';
import { CustomerModal } from '../components/customers/CustomerModal';
import { CustomerDetailModal } from '../components/customers/CustomerDetailModal';
import {
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Phone,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

export function CustomersPage() {
  const { customers, deleteCustomer } = useData();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoanType, setSelectedLoanType] = useState('all');
  const [selectedEmployment, setSelectedEmployment] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerToView, setCustomerToView] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Search & Filter Logic
  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.full_name?.toLowerCase().includes(term) ||
      c.phone?.includes(term) ||
      c.city?.toLowerCase().includes(term);

    const matchesLoanType = selectedLoanType === 'all' || c.preferred_loan_type === selectedLoanType;
    const matchesEmployment = selectedEmployment === 'all' || c.employment_type === selectedEmployment;

    return matchesSearch && matchesLoanType && matchesEmployment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            {t('customers.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('customers.subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => {
            setCustomerToEdit(null);
            setIsAddModalOpen(true);
          }}
        >
          {t('customers.addCustomer')}
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('customers.searchPlaceholder')}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          {/* Filter Loan Type */}
          <div>
            <select
              value={selectedLoanType}
              onChange={(e) => setSelectedLoanType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="all">{t('customers.filterLoanType')}</option>
              <option value="personal">Personal Loan</option>
              <option value="home">Home Loan</option>
              <option value="business">Business Loan</option>
              <option value="vehicle">Vehicle Loan</option>
              <option value="education">Education Loan</option>
              <option value="lap">Loan Against Property</option>
              <option value="gold">Gold Loan</option>
            </select>
          </div>

          {/* Filter Employment */}
          <div>
            <select
              value={selectedEmployment}
              onChange={(e) => setSelectedEmployment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="all">{t('customers.filterEmployment')}</option>
              <option value="Salaried">Salaried</option>
              <option value="Business">Business</option>
              <option value="Self-Employed">Self-Employed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Customer Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-4 sm:p-5">{t('customers.fullName')}</th>
                <th className="p-4 sm:p-5">{t('customers.city')}</th>
                <th className="p-4 sm:p-5">{t('customers.monthlyIncome')}</th>
                <th className="p-4 sm:p-5">{t('customers.preferredLoanType')}</th>
                <th className="p-4 sm:p-5">{t('customers.requiredLoanAmount')}</th>
                <th className="p-4 sm:p-5 text-center">{t('customers.cibilScore')}</th>
                <th className="p-4 sm:p-5 text-right">{t('customers.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No customers found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4 sm:p-5">
                      <div className="font-bold text-navy-900 dark:text-white">{c.full_name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 font-medium text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {c.city}
                      </div>
                      <span className="text-[11px] text-slate-400">{c.employment_type}</span>
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-navy-900 dark:text-white font-sans">
                      {formatRupee(c.monthly_income)}
                    </td>
                    <td className="p-4 sm:p-5">
                      <Badge variant="primary" size="sm" className="capitalize">
                        {c.preferred_loan_type}
                      </Badge>
                    </td>
                    <td className="p-4 sm:p-5 font-extrabold text-navy-900 dark:text-white font-sans">
                      {formatRupee(c.required_loan_amount)}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <span
                        className={`inline-block font-extrabold text-xs px-2 py-0.5 rounded ${
                          c.credit_score >= 750
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : c.credit_score >= 680
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                        }`}
                      >
                        {c.credit_score || 720}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setCustomerToView(c)}
                          title="View Profile"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-electric-600 hover:bg-electric-50 dark:hover:bg-electric-500/10 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCustomerToEdit(c);
                            setIsAddModalOpen(true);
                          }}
                          title={t('customers.edit')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCustomerToDelete(c)}
                          title={t('customers.delete')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Add/Edit Modal */}
      <CustomerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCustomerToEdit(null);
        }}
        customerToEdit={customerToEdit}
      />

      {/* Customer Detail View Modal */}
      <CustomerDetailModal
        isOpen={!!customerToView}
        onClose={() => setCustomerToView(null)}
        customer={customerToView}
      />

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-darkCard rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 dark:text-white">Delete Customer</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t('customers.confirmDelete')}{' '}
              <strong className="text-navy-900 dark:text-white">{customerToDelete.full_name}</strong>?
            </p>
            <p className="text-xs text-rose-500 mt-2">{t('customers.deleteWarning')}</p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setCustomerToDelete(null)}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  deleteCustomer(customerToDelete.id);
                  setCustomerToDelete(null);
                }}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
