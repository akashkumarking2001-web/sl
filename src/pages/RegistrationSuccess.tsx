import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle, ArrowRight, Mail, ArrowLeft, Copy, Shield, Sparkles,
  User, Phone, MapPin, Key, Calendar, Crown, Star, Gem, Trophy,
  Gift, Eye, EyeOff, Lock, Check, Zap, Globe, Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import confetti from "canvas-confetti";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  sponsorId?: string;
  country?: string;
  state?: string;
  address?: string;
  pincode?: string;
  dob?: string;
  plan?: string;
}

const planDetails: Record<string, { name: string; price: string; color: string; icon: React.ComponentType<any>; benefits: string[] }> = {
  SPARK: { name: "SPARK", price: "₹299", color: "bg-blue-500", icon: Star, benefits: ["Basic Courses", "Community Forum", "Foundation Certificates"] },
  MOMENTUM: { name: "MOMENTUM", price: "₹499", color: "bg-emerald-500", icon: Sparkles, benefits: ["Intermediate Courses", "Referral Bonus", "Live Webinars"] },
  SUMMIT: { name: "SUMMIT", price: "₹999", color: "bg-amber-500", icon: Crown, benefits: ["Advanced Modules", "1-on-1 Mentorship", "Monthly Q&A"] },
  TITAN: { name: "TITAN", price: "₹1,499", color: "bg-violet-500", icon: Gem, benefits: ["Expert Training", "Success Coach", "Early Access"] },
  LEGACY: { name: "LEGACY", price: "₹2,499", color: "bg-rose-500", icon: Trophy, benefits: ["Complete Mastery", "Revenue Sharing", "Lifetime Support"] },
};

