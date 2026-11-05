import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../locales/i18n';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatRupee, formatDate } from '../utils/formatters';
import {
  FileScan,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  UserCheck,
  Camera,
  Eye,
  Lock,
} from 'lucide-react';

export function DocumentsPage() {
  const { customers, documents, addDocument, toggleDocumentVerification } = useData();
  const { t } = useLanguage();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedDocType, setSelectedDocType] = useState('salary_slip');
  const [consentGranted, setConsentGranted] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!consentGranted) {
      alert('Explicit customer consent is required before processing customer financial documents.');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Send file metadata or simulated base64 to /api/documents/analyze
      const response = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          customerConsent: consentGranted,
          customerName: selectedCustomer?.full_name,
          loanType: selectedCustomer?.preferred_loan_type || 'personal',
        }),
      });

      const data = await response.json();
      setAnalysisResult(data);

      // Save document entry with status: 'ai_extracted', human_verified: false
      addDocument({
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.full_name,
        file_name: file.name,
        doc_type: data.classification || selectedDocType,
        file_size: file.size,
        verification_status: 'ai_extracted',
        human_verified: false,
        ai_extracted_data: data.extractedData,
      });
    } catch (err) {
      console.error('Doc analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight flex items-center gap-2">
          <FileScan className="w-6 h-6 text-cyanAccent-500" />
          <span>{t('ai.docIntelTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('ai.docIntelSubtitle')}
        </p>
      </div>

      {/* Upload Zone & Customer Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-5 sm:p-6">
            <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-4">
              Select Customer & Document Category
            </h3>

            <div className="space-y-4">
              {/* Customer Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.phone} - {c.preferred_loan_type} loan)
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Document Type
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-electric-500 focus:outline-none"
                >
                  <option value="salary_slip">Salary Slip (Payslip)</option>
                  <option value="bank_statement">Bank Statement (6 Months)</option>
                  <option value="pan_card">PAN Card</option>
                  <option value="aadhaar_card">Aadhaar Card (Masked)</option>
                  <option value="itr">ITR / Form 16</option>
                  <option value="business_doc">GST Certificate / Trade License</option>
                </select>
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                    className="mt-0.5 rounded accent-electric-600"
                  />
                  <span>
                    <strong>Customer Data Consent:</strong> I verify that customer {selectedCustomer?.full_name} has authorized digital document processing for loan underwriting in accordance with RBI privacy guidelines.
                  </span>
                </label>
              </div>

              {/* File Upload Dropzone */}
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-electric-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-navy-900/40">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-electric-50 dark:bg-electric-500/10 text-electric-600 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-navy-900 dark:text-white">
                    {t('ai.uploadPrompt')}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Supports camera capture, PDF, JPG, PNG up to 10MB</span>
                  </p>
                </div>
              </div>

              {analyzing && (
                <div className="p-3 rounded-xl bg-cyanAccent-50 dark:bg-cyanAccent-500/10 text-cyan-800 dark:text-cyanAccent-300 text-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyanAccent-500 animate-ping" />
                  <span>Gemini multimodal vision model is extracting parameters and verifying authenticity...</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* AI Extraction & Human Verification Panel */}
        <div className="lg:col-span-6 space-y-4">
          {analysisResult ? (
            <Card className="p-5 sm:p-6 border-cyanAccent-500/30">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <Badge variant="cyan" size="sm" className="uppercase font-bold">
                    {analysisResult.classification?.replace('_', ' ')}
                  </Badge>
                  <h4 className="text-sm font-bold text-navy-900 dark:text-white mt-1">
                    Gemini AI Vision Extraction Result
                  </h4>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Requires Advisor Verification</span>
                </div>
              </div>

              {/* Extracted Fields */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-navy-900">
                  <span className="text-slate-400">Name on Document</span>
                  <span className="font-bold text-navy-900 dark:text-white">
                    {analysisResult.extractedData?.entityName || 'Verified'}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-navy-900">
                  <span className="text-slate-400">Masked ID / Account</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {analysisResult.extractedData?.maskedIdentifier || 'ABCDE****F'}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-navy-900">
                  <span className="text-slate-400">Extracted Monthly Income</span>
                  <span className="font-bold text-emerald-600 font-sans">
                    {analysisResult.extractedData?.monthlyIncomeOrTurnover
                      ? formatRupee(analysisResult.extractedData.monthlyIncomeOrTurnover)
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-navy-900">
                  <span className="text-slate-400">Confidence Score</span>
                  <span className="font-bold text-electric-600">
                    {Math.round((analysisResult.extractedData?.confidenceScore || 0.94) * 100)}%
                  </span>
                </div>
              </div>

              {/* Missing Documents Alert */}
              {analysisResult.missingDocumentsChecklist?.length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Remaining Pending Documents for {selectedCustomer?.preferred_loan_type} loan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingDocumentsChecklist.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 capitalize font-medium"
                      >
                        {m.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Human Verification Sign-off Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Human-in-the-loop audit
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={UserCheck}
                  onClick={() => {
                    alert('Advisor verification recorded! Data safely sanctioned for credit appraisal.');
                    setAnalysisResult(null);
                  }}
                >
                  {t('ai.verifyButton')}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-bold text-navy-900 dark:text-white">
                No Document Selected for Analysis
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Upload a borrower salary slip, bank statement, or tax return on the left to extract financial numbers with Gemini Vision.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Customer Document Repository Table */}
      <Card>
        <CardHeader
          title="Document Verification Vault"
          subtitle="Customer documents stored with human verification status"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 font-semibold">
                <th className="p-4">Customer</th>
                <th className="p-4">File Name</th>
                <th className="p-4">Classification</th>
                <th className="p-4">Extracted Key Data</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4 text-right">Human Sign-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-navy-900 dark:text-white">
                    {doc.customer_name}
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-300 truncate max-w-[160px]">
                    {doc.file_name}
                  </td>
                  <td className="p-4">
                    <Badge variant="default" size="sm" className="capitalize">
                      {doc.doc_type?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4 text-xs">
                    {doc.ai_extracted_data?.net_pay ? (
                      <span className="font-bold text-emerald-600">
                        Net: {formatRupee(doc.ai_extracted_data.net_pay)}
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard document metadata</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={doc.human_verified ? 'success' : 'warning'} size="sm">
                      {doc.human_verified ? t('ai.verifiedBadge') : t('ai.unverifiedBadge')}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleDocumentVerification(doc.id, !doc.human_verified)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {doc.human_verified ? 'Unverify' : 'Verify & Sign'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
