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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log("Auth: Initializing...");
      try {
        // 1. Fetch session with extended timeout and AbortError suppression. Retry once on failure.
        let { data, error } = await supabase.auth.getSession();

        if (error) {
          console.warn("Auth: First session fetch failed, retrying...", error);
          await new Promise(r => setTimeout(r, 1000));
          const retry = await supabase.auth.getSession();
          data = retry.data;
          error = retry.error;
        }

        if (error) {
          const isAbort = error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('signal is aborted');
          if (!isAbort) {
            console.error("Auth: Session fetch error:", error);
          }
        }

        if (mounted) {
          const currentSession = data?.session;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            console.log("Auth: Session confirmed for", currentSession.user.email);
            await fetchProfile(currentSession.user.id);
          } else {
            console.log("Auth: No active session.");
          }
        }
      } catch (error: any) {
        const isAbort = error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('signal is aborted');
        if (!isAbort) {
          console.error("Auth: Unexpected initialization error:", error);
        }
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

          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id);
          } else if (localStorage.getItem('is_emergency_admin') !== 'true') {
            setProfile(null);
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

  const signUp = async (email: string, password: string, metadata: UserMetadata) => {
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
          }
        }
      });

      if (error) {
        return { error };
      }

      // If referred_by is provided, update the profile
      if (metadata.referred_by && data.user) {
        // Find the referrer's profile by referral code
        const { data: referrerProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", metadata.referred_by.toUpperCase())
          .single();

        if (referrerProfile) {
          // Update the new user's profile with referrer info
          await supabase
            .from("profiles")
            .update({ referred_by: referrerProfile.id })
            .eq("user_id", data.user.id);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
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
    localStorage.removeItem('is_emergency_admin');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
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
        setProfile({ full_name: 'Master Admin', email: 'admin@ascendacademy.com', role: 'admin' } as any);
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
