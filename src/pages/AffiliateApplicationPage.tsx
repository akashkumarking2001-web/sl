import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TrendingUp,
    Users,
    DollarSign,
    Gift,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Target,
    BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";

const AffiliateApplicationPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: user?.email || "",
        phone: "",
        address: "",
        whyJoin: "",
        experience: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to apply for the affiliate program.",
                variant: "destructive",
            });
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const { error } = await (supabase as any)
                .from("affiliate_applications")
                .insert({
                    user_id: user.id,
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    why_join: formData.whyJoin,
                    experience: formData.experience,
                    status: "pending"
                });

            if (error) {
                if (error.code === '23505') {
                    toast({
                        title: "Application Exists",
                        description: "You have already submitted an application.",
                    });
                    setApplicationStatus("pending");
                } else {
                    throw error;
                }
            } else {
                toast({
                    title: "Application Submitted!",
                    description: "Your application is under review. We'll notify you soon.",
                });
                setApplicationStatus("pending");
            }
        } catch (error: any) {
            console.error("Error submitting application:", error);
            toast({
                title: "Error",
                description: "Failed to submit application. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (applicationStatus === "pending") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
                <Navbar />
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-amber-500" />
                        </div>
                        <h1 className="text-4xl font-black mb-4">Application Submitted!</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Thank you for applying to our affiliate program. Our team will review your application and get back to you within 24-48 hours.
                        </p>
                        <div className="glass-card p-6 rounded-2xl mb-8">
                            <h3 className="font-bold mb-4">What happens next?</h3>
                            <div className="space-y-3 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold">1</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Application Review</p>
                                        <p className="text-sm text-muted-foreground">Our team reviews your application</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold">2</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Approval Notification</p>
                                        <p className="text-sm text-muted-foreground">You'll receive an email notification</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold">3</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Start Earning</p>
                                        <p className="text-sm text-muted-foreground">Generate links and earn commissions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => navigate("/dashboard")}>
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border/50">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                <div className="container mx-auto px-4 py-16 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Join Our Affiliate Program
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            Earn While You Share
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Turn your influence into income. Earn 10% commission on every sale you refer.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left: Benefits */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-black mb-6">Why Join Our Program?</h2>
                        </div>

                        <Card className="glass-card p-6 border-primary/20">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <DollarSign className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">10% Commission</h3>
                                    <p className="text-muted-foreground">
                                        Earn 10% on every sale made through your referral links. No limits on earnings!
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="glass-card p-6 border-primary/20">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Target className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Easy to Use</h3>
                                    <p className="text-muted-foreground">
                                        Generate unique links for any product with one click. Share anywhere!
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="glass-card p-6 border-primary/20">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                    <BarChart3 className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Real-Time Analytics</h3>
                                    <p className="text-muted-foreground">
                                        Track clicks, conversions, and earnings in your dedicated dashboard.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="glass-card p-6 border-primary/20">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                    <Gift className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Instant Payouts</h3>
                                    <p className="text-muted-foreground">
                                        Commissions are credited to your wallet immediately upon order delivery.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6">
                            <div className="text-center glass-card p-4 rounded-xl">
                                <div className="text-2xl font-black text-primary">10%</div>
                                <div className="text-xs text-muted-foreground">Commission</div>
                            </div>
                            <div className="text-center glass-card p-4 rounded-xl">
                                <div className="text-2xl font-black text-primary">63+</div>
                                <div className="text-xs text-muted-foreground">Products</div>
                            </div>
                            <div className="text-center glass-card p-4 rounded-xl">
                                <div className="text-2xl font-black text-primary">24h</div>
                                <div className="text-xs text-muted-foreground">Approval</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Application Form */}
                    <div>
                        <Card className="glass-card p-8 border-primary/20">
                            <h2 className="text-2xl font-black mb-6">Apply Now</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Full Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="John Doe"
                                        className="bg-background/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Email Address *
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="bg-background/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Phone Number
                                    </label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 234 567 8900"
                                        className="bg-background/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Address
                                    </label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="City, Country"
                                        className="bg-background/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Why do you want to join? *
                                    </label>
                                    <Textarea
                                        required
                                        value={formData.whyJoin}
                                        onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                                        placeholder="Tell us about your motivation..."
                                        className="bg-background/50 min-h-[100px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Previous Experience (Optional)
                                    </label>
                                    <Textarea
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        placeholder="Any affiliate marketing or sales experience..."
                                        className="bg-background/50 min-h-[100px]"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        "Submitting..."
                                    ) : (
                                        <>
                                            Submit Application
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    By submitting, you agree to our affiliate program terms and conditions.
                                </p>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliateApplicationPage;
