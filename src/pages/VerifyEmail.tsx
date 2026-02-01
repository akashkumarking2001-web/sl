import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            setMessage("Invalid verification link.");
            return;
        }

        try {
            // call RPC to verify
            const { data, error } = await supabase.rpc("verify_email_token", { token_input: token });

            if (error) throw error;

            if (data.success) {
                setStatus("success");
            } else {
                setStatus("error");
                setMessage(data.message || "Verification failed. Link may be expired.");
            }
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center space-y-6">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-bold">Verifying your email...</h2>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
                        <p className="text-muted-foreground mb-6">
                            Your account has been successfully activated. You can now login.
                        </p>
                        <Button onClick={() => navigate("/login")} className="w-full">
                            Go to Login
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
                        <p className="text-muted-foreground mb-6">
                            {message}
                        </p>
                        <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
                            Back to Login
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
