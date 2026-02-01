import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle, ArrowRight, Mail, ArrowLeft, Copy, Shield, Sparkles,
  User, Phone, MapPin, Key, Calendar, Crown, Star, Gem, Trophy,
  Gift, Eye, EyeOff, Lock, Check, Zap, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import confetti from "canvas-confetti";

interface UserData {
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
  SPARK: { name: "SPARK", price: "₹2,999", color: "from-orange-500 to-rose-600", icon: Star, benefits: ["100GB+ Editing Assets", "4K Video Templates", "Audio & SFX Library"] },
  MOMENTUM: { name: "MOMENTUM", price: "₹5,999", color: "from-cyan-500 to-blue-600", icon: Sparkles, benefits: ["Social Media Courses", "YouTube Monetization", "Content Templates"] },
  SUMMIT: { name: "SUMMIT", price: "₹9,999", color: "from-emerald-500 to-teal-600", icon: Crown, benefits: ["Affiliate Marketing", "E-commerce Training", "Sales Funnels"] },
  TITAN: { name: "TITAN", price: "₹14,999", color: "from-amber-500 to-yellow-500", icon: Gem, benefits: ["Digital Marketing Pro", "SEO Mastery", "Lead Generation"] },
  LEGACY: { name: "LEGACY", price: "₹24,999", color: "from-violet-600 to-purple-700", icon: Trophy, benefits: ["Financial Trading", "Live Sessions", "Trading Signals"] },
};

const RegistrationSuccess = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const stateData = location.state?.userData as UserData | undefined;

  const userData: UserData = {
    name: stateData?.name || "New User",
    email: stateData?.email || "your@email.com",
    phone: stateData?.phone || "",
    password: stateData?.password || "••••••••",
    sponsorId: stateData?.sponsorId,
    country: stateData?.country,
    state: stateData?.state,
    address: stateData?.address,
    pincode: stateData?.pincode,
    dob: stateData?.dob,
    plan: stateData?.plan,
  };

  const selectedPlan = userData.plan ? planDetails[userData.plan] : null;

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
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
    <div className="min-h-screen bg-[#020617] p-4 relative overflow-hidden text-white font-sans">
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto py-8 z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/">
            <img
              src={logo}
              alt="Ascend Academy"
              className="h-14 w-auto mx-auto drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform hover:scale-105 duration-300"
            />
          </Link>
        </div>

        {/* 1. Step Indicator */}
        <div className="flex items-center justify-center mb-12 max-w-md mx-auto">
          <div className="flex items-center w-full relative">
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-tighter mt-2 text-emerald-400 font-bold">Register</span>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-emerald-500 to-primary-500 mx-2 mb-2" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-[#020617] shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)] animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-tighter mt-2 text-primary font-bold">Success</span>
            </div>
            <div className="flex-1 h-[2px] bg-slate-800 mx-2 mb-2" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <Zap className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-[10px] uppercase tracking-tighter mt-2 text-slate-500">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Main Glassmorphism Card */}
        <div className="group relative transition-all duration-500 hover:-translate-y-1">
          {/* Subtle Glow Backdrop */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl opacity-50 transition-opacity group-hover:opacity-100" />

          <div className="relative backdrop-blur-[20px] bg-white/5 border border-white/10 p-8 lg:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden">
            {/* Success Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Registration <span className="bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">Successful!</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
                Welcome aboard, <span className="text-white font-semibold underline decoration-emerald-500/50 underline-offset-4">{userData.name}</span>. Your academy account is now active.
              </p>
            </div>

            {/* Social Proof Banner */}
            <div className="flex items-center justify-center gap-2 mb-10 py-2 px-4 bg-emerald-500/5 border border-emerald-500/10 rounded-full w-fit mx-auto animate-bounce">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#020617] bg-slate-700 flex items-center justify-center">
                    <User className="w-3 h-3 text-slate-300" />
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Join 1,000+ Students Already Learning</p>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Credentials Section */}
              <div className="lg:col-span-3 space-y-6">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900/50 border border-white/5 p-6 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Security Credentials</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Save these to your password manager</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="group/field">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Login Email</label>
                      <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-4 rounded-2xl group-hover/field:border-primary/50 transition-colors">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <span className="flex-1 font-mono font-bold text-slate-200">{userData.email}</span>
                        <button
                          onClick={() => copyToClipboard(userData.email, "Email")}
                          className="p-2 hover:bg-white/10 rounded-xl transition-all"
                        >
                          <Copy className="w-4 h-4 text-primary" />
                        </button>
                      </div>
                    </div>

                    <div className="group/field">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Academy Password</label>
                      <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-4 rounded-2xl group-hover/field:border-primary/50 transition-colors">
                        <Key className="w-5 h-5 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={userData.password}
                          readOnly
                          className="flex-1 bg-transparent font-mono font-bold text-slate-200 focus:outline-none"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(userData.password || "", "Password")}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all"
                          >
                            <Copy className="w-4 h-4 text-primary" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                    <Shield className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-200/80 leading-relaxed font-semibold uppercase tracking-tight">
                      For your safety, please check your inbox for the verification link. Account access will be limited until verified.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DetailRow icon={User} label="Full Name" value={userData.name} />
                  <DetailRow icon={Phone} label="Mobile" value={userData.phone} />
                  <DetailRow icon={Globe} label="Country" value={userData.country || "India"} />
                  <DetailRow icon={Calendar} label="DOB" value={userData.dob || "-"} />
                </div>
              </div>

              {/* Package Side Card */}
              <div className="lg:col-span-2">
                {selectedPlan ? (
                  <div className={`h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${selectedPlan.color} p-[2px]`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
                    <div className="h-full bg-slate-950/80 backdrop-blur-xl rounded-[1.9rem] p-8 flex flex-col">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedPlan.color} flex items-center justify-center shadow-2xl mb-6`}>
                        <selectedPlan.icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase mb-1">Elite Package</p>
                      <h3 className="text-3xl font-black text-white mb-2">{selectedPlan.name}</h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-8">{selectedPlan.price}</p>

                      <div className="space-y-4 flex-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">Included Benefits</p>
                        {selectedPlan.benefits.slice(0, 4).map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="p-1 rounded-full bg-emerald-500/20 mt-1">
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                            <span className="text-sm text-slate-300 font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Package Status</p>
                        <p className="text-xs text-amber-400 font-bold mt-1">Awaiting Activation</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full rounded-[2rem] bg-slate-900 border border-white/5 p-8 flex flex-col items-center justify-center text-center">
                    <Trophy className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 text-sm italic">No specific plan selected yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Trust Badges & Secure Footer */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Data Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Privacy Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="flex-[2]">
                <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)] font-black uppercase tracking-widest group/btn">
                  Start My Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full h-16 rounded-2xl border-white/10 hover:bg-white/5 text-slate-400 hover:text-white font-black uppercase tracking-widest">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="group/row flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
    <div className="p-2 rounded-lg bg-slate-800 group-hover/row:bg-primary/20 transition-colors">
      <Icon className="w-4 h-4 text-slate-500 group-hover/row:text-primary transition-colors" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{label}</p>
      <p className="font-bold text-slate-200 text-xs truncate">{value || '-'}</p>
    </div>
  </div>
);

export default RegistrationSuccess;
