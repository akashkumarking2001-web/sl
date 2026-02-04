import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        verifyToken();
    }, []);

    const verifyToken = async () => {
        if (!token) {
            setStatus("error");
            setMessage("Security token is missing or malformed.");
            return;
        }

        try {
            // call RPC to verify
            const { data, error } = await supabase.rpc("verify_email_token", { token_input: token });

            if (error) throw error;

            if (data?.success) {
                setStatus("success");
            } else {
                setStatus("error");
                setMessage(data?.message || "Link has expired or already been used.");
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            setStatus("error");
            setMessage(error.message || "An unexpected error occurred during verification.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden p-6 selection:bg-primary selection:text-white font-sans">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Skill Learners"
                            className="h-12 w-auto mx-auto drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform"
                        />
                    </Link>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                    {/* Inner Content */}
                    <div className="relative z-10 text-center">
                        {status === "loading" && (
                            <div className="flex flex-col items-center py-10">
                                <div className="relative">
                                    <Loader2 className="w-20 h-20 text-primary animate-spin" />
                                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-pulse" />
                                </div>
                                <h2 className="text-2xl font-black text-white mt-8 tracking-tighter uppercase italic">
                                    Authenticating <span className="text-primary">Terminal...</span>
                                </h2>
                                <p className="text-slate-400 mt-3 font-medium uppercase text-[10px] tracking-[0.3em]">Establishing secure connection</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">
                                    Access <span className="text-emerald-500">Granted!</span>
                                </h1>
                                <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                                    Welcome student. Your digital identity has been verified. Your learning terminal is now fully operational.
                                </p>
                                <Button
                                    onClick={() => navigate("/login")}
                                    className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all group"
                                >
                                    Enter Academy Portal
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-rose-500/20">
                                    <XCircle className="w-12 h-12 text-rose-500" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">
                                    Verification <span className="text-rose-500">Failed</span>
                                </h1>
                                <p className="text-rose-200/50 text-base leading-relaxed mb-10 font-bold uppercase tracking-tight">
                                    {message || "The authentication token has expired or is invalid. Please request a new verification link."}
                                </p>
                                <div className="flex flex-col w-full gap-4">
                                    <Button
                                        onClick={() => navigate("/login")}
                                        variant="outline"
                                        className="h-16 rounded-2xl border-white/10 hover:bg-white/5 text-slate-400 font-black uppercase tracking-widest text-sm"
                                    >
                                        Return to Login
                                    </Button>
                                    <Link to="/" className="text-primary text-[11px] font-black uppercase tracking-widest hover:underline italic">
                                        Contact Academy Support
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secure Footer */}
                <div className="mt-10 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">TLS Secured</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">SOC2 Certified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
