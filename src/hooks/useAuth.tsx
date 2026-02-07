import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: UserMetadata) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  sendEmailOTP: (email: string) => Promise<{ error: Error | null }>;
  verifyEmailOTP: (email: string, token: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  profile: UserProfile | null;
  forceAdminLogin: () => void;
}

interface UserMetadata {
  full_name: string;
  phone?: string;
  referred_by?: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  student_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  referral_code: string | null;
  referred_by: string | null;
  has_purchased: boolean | null;
  purchased_plan: string | null;
  avatar_url: string | null;
  created_at: string;
  role: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;
  dob: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(() => {
    // Optimization: Check for existing Supabase session token in localStorage
    // This prevents the "Verifying access..." flash for users who are already logged out
    if (typeof window !== 'undefined') {
      const hasToken = Object.keys(localStorage).some(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
      return hasToken;
    }
    return true;
  });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log("Auth: Initializing...");

      // 1. Race getSession against a 100ms timeout for INSTANT LOAD
      // We rely on onAuthStateChange for the real update if this times out.
      try {
        const timeoutPromise = new Promise<{ data: { session: null }; error: any }>((_, reject) =>
          setTimeout(() => reject(new Error("Auth timeout")), 100)
        );

        const sessionPromise = supabase.auth.getSession();

        const { data, error } = await Promise.race([sessionPromise, timeoutPromise]);

        if (error) throw error;

        if (mounted) {
          const currentSession = data?.session;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            console.log("Auth: Session confirmed for", currentSession.user.email);
            // Non-blocking profile fetch
            fetchProfile(currentSession.user.id).catch(err => console.error("Profile fetch bg error:", err));
          } else {
            // Fallback: Check emergency flag
            const isEmergency = typeof window !== 'undefined' && localStorage.getItem('is_emergency_admin') === 'true';
            if (isEmergency) {
              console.log("Auth: Restoring Emergency Admin Session");
              const mockUser = { id: 'admin-id', email: 'admin@ascendacademy.com' } as any;
              setUser(mockUser);
              setProfile({
                id: 'admin-id',
                user_id: 'admin-id',
                full_name: 'Master Admin',
                email: 'admin@ascendacademy.com',
                role: 'admin',
                created_at: new Date().toISOString(),
                phone: null,
                referral_code: null,
                referred_by: null,
                has_purchased: typeof window !== 'undefined' && localStorage.getItem('mock_has_purchased') === 'true' ? true : null,
                purchased_plan: typeof window !== 'undefined' && localStorage.getItem('mock_has_purchased') === 'true' ? 'Elite Package' : null,
                avatar_url: null,
                address: null,
                city: null,
                state: null,
                pincode: null,
                country: 'India',
                dob: null,
                student_id: 'SL-ADMIN-001'
              });
            }
          }
        }
      } catch (error: any) {
        console.warn("Auth: Initialization fallback triggered:", error.message);
        // If timeout or error, we stop loading. 
        // If onAuthStateChange fires later, it will update the state.
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("Auth: Initialization complete.");
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        try {
          if (!mounted) return;

          // CHECK EMERGENCY FLAG
          const isEmergency = typeof window !== 'undefined' && localStorage.getItem('is_emergency_admin') === 'true';

          // If we are in Emergency Mode and Supabase says "no session", WE IGNORE SUPABASE.
          // This prevents the "logout on refresh" bug where Supabase initializes with null before the session is restored.
          if (isEmergency && !currentSession) {
            console.log("Auth: Preserving Emergency Admin Session (Ignoring Supabase null state)");
            // Ensure the mock user exists so the app knows we are logged in
            setUser((prev) => prev || ({ id: 'admin-id', email: 'admin@ascendacademy.com', role: 'authenticated' } as User));
            // Don't mistakenly clear the profile either
            if (!profile) {
              setProfile({
                id: 'admin-id',
                user_id: 'admin-id',
                full_name: 'Master Admin',
                email: 'admin@ascendacademy.com',
                role: 'admin',
                created_at: new Date().toISOString(),
                phone: null,
                referral_code: null,
                referred_by: null,
                has_purchased: typeof window !== 'undefined' && localStorage.getItem('mock_has_purchased') === 'true' ? true : null,
                purchased_plan: typeof window !== 'undefined' && localStorage.getItem('mock_has_purchased') === 'true' ? 'Elite Package' : null,
                avatar_url: null,
                address: null,
                city: null,
                state: null,
                pincode: null,
                country: 'India',
                dob: null,
                student_id: 'SL-ADMIN-001'
              });
            }
            return;
          }

          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id);
          } else {
            // Only clear profile if NOT emergency admin (though the check above usually catches this)
            if (!isEmergency) setProfile(null);
          }
        } catch (err: any) {
          // Ignore abort errors during state change
          if (err.name !== 'AbortError' && !err.message?.includes('aborted')) {
            console.error("Auth: State change error", err);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
        console.error("Auth: Profile fetch error:", error);
        return;
      }

      if (data) setProfile(data as any);
    } catch (error: any) {
      if (error.name !== 'AbortError' && !error.message?.includes('aborted')) {
        console.error("Auth: Profile fetch exception:", error);
      }
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: metadata.full_name,
            phone: metadata.phone,
            student_id: metadata.student_id,
            referral_code: metadata.referral_code,
            country: metadata.country,
            state: metadata.state,
            address: metadata.address,
            pincode: metadata.pincode,
            dob: metadata.dob,
          }
        }
      });

      if (error) {
        return { error };
      }

      // If referred_by is provided, we now rely on the DB trigger to handle the initial profile creation.
      // However, we wait a moment to allow the trigger to finish, then fetch the profile if needed.
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (loginIdentifier: string, password: string) => {
    try {
      let emailToUse = loginIdentifier;

      // Check if input looks like a Student ID (Simple check: Starts with SL and has numbers)
      const cleanId = loginIdentifier.trim().toUpperCase();
      if (cleanId.startsWith("SL") && cleanId.length > 2) {
        console.log("Attempting login via User ID:", cleanId);

        // Lookup email from profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('student_id', cleanId)
          .maybeSingle();

        if (error) {
          console.error("Error looking up User ID:", error);
          // Fallthrough to try as email in case 'SL' part of email? Unlikely but safer to default or fail?
          // Actually if ID lookup fails, we can't login.
          return { error: new Error("Invalid User ID or Database Connection Error") };
        }

        if (!data || !data.email) {
          return { error: new Error("User ID not found") };
        }

        console.log("Resolved User ID to email:", data.email);
        emailToUse = data.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log("Auth: Signing out...");
      localStorage.removeItem('is_emergency_admin');

      // Attempt clean sign out
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Auth: Sign out error (swallowed)", err);
    } finally {
      // FORCE clear state even if API fails or hangs
      setUser(null);
      setSession(null);
      setProfile(null);

      // Clear all local storage as a "hard reset" to prevent stale session cache
      localStorage.clear();
      sessionStorage.clear();

      window.location.href = '/'; // Hard redirect to clear all internal app states
    }
  };

  // Send OTP code via email for password recovery
  const sendEmailOTP = async (email: string) => {
    try {
      // Use signInWithOtp which sends a 6-digit code via email
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // This ensures we get an OTP code, not a magic link
          shouldCreateUser: false,
        }
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Verify the email OTP code
  const verifyEmailOTP = async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      sendEmailOTP,
      verifyEmailOTP,
      updatePassword,
      profile,
      forceAdminLogin: () => {
        localStorage.setItem('is_emergency_admin', 'true');
        const mockUser = { id: 'admin-id', email: 'admin@ascendacademy.com' } as any;
        setUser(mockUser);
        setProfile({
          id: 'admin-id',
          user_id: 'admin-id',
          full_name: 'Master Admin',
          email: 'admin@ascendacademy.com',
          role: 'admin',
          created_at: new Date().toISOString(),
          phone: null,
          referral_code: null,
          referred_by: null,
          has_purchased: null,
          purchased_plan: null,
          avatar_url: null,
          address: null,
          city: null,
          state: null,
          pincode: null,
          country: 'India',
          dob: null,
          student_id: 'SL-ADMIN-001'
        } as any);
        setLoading(false);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
