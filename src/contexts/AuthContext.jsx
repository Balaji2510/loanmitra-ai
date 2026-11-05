import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isLiveSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

const DEFAULT_ADVISOR = {
  id: 'b0000000-0000-0000-0000-000000000003',
  organization_id: 'a0000000-0000-0000-0000-000000000001',
  organization_name: 'LoanMitra Advisory Services',
  full_name: 'Suresh Kumar',
  title: 'Senior Loan Advisor',
  email: 'advisor@loanmitra.ai',
  phone: '+91 98403 98765',
  role: 'loan_advisor',
  preferred_language: 'ta',
  commission_split_pct: 100.0,
  license_no: 'LM-ADV-TN-2025-084',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('loanmitra_advisor_profile');
    return saved ? JSON.parse(saved) : DEFAULT_ADVISOR;
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
          const { data: prof, error } = await supabase
            .from('profiles')
            .select('*, organizations(name)')
            .eq('id', session.user.id)
            .single();

          if (prof && !error) {
            setProfile({
              ...prof,
              organization_name: prof.organizations?.name || 'LoanMitra Advisory',
              role: 'loan_advisor',
            });
            setIsDemo(false);
          }
        }
      } catch (err) {
        console.warn('Supabase auth session check failed, using active advisor profile:', err);
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

  // Update profile handler
  const updateProfile = async (updatedFields) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('loanmitra_advisor_profile', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to write profile to local storage', e);
      }
      return updated;
    });

    if (isLiveSupabaseConfigured && user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updatedFields.full_name,
            phone: updatedFields.phone,
            preferred_language: updatedFields.preferred_language,
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Could not sync profile to live Supabase:', err);
      }
    }
  };

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
        setProfile(DEFAULT_ADVISOR);
        setIsDemo(true);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out handler
  const logout = async () => {
    if (isLiveSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemo,
        isAdvisor: true,
        login,
        logout,
        updateProfile,
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
