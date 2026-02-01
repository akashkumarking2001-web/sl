import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    CheckCircle2, ArrowRight, Shield, Crown, Sparkles, TrendingUp,
    DollarSign, Zap, Target, BookOpen, Star, ArrowLeft, Users, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { packages, incomeTypes } from "@/data/packages";

const PackageDetailPage = () => {
    const { packageId } = useParams<{ packageId: string }>();
    const navigate = useNavigate();

    // Find package by name (case insensitive)
    const pkg = packages.find(p => p.name.toLowerCase() === packageId?.toLowerCase());

    // Update SEO Title
    useEffect(() => {
        if (pkg) {
            document.title = `${pkg.name} Package - Skill Learners Academy`;
        }
    }, [pkg]);


    if (!pkg) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
                <Button onClick={() => navigate("/")}>Return Home</Button>
            </div>
        );
    }

    const isPopular = pkg.popular;
    const gradient = pkg.color; // e.g., "from-amber-400 to-orange-500"

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-28 pb-20 relative overflow-hidden bg-slate-900 text-white">
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-10`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />

                <div className="container relative mx-auto px-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Packages
                    </button>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-6 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                                <Crown className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-200 uppercase tracking-wider text-xs font-bold">{pkg.displayName} Tier</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black font-display leading-tight">
                                The <span className={`bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>{pkg.name}</span> Package
                            </h1>

                            <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
                                {pkg.description}. Unlock {pkg.features.length}+ premium features, advanced courses, and {incomeTypes.length} income streams.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button
                                    onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
                                    size="xl"
                                    className={`h-14 px-8 text-lg font-bold rounded-xl bg-gradient-to-r ${pkg.color} text-white shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105 transition-all w-full sm:w-auto`}
                                >
                                    Get Started Now
                                </Button>
                                <div className="flex items-center gap-4 px-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-slate-400">Join 2,000+ others</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Card */}
                        <div className="relative animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
                            <div className={`absolute inset-0 bg-gradient-to-r ${pkg.color} blur-[100px] opacity-30`} />
                            <div className="relative glass-card border-white/10 bg-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl border border-white/10">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <pkg.icon className="w-64 h-64 text-white" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center shadow-lg`}>
                                            <pkg.icon className="w-8 h-8 text-white" />
                                        </div>
                                        {isPopular && (
                                            <div className="px-4 py-1.5 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                                Best Value
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <h3 className="text-2xl font-bold text-white">Value Breakdown</h3>
                                        <ul className="space-y-3">
                                            <li className="flex justify-between text-slate-300">
                                                <span>Course Content Value</span>
                                                <span className="font-mono decoration-slate-500/50 line-through">₹{pkg.mrp}</span>
                                            </li>
                                            <li className="flex justify-between text-slate-300">
                                                <span>Income Potential</span>
                                                <span className="font-mono text-emerald-400">Unlimited</span>
                                            </li>
                                            <li className="flex justify-between pt-4 border-t border-white/10 text-xl font-bold text-white">
                                                <span>Your Price</span>
                                                <span>₹{pkg.price}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Educational Value */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black font-display text-slate-900 mb-4">What You Will Learn</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            This package is designed to verify real-world skills. Here is a breakdown of the educational value.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Mock Educational Modules based on Tier */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Core Foundations</h3>
                            <p className="text-slate-500 mb-4">Master the basics of digital marketing, affiliate systems, and social media growth.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 10+ Video Lessons
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Practical Assignments
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Business Strategy</h3>
                            <p className="text-slate-500 mb-4">Learn how to scale a business, manage teams, and optimize revenue streams.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Case Studies
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Growth Hacking
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Technical Mastery</h3>
                            <p className="text-slate-500 mb-4">Hands-on tools training for automation, content creation, and analytics.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Software Guides
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automation Scripts
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Money Making / Income Potential */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full text-sm font-bold text-emerald-700 mb-4">
                            <DollarSign className="w-4 h-4" />
                            <span className="uppercase tracking-wide">Monetization Ready</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black font-display text-slate-900 mb-4">Your Earning Potential</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            This isn't just a course; it's a business in a box. Here is how you can earn with the {pkg.name} package.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {incomeTypes.slice(0, pkg.id + 2).map((income, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${income.iconColor} flex items-center justify-center shrink-0 text-white`}>
                                    <income.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{income.name}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{income.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-8 md:p-12 text-center">
                            <h2 className="text-3xl font-black text-white mb-8">Why Choose Us?</h2>
                            <div className="grid grid-cols-2 gap-8 text-left max-w-lg mx-auto bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Standard</p>
                                    <ul className="space-y-3 text-slate-400 text-sm">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> High Costs (₹{pkg.mrp}+)</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Theory Only</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> No Earning Support</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Limited Access</li>
                                    </ul>
                                </div>
                                <div className="space-y-4 pl-8 border-l border-white/10">
                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Skill Learners</p>
                                    <ul className="space-y-3 text-white font-medium text-sm">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Affordable (₹{pkg.price})</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Practical Skills</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Guaranteed Income Ops</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {pkg.period === 'lifetime' ? 'Lifetime' : 'Extended'} Access</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section id="enroll" className="py-20 bg-slate-50 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-3xl font-black text-slate-900 mb-6">Ready to Transform Your Future?</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Join the {pkg.name} plan today and start your journey towards financial freedom and skill mastery.
                    </p>

                    <div className="p-6 bg-white rounded-2xl shadow-xl border border-slate-100 mb-8">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                            <span className="font-medium text-slate-600">Plan Selected</span>
                            <span className="font-bold text-slate-900">{pkg.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-black">
                            <span>Total Payable</span>
                            <span className="text-emerald-600">₹{pkg.price}</span>
                        </div>
                    </div>

                    <Link to={`/register?plan=${pkg.name}`}>
                        <Button size="xl" className={`w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r ${pkg.color} shadow-xl hover:scale-105 transition-transform`}>
                            Proceed to Registration
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                    <p className="mt-4 text-xs text-slate-400">
                        By clicking proceed, you agree to our Terms & Conditions.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PackageDetailPage;
