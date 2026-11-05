import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../locales/i18n';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatRupee, formatDate, STAGE_CONFIG } from '../utils/formatters';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import { ApplicationStatusModal } from '../components/applications/ApplicationStatusModal';
import { ApplicationTimeline } from '../components/applications/ApplicationTimeline';
import { Modal } from '../components/common/Modal';
import {
  FilePlus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Edit3,
} from 'lucide-react';

export function ApplicationsPage() {
  const { applications } = useData();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appForStatusUpdate, setAppForStatusUpdate] = useState(null);
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);

  const filteredApps = applications.filter((app) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      app.customer_name?.toLowerCase().includes(term) ||
      app.lender_name?.toLowerCase().includes(term) ||
      app.loan_type?.toLowerCase().includes(term);

    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            {t('applications.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('applications.subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          icon={FilePlus}
          onClick={() => setIsAddModalOpen(true)}
        >
          {t('applications.newApplication')}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, lender or loan type..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs sm:text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              <option value="all">All Stages (9 Stages)</option>
              <option value="new_lead">1. New Lead</option>
              <option value="contacted">2. Contacted</option>
              <option value="eligibility_checked">3. Eligibility Checked</option>
              <option value="documents_pending">4. Documents Pending</option>
              <option value="application_submitted">5. Application Submitted</option>
              <option value="under_verification">6. Under Verification</option>
              <option value="approved">7. Approved</option>
              <option value="rejected">8. Rejected</option>
              <option value="disbursed">9. Disbursed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-4 sm:p-5">Borrower Customer</th>
                <th className="p-4 sm:p-5">Partner Bank</th>
                <th className="p-4 sm:p-5">Loan Type</th>
                <th className="p-4 sm:p-5">Requested Amount</th>
                <th className="p-4 sm:p-5">Calculated EMI</th>
                <th className="p-4 sm:p-5">Workflow Stage</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No loan applications found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const stage = STAGE_CONFIG[app.status] || { label: app.status, color: 'bg-slate-500 text-white' };
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 sm:p-5">
                        <div
                          onClick={() => setSelectedAppDetail(app)}
                          className="font-bold text-navy-900 dark:text-white cursor-pointer hover:text-electric-600 transition-colors"
                        >
                          {app.customer_name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Created {formatDate(app.created_at)}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-navy-900 dark:text-white">
                        {app.lender_name || 'Bank Partner'}
                      </td>
                      <td className="p-4 sm:p-5">
                        <Badge variant="default" size="sm" className="capitalize">
                          {app.loan_type}
                        </Badge>
                      </td>
                      <td className="p-4 sm:p-5 font-extrabold text-navy-900 dark:text-white font-sans">
                        {formatRupee(app.requested_amount)}
                        <span className="block text-[11px] font-normal text-slate-400">
                          {app.tenure_months}M @ {app.interest_rate}%
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-slate-700 dark:text-slate-300 font-sans">
                        {app.calculated_emi ? `${formatRupee(app.calculated_emi)}/mo` : '-'}
                      </td>
                      <td className="p-4 sm:p-5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${stage.color}`}
                        >
                          <span>Step {stage.step}:</span>
                          <span>{stage.label}</span>
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setAppForStatusUpdate(app)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-electric-600 dark:text-cyanAccent-400 bg-electric-50 dark:bg-electric-500/10 hover:bg-electric-100 dark:hover:bg-electric-500/20 border border-electric-200 dark:border-electric-500/30 flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update Stage</span>
                          </button>
                          <button
                            onClick={() => setSelectedAppDetail(app)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Application Creation Modal */}
      <ApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Update Status Modal */}
      {appForStatusUpdate && (
        <ApplicationStatusModal
          isOpen={!!appForStatusUpdate}
          onClose={() => setAppForStatusUpdate(null)}
          application={appForStatusUpdate}
        />
      )}

      {/* Application Detail & Visual Timeline Modal */}
      {selectedAppDetail && (
        <Modal
          isOpen={!!selectedAppDetail}
          onClose={() => setSelectedAppDetail(null)}
          title={`Application Details - ${selectedAppDetail.customer_name}`}
          subtitle={`Target Bank: ${selectedAppDetail.lender_name || 'Bank'} • Requested: ${formatRupee(selectedAppDetail.requested_amount)}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <ApplicationTimeline
              status={selectedAppDetail.status}
              timeline={selectedAppDetail.timeline}
            />

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800">
              <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Underwriting Notes
              </h5>
              <p className="text-sm text-navy-900 dark:text-white">
                {selectedAppDetail.internal_notes || 'No specific underwriting remarks recorded.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                size="sm"
                icon={Edit3}
                onClick={() => {
                  setAppForStatusUpdate(selectedAppDetail);
                  setSelectedAppDetail(null);
                }}
              >
                Change Stage
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
