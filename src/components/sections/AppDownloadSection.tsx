import { Button } from "@/components/ui/button";
import { Smartphone, Shield, Zap, Target } from "lucide-react";
import mockup from "@/assets/mobile_app_mockup.png";

const AppDownloadSection = () => {
    return (
        <section className="relative py-24 overflow-hidden bg-secondary/30">
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

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <a
                                href="#"
                                className="w-full sm:w-auto flex items-center gap-3 px-6 py-3 bg-black text-white rounded-2xl border border-white/10 hover:bg-zinc-900 transition-all duration-300 hover:scale-105 shadow-xl shadow-black/20"
                            >
                                <svg viewBox="0 0 512 512" className="w-7 h-7 fill-current">
                                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm269.2 277.7l58.5 58.5L104.6 499l211.6-121.3zm85.1-101.6l-73 41.9 61.3 61.3 74.1-42.5c15.7-9 22.1-28.5 13.1-44.2-9-15.7-28.5-22.1-44.2-13.1l-1.3.7z" />
                                </svg>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-medium text-zinc-400 leading-none mb-1">Get it on</span>
                                    <span className="text-lg font-bold leading-none">Google Play</span>
                                </div>
                            </a>

                            <a
                                href="#"
                                className="w-full sm:w-auto flex items-center gap-3 px-6 py-3 bg-black text-white rounded-2xl border border-white/10 hover:bg-zinc-900 transition-all duration-300 hover:scale-105 shadow-xl shadow-black/20"
                            >
                                <svg viewBox="0 0 384 512" className="w-7 h-7 fill-current">
                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                </svg>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-medium text-zinc-400 leading-none mb-1">Download on the</span>
                                    <span className="text-lg font-bold leading-none">App Store</span>
                                </div>
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
