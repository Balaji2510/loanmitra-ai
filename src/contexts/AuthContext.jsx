import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isLiveSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

const DEMO_USERS = {
  super_admin: {
    id: 'b0000000-0000-0000-0000-000000000001',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'LoanMitra Prime Advisory Services',
    full_name: 'Rajesh K (Super Admin)',
    email: 'admin@loanmitra.ai',
    phone: '+91 98401 12345',
    role: 'super_admin',
    preferred_language: 'ta',
    commission_split_pct: 60.0,
  },
  company_admin: {
    id: 'b0000000-0000-0000-0000-000000000002',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'LoanMitra Prime Advisory Services',
    full_name: 'Meenakshi Sundaram (Branch Admin)',
    email: 'meenakshi@loanmitra.ai',
    phone: '+91 98402 56789',
    role: 'company_admin',
    preferred_language: 'ta',
    commission_split_pct: 55.0,
  },
  loan_advisor: {
    id: 'b0000000-0000-0000-0000-000000000003',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'LoanMitra Prime Advisory Services',
    full_name: 'Suresh Kumar (Senior Loan Advisor)',
    email: 'suresh@loanmitra.ai',
    phone: '+91 98403 98765',
    role: 'loan_advisor',
    preferred_language: 'tanglish',
    commission_split_pct: 50.0,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => {
    // Check saved demo user in localStorage or default to senior advisor
    const saved = localStorage.getItem('loanmitra_demo_role');
    return DEMO_USERS[saved] || DEMO_USERS.loan_advisor;
  });
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(!isLiveSupabaseConfigured);

  // Initialize Auth state from live Supabase if configured
  useEffect(() => {
    if (!isLiveSupabaseConfigured) return;

    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Fetch linked profile from database
          const { data: prof, error } = await supabase
            .from('profiles')
            .select('*, organizations(name)')
            .eq('id', session.user.id)
            .single();

          if (prof && !error) {
            setProfile({
              ...prof,
              organization_name: prof.organizations?.name || 'LoanMitra Advisory',
            });
            setIsDemo(false);
          }
        }
      } catch (err) {
        console.warn('Supabase auth session check failed, using active profile:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsDemo(false);
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isLiveSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        setIsDemo(false);
        return { success: true };
      } else {
        // Find matching demo user or use loan advisor
        const matchedKey = Object.keys(DEMO_USERS).find((k) => DEMO_USERS[k].email === email) || 'loan_advisor';
        const demoProf = DEMO_USERS[matchedKey];
        setProfile(demoProf);
        localStorage.setItem('loanmitra_demo_role', matchedKey);
        setIsDemo(true);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Switch demo roles instantly for review/demonstration
  const switchDemoRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setProfile(DEMO_USERS[roleKey]);
      localStorage.setItem('loanmitra_demo_role', roleKey);
    }
  };

  // Sign out handler
  const logout = async () => {
    if (isLiveSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    // Reset to loan advisor for quick exploration
    setProfile(DEMO_USERS.loan_advisor);
    localStorage.removeItem('loanmitra_demo_role');
  };

  const isSuperAdmin = profile?.role === 'super_admin';
  const isCompanyAdmin = profile?.role === 'company_admin' || profile?.role === 'super_admin';
  const isAdvisor = profile?.role === 'loan_advisor';

  const hasRole = (allowedRoles = []) => {
    if (!profile) return false;
    if (profile.role === 'super_admin') return true;
    return allowedRoles.includes(profile.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemo,
        isSuperAdmin,
        isCompanyAdmin,
        isAdvisor,
        hasRole,
        login,
        logout,
        switchDemoRole,
        availableDemoRoles: DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