const RegistrationSuccess = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const stateData = location.state?.userData as UserData | undefined;

  const userData: UserData = {
    id: stateData?.id || `SL${Math.floor(10000000 + Math.random() * 90000000)}`,
    name: stateData?.name || "New Student",
    email: stateData?.email || "student@example.com",
    phone: stateData?.phone || "Not Provided",
    password: stateData?.password || "••••••••",
    sponsorId: stateData?.sponsorId,
    country: stateData?.country,
    state: stateData?.state,
    address: stateData?.address,
    pincode: stateData?.pincode,
    dob: stateData?.dob,
    plan: stateData?.plan,
  };

  const selectedPlan = useMemo(() => {
    if (!userData.plan) return null;
    const planKey = userData.plan.toUpperCase();
    return planDetails[planKey] || null;
  }, [userData.plan]);

  useEffect(() => {
    // Fire confetti on mount
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans relative overflow-hidden transition-colors duration-500 pb-20">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-50 p-6 flex items-center justify-between container mx-auto">
        <Link to="/">
          <img src={logo} alt="Skill Learners" className="h-10 md:h-12 w-auto invert dark:invert-0" />
        </Link>
        <ThemeToggle variant="icon" />
      </nav>

      <div className="relative max-w-5xl mx-auto px-4 z-10 pt-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-16 max-w-md mx-auto">
          <div className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 h-1 bg-emerald-500/30 mx-3 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full animate-progress-full" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/20 animate-pulse border-4 border-background">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1 h-1 bg-muted mx-3 rounded-full" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Success Card */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Info */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
            <div className="bg-card border border-border/50 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Crown className="w-48 h-48" />
              </div>

              <div className="relative z-10 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-4 mb-8">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
                  Welcome <span className="text-primary italic">Warrior!</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10 font-medium font-display">
                  Congratulations <span className="text-foreground font-black underline decoration-primary underline-offset-4">{userData.name}</span>! Your digital academy account has been successfully provisioned. You are now an official member of the Skill Learners movement.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Unique ID Card */}
                  <div className="bg-muted/50 border border-border/50 rounded-3xl p-6 relative group hover:border-primary/50 transition-all">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 block">Unique Academy ID</label>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="w-6 h-6 text-primary" />
                        <span className="text-2xl font-black font-mono tracking-widest text-foreground">{userData.id}</span>
                      </div>
                      <button onClick={() => copyToClipboard(userData.id || "", "User ID")} className="p-3 bg-background border rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-4 px-3 py-1 bg-primary/10 rounded-full text-[9px] font-black text-primary uppercase tracking-widest inline-block">Global Tier Verified</div>
                  </div>

                  {/* Credentials */}
                  <div className="bg-muted/50 border border-border/50 rounded-3xl p-6 group hover:border-primary/50 transition-all">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 block">Access Key</label>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Key className="w-6 h-6 text-primary" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={userData.password}
                          readOnly
                          className="bg-transparent text-xl font-black font-mono text-foreground focus:outline-none w-32"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setShowPassword(!showPassword)} className="p-3 bg-background border rounded-xl hover:bg-muted transition-all">
                          {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        <button onClick={() => copyToClipboard(userData.password || "", "Password")} className="p-3 bg-background border rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-muted-foreground uppercase leading-none">Login with email: {userData.email}</div>
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="mt-8 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Verify Your Inbox</p>
                    <p className="text-xs font-bold text-muted-foreground/80 leading-relaxed uppercase tracking-tight">We have sent a confirmation link to <span className="text-foreground">{userData.email}</span>. Please verify to activate full portal features.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Info Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <StatRow label="Full Name" value={userData.name} icon={User} />
              <StatRow label="Contact" value={userData.phone} icon={Phone} />
              <StatRow label="Country" value={userData.country || "India"} icon={Globe} />
              <StatRow label="DOB" value={userData.dob || "-"} icon={Calendar} />
            </div>
          </div>

          {/* Sidebar Plan Card */}
          <div className="lg:col-span-12 xl:col-span-4">
            {selectedPlan ? (
              <div className="h-full bg-card border border-border p-3 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className={cn("absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700", selectedPlan.color.replace('bg-', 'text-'))}>
                  <selectedPlan.icon className="w-48 h-48" />
                </div>
                <div className="relative z-10 p-8 flex flex-col h-full">
                  <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl mb-10 text-white", selectedPlan.color)}>
                    <selectedPlan.icon className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase mb-2">Selected Package</p>
                  <h3 className="text-4xl font-black mb-3 tracking-tight italic uppercase">{selectedPlan.name}</h3>
                  <div className="text-3xl font-black text-primary mb-10">{selectedPlan.price}</div>

                  <div className="space-y-4 mb-20 flex-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Core Benefit Matrix</p>
                    {selectedPlan.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <span className="text-sm font-bold text-foreground/80">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-autom pt-8 border-t border-border/50 text-center">
                    <div className="p-4 bg-muted/50 rounded-2xl border flex items-center justify-between">
                      <div className="text-left leading-none">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Package License</p>
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-tighter">Verified & Active</p>
                      </div>
                      <Shield className="w-8 h-8 text-emerald-500/50" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-muted border-2 border-dashed border-border rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                <Trophy className="w-16 h-16 text-muted-foreground opacity-20 mb-6" />
                <p className="text-muted-foreground font-black uppercase text-xs tracking-widest">Custom Plan Enrollment</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
          <Link to="/login" className="flex-[2] h-20">
            <Button className="w-full h-full rounded-[2rem] bg-primary text-primary-foreground font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all group overflow-hidden relative active:scale-95">
              <span className="relative z-10 flex items-center gap-3">
                Enter Executive Terminal
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 w-full animate-shimmer" />
            </Button>
          </Link>
          <Link to="/user-home" className="flex-1 h-20">
            <Button variant="outline" className="w-full h-full rounded-[2rem] border-2 border-border/50 font-black uppercase tracking-widest hover:bg-muted transition-all text-muted-foreground hover:text-foreground active:scale-95">
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Secured Experience</p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
            <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> <span className="text-[10px] font-black tracking-tighter">TLS 1.3 ENCRYPTED</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> <span className="text-[10px] font-black tracking-tighter">SOC2 COMPLIANT</span></div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> <span className="text-[10px] font-black tracking-tighter">GDPR PROTECTED</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
  <div className="bg-card border border-border/50 p-6 rounded-3xl group hover:border-primary/50 transition-all flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter mb-0.5">{label}</p>
      <p className="text-sm font-black text-foreground truncate">{value || "-"}</p>
    </div>
  </div>
);

export default RegistrationSuccess;
