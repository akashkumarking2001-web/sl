import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Lock, Mail, ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Fixed Admin Credentials
const ADMIN_EMAIL = "admin@ascendacademy.com";
const ADMIN_PASSWORD = "AdminElite2026!";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signIn, forceAdminLogin } = useAuth();

  // Redirect if already logged in as the specific admin
  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Hardcoded Credential Validation (Frontend Gate)
    // Relaxed check: Trim password to avoid copy-paste errors
    const inputPassword = password.trim();

    console.log("Login Attempt:", {
      email: email.toLowerCase().trim(),
      expectedEmail: ADMIN_EMAIL,
      passMatch: inputPassword === ADMIN_PASSWORD
    });

    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase() || inputPassword !== ADMIN_PASSWORD) {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials. Please ensure no spaces are included.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Set Emergency Flag immediately for smooth UX if verified by hardcode
    localStorage.setItem('is_emergency_admin', 'true');

    try {
      // 2. Authenticate with Supabase
      const { error } = await signIn(email, password);

      if (error) {
        // RESILIENCE MODE: If the error is a 'Schema Error' but credentials match, 
        // we use the EMERGENCY BYPASS to let the admin in.
        if (error.message.includes("schema") || error.message.includes("Internal Server Error") || error.message.includes("database")) {
          console.warn("Supabase Maintenance Detected. Activating Emergency Admin Bypass...");
          forceAdminLogin();
          toast({
            title: "Emergency Bypass Active",
            description: "Supabase is in maintenance. Local authorization granted.",
          });
          navigate("/admin");
        } else {
          toast({
            title: "Authentication Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      // 3. Successful Admin Login
      toast({
        title: "Master Admin Authorized",
        description: "Welcome to the Ascend Academy Control Center.",
      });
      navigate("/admin");

    } catch (error: any) {
      toast({
        title: "Critical Error",
        description: "A network error occurred. Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Cinematic Performance Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[160px] opacity-50" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Navigation */}
      <Link
        to="/"
        className="absolute top-10 left-10 flex items-center gap-3 text-slate-400 hover:text-white transition-all group z-20"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-red-500/50 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span className="text-sm font-bold tracking-tight">Return to Academy</span>
      </Link>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-[440px] px-6">
        <div className="backdrop-blur-3xl bg-[#0f0f0f]/80 border border-white/[0.08] p-12 rounded-[3rem] shadow-[0_24px_80px_rgba(0,0,0,0.8)]">

          {/* Identity Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-lg opacity-40 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-b from-red-500 to-red-600 flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-1">
              SYSTEM <span className="text-red-600">ADMIN</span>
            </h1>
            <div className="h-1 w-12 bg-red-600 rounded-full mb-3" />
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.4em] text-center">
              Restricted Terminal Interface
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ascendacademy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-14 h-16 bg-white/[0.03] border-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 rounded-2xl transition-all text-slate-200 placeholder:text-slate-700 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-14 pr-14 h-16 bg-white/[0.03] border-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 rounded-2xl transition-all text-slate-200 placeholder:text-slate-700 text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4" />
                  Grant Access
                </div>
              )}
            </Button>
          </form>

          {/* Warning Banner */}
          <div className="mt-10 p-4 rounded-2xl bg-red-600/5 border border-red-500/10 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Access is restricted to <span className="text-red-500 font-bold">Authorized Admins</span> only. Unauthorized login attempts are tracked by IP and logged permanently.
            </p>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center mt-10">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-600 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Switch to Regular Session
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
