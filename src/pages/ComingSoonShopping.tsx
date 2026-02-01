import { Sparkles, TrendingUp, DollarSign, Package, Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";

const ComingSoonShopping = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <Navbar />

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Animated Icon */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-primary to-accent p-8 rounded-full">
                            <Rocket className="w-24 h-24 text-white animate-bounce" />
                        </div>
                    </div>

                    {/* Main Heading */}
                    <div className="space-y-4">
                        <Badge className="bg-primary/20 text-primary border-primary/30 px-6 py-2 text-lg">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Coming Very Soon
                        </Badge>

                        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
                            Premium Shopping
                            <br />
                            Experience
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                            We're launching an incredible shopping platform with exclusive benefits just for you!
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="glass-card p-8 rounded-3xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Affiliate Commissions</h3>
                            <p className="text-muted-foreground">
                                Earn up to 10% commission on every sale you refer
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-3xl border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">New Income Streams</h3>
                            <p className="text-muted-foreground">
                                Multiple ways to earn while you shop and share
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-3xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Premium Products</h3>
                            <p className="text-muted-foreground">
                                Exclusive deals on high-quality products at lowest prices
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="text-3xl font-black text-primary">67+</div>
                            <div className="text-sm text-muted-foreground">Products Ready</div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="text-3xl font-black text-accent">10%</div>
                            <div className="text-sm text-muted-foreground">Commission Rate</div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="text-3xl font-black text-primary">6</div>
                            <div className="text-sm text-muted-foreground">Categories</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 space-y-4">
                        <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            Get notified when we launch
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        </p>
                        <Button size="lg" className="rounded-full px-12 py-6 text-lg font-bold shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300">
                            <Sparkles className="w-5 h-5 mr-2" />
                            Stay Tuned
                        </Button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-sm text-muted-foreground mt-8 italic">
                        🚀 Launching Soon • Premium Quality • Instant Cashback • Affiliate Rewards
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonShopping;
