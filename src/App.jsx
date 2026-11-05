import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './locales/i18n';
import { DataProvider } from './contexts/DataContext';

import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { EligibilityPage } from './pages/EligibilityPage';
import { LendersPage } from './pages/LendersPage';
import { FollowupsPage } from './pages/FollowupsPage';
import { CommissionsPage } from './pages/CommissionsPage';
import { AiCopilotPage } from './pages/AiCopilotPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ProfilePage } from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-darkBg">
        <div className="w-8 h-8 rounded-full border-2 border-electric-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Loan Advisor Dedicated Platform */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="applications" element={<ApplicationsPage />} />
                  <Route path="eligibility" element={<EligibilityPage />} />
                  <Route path="lenders" element={<LendersPage />} />
                  <Route path="followups" element={<FollowupsPage />} />
                  <Route path="commissions" element={<CommissionsPage />} />
                  <Route path="ai-copilot" element={<AiCopilotPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
