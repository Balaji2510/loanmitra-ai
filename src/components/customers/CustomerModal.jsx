import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../locales/i18n';

export function CustomerModal({ isOpen, onClose, customerToEdit = null }) {
  const { addCustomer, updateCustomer } = useData();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    city: 'Chennai',
    employment_type: 'Salaried',
    monthly_income: 50000,
    existing_emi: 0,
    preferred_loan_type: 'personal',
    required_loan_amount: 500000,
    preferred_language: 'ta',
    credit_score: 720,
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customerToEdit) {
      setFormData(customerToEdit);
    } else {
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        city: 'Chennai',
        employment_type: 'Salaried',
        monthly_income: 50000,
        existing_emi: 0,
        preferred_loan_type: 'personal',
        required_loan_amount: 500000,
        preferred_language: 'ta',
        credit_score: 720,
        notes: '',
      });
    }
    setErrors({});
  }, [customerToEdit, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.full_name?.trim()) errs.full_name = 'Full name is required';
    if (!formData.phone?.trim()) errs.phone = 'Phone number is required';
    if (!formData.city?.trim()) errs.city = 'City is required';
    if (Number(formData.monthly_income) <= 0) errs.monthly_income = 'Monthly income must be > 0';
    if (Number(formData.required_loan_amount) <= 0) errs.required_loan_amount = 'Loan amount must be > 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (customerToEdit) {
      updateCustomer(customerToEdit.id, formData);
    } else {
      addCustomer(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customerToEdit ? 'Edit Customer Record' : t('customers.addCustomer')}
      subtitle="Enter applicant employment and loan requirement parameters"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.fullName')} *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="e.g. Karthik Narayanan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
            {errors.full_name && <p className="text-rose-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.phone')} *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98401 23456"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
            {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="borrower@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.city')} *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Chennai, Coimbatore, Madurai"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
            {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city}</p>}
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.employmentType')}
            </label>
            <select
              value={formData.employment_type}
              onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="Salaried">Salaried (Corporate / Govt)</option>
              <option value="Business">Business / Proprietor</option>
              <option value="Self-Employed">Self-Employed Professional (Doctor/CA/Lawyer)</option>
            </select>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.preferredLanguage')}
            </label>
            <select
              value={formData.preferred_language}
              onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="tanglish">Tanglish</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Monthly Income */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.monthlyIncome')} (₹) *
            </label>
            <input
              type="number"
              value={formData.monthly_income}
              onChange={(e) => setFormData({ ...formData, monthly_income: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
            {errors.monthly_income && <p className="text-rose-500 text-xs mt-1">{errors.monthly_income}</p>}
          </div>

          {/* Existing EMI */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.existingEmi')} (₹)
            </label>
            <input
              type="number"
              value={formData.existing_emi}
              onChange={(e) => setFormData({ ...formData, existing_emi: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          {/* Preferred Loan Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.preferredLoanType')}
            </label>
            <select
              value={formData.preferred_loan_type}
              onChange={(e) => setFormData({ ...formData, preferred_loan_type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="personal">Personal Loan</option>
              <option value="home">Home Loan</option>
              <option value="business">Business Loan</option>
              <option value="vehicle">Vehicle Loan</option>
              <option value="education">Education Loan</option>
              <option value="lap">Loan Against Property (LAP)</option>
              <option value="gold">Gold Loan</option>
            </select>
          </div>

          {/* Required Loan Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.requiredLoanAmount')} (₹) *
            </label>
            <input
              type="number"
              value={formData.required_loan_amount}
              onChange={(e) => setFormData({ ...formData, required_loan_amount: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
            {errors.required_loan_amount && <p className="text-rose-500 text-xs mt-1">{errors.required_loan_amount}</p>}
          </div>

          {/* CIBIL Score */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('customers.cibilScore')} (300 - 900)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="500"
                max="850"
                value={formData.credit_score || 700}
                onChange={(e) => setFormData({ ...formData, credit_score: Number(e.target.value) })}
                className="flex-1 accent-electric-600"
              />
              <span className="font-extrabold text-sm px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-navy-900 dark:text-white">
                {formData.credit_score || 700}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Internal Advisor Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Customer requirements, preferred banks, co-applicant details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {customerToEdit ? 'Save Changes' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
