import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, ArrowLeft, CheckCircle, Eye, EyeOff, Lock, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type Step = "email" | "otp" | "success";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendEmailOTP, verifyEmailOTP, updatePassword } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: "Invalid Email",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await sendEmailOTP(email);

      if (error) {
        // Handle specific error for non-existent user
        if (error.message.includes("Signups not allowed")) {
          toast({
            title: "Account Not Found",
            description: "No account exists with this email address.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      setStep("otp");
      toast({
        title: "Code Sent",
        description: "Check your email for the 6-digit verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate OTP
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    // Validate password
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast({
        title: "Invalid Password",
        description: passwordValidation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First verify the OTP - this will sign the user in
      const { error: verifyError } = await verifyEmailOTP(email, otp);

      if (verifyError) {
        toast({
          title: "Invalid Code",
          description: verifyError.message || "The code you entered is invalid or expired. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Now update the password (user is now authenticated)
      const { error: updateError } = await updatePassword(password);

      if (updateError) {
        toast({
          title: "Error",
          description: updateError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setStep("success");
      toast({
        title: "Password Reset",
        description: "Your password has been successfully updated",
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/admin-login");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const { error } = await sendEmailOTP(email);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email",
        });
        setOtp("");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to resend code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case "success":
        return <CheckCircle className="w-10 h-10 text-white" />;
      case "otp":
        return <KeyRound className="w-10 h-10 text-white" />;
      default:
        return <Shield className="w-10 h-10 text-white" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "success":
        return "Password Reset Complete";
      case "otp":
        return "Enter Verification Code";
      default:
        return "Reset Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "success":
        return "You will be redirected to login shortly";
      case "otp":
        return `Enter the 6-digit code sent to ${email}`;
      default:
        return "Enter your admin email to receive a verification code";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-background to-orange-950/10" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Back Button */}
      <Link 
        to="/admin-login" 
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Login
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-card p-8 rounded-3xl border border-red-500/20 bg-card/80 backdrop-blur-xl shadow-2xl shadow-red-500/5">
          {/* Admin Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-xl opacity-50" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                {getStepIcon()}
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {getStepTitle()}
            </h1>
            <p className="text-muted-foreground text-sm">
              {getStepDescription()}
            </p>
          </div>

          {/* Step: Email Input */}
          {step === "email" && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-red-500/50"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-6"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Verification Code
                  </div>
                )}
              </Button>
            </form>
          )}

          {/* Step: OTP + New Password */}
          {step === "otp" && (
            <form onSubmit={handleVerifyAndReset} className="space-y-5">
              {/* OTP Input */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Verification Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-red-500/30" />
                      <InputOTPSlot index={1} className="border-red-500/30" />
                      <InputOTPSlot index={2} className="border-red-500/30" />
                      <InputOTPSlot index={3} className="border-red-500/30" />
                      <InputOTPSlot index={4} className="border-red-500/30" />
                      <InputOTPSlot index={5} className="border-red-500/30" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-red-500/50"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-red-500/50"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-6"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    Reset Password
                  </div>
                )}
              </Button>

              {/* Resend Code */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Didn't receive the code? Resend
                </button>
              </div>

              {/* Back to email step */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400 text-center">
                  Your password has been successfully updated. Redirecting you to login...
                </p>
              </div>
              
              <Link to="/admin-login">
                <Button
                  variant="outline"
                  className="w-full border-red-500/30 hover:bg-red-500/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Login Now
                </Button>
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground">
              {step === "otp" 
                ? "Verification codes expire after 1 hour for security." 
                : "Password reset codes expire after 1 hour for security."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
