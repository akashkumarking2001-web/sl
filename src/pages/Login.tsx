import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Shield, Sparkles, Users, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { notify } from "@/lib/notifications";
import logo from "@/assets/logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get plan/course from URL params to persist
  const selectedPlan = searchParams.get("plan");
  const selectedCourse = searchParams.get("course");

  // Store plan/course selection in sessionStorage for post-login popup
  useEffect(() => {
    if (selectedPlan) {
      sessionStorage.setItem("selectedPlan", selectedPlan);
    }
    if (selectedCourse) {
      sessionStorage.setItem("selectedCourse", selectedCourse);
    }
  }, [selectedPlan, selectedCourse]);

  // Get the redirect path from location state or default to user-home
  const from = (location.state as any)?.from?.pathname || "/user-home";

  // If already logged in, redirect
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      notify.loginError(error.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    // Get user name from email for personalized greeting
    const userName = formData.email.split("@")[0];
    notify.loginSuccess(userName);

    // Navigate to the intended page or user home
    navigate(from, { replace: true });
  };

  const features = [
    { icon: Shield, text: "Secure & Encrypted Login" },
    { icon: Users, text: "Join 10,000+ Active Learners" },
    { icon: Sparkles, text: "Unlock Premium Courses" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-background overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-gradient-to-br from-accent/15 to-accent/5 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-gradient-gold opacity-10 blur-3xl animate-pulse delay-500" />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          <Link to="/" className="mb-12 relative inline-block">
            <div className="absolute inset-0 bg-primary/25 blur-2xl rounded-full" />
            <img src={logo} alt="Skill Learners" className="relative h-20 w-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
          </Link>
          
          <h1 className="text-4xl xl:text-5xl font-bold font-display mb-6 leading-tight">
            Welcome Back to{" "}
            <span className="text-gradient-gold">Skill Learners</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-md">
            Continue your journey to financial freedom. Your courses and community await.
          </p>
          
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 group hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Glassmorphic Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-background via-background to-muted/30 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <img src={logo} alt="Skill Learners" className="relative h-16 w-auto mx-auto mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
            </Link>
            <h1 className="text-2xl font-bold font-display">
              Welcome Back <span className="text-gradient-gold">!</span>
            </h1>
          </div>

          {/* Glass Card Form */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[2rem] blur-xl opacity-50" />
            
            <div className="relative glass-card p-8 md:p-10 rounded-3xl border border-border/50 backdrop-blur-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Lock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold font-display">Login to Your Account</h2>
                <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-card/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all backdrop-blur-sm placeholder:text-muted-foreground/50"
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-card/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all pr-12 backdrop-blur-sm placeholder:text-muted-foreground/50"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <Link to="/forgot" className="text-sm text-primary hover:underline font-medium">
                    Forgot Password?
                  </Link>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <p className="text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-semibold hover:underline">
                    Create Account
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Back to Home */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="hover:text-primary transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
