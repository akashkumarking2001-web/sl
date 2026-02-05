import { Button } from "@/components/ui/button";
import { Smartphone, Shield, Zap, Target } from "lucide-react";
import mockup from "@/assets/mobile_app_mockup.png";

const AppDownloadSection = () => {
    return (
        <section id="app-download" className="relative py-24 overflow-hidden bg-secondary/30">
            {/* Decorative Orbs */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] translate-x-1/3" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
                            <Smartphone className="w-4 h-4" />
                            NATIVE MOBILE EXPERIENCE
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            Learn & Earn on the Go with <span className="text-gradient">Skill Learners App</span>
                        </h2>

                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Take your learning and affiliate business wherever you go. Our native-grade mobile apps provide lightning-fast performance, real-time notifications, and a seamless interface optimized for your device.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                            {[
                                { icon: Shield, title: "Secure Access", desc: "Biometric login & data encryption" },
                                { icon: Zap, title: "Fast Sync", desc: "Real-time updates across all devices" },
                                { icon: Target, title: "Offline Study", desc: "Access course materials anytime" },
                                { icon: Smartphone, title: "Native UI", desc: "Optimized for iOS & Android" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className="p-3 rounded-xl bg-background border border-border">
                                        <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
                            <a
                                href="/download/android"
                                className="w-full sm:w-auto transition-all duration-300 hover:scale-110 active:scale-95 group"
                            >
                                <img
                                    src="/google-play-badge.png"
                                    alt="Get it on Google Play"
                                    className="h-14 w-auto drop-shadow-xl"
                                />
                            </a>

                            <a
                                href="/download/ios"
                                className="w-full sm:w-auto transition-all duration-300 hover:scale-110 active:scale-95 group"
                            >
                                <img
                                    src="/app-store-badge.png"
                                    alt="Download on the App Store"
                                    className="h-14 w-auto drop-shadow-xl"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Right Mockup */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Decorative Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-[60px] rounded-full scale-75" />

                            <div className="relative glass-card p-4 rounded-[3rem] border-4 border-zinc-800 shadow-2xl animate-float">
                                <img
                                    src={mockup}
                                    alt="App Mockup"
                                    className="w-full max-w-[320px] h-auto rounded-[2.2rem] shadow-inner"
                                />
                            </div>

                            {/* Small floating elements */}
                            <div className="absolute -top-10 -right-10 glass-card p-4 rounded-2xl shadow-xl animate-pulse delay-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-bold">Live Earnings</span>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-10 glass-card p-4 rounded-2xl shadow-xl animate-bounce-slow">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground">App Store Rating</span>
                                    <span className="text-xs font-bold text-amber-500">4.9 ★</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;
