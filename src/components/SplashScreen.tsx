import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Start animation after a tiny delay
        const animTimer = setTimeout(() => setIsAnimating(true), 100);

        // This component is controlled by App.tsx, but we can have internal exit logic if needed
        return () => clearTimeout(animTimer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#0A0A0B] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out">
            <div className="relative flex flex-col items-center">
                {/* Logo with pulse/glow effect */}
                <div className={cn(
                    "relative w-32 h-32 md:w-40 md:h-40 transition-all duration-1000 ease-out transform",
                    isAnimating ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 rotate-12"
                )}>
                    {/* Glowing background ring */}
                    <div className="absolute inset-x-0 inset-y-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                    <div className="absolute inset-[-10px] rounded-full border-4 border-primary/10 border-t-primary animate-spin-slow" />

                    <img
                        src={logo}
                        alt="Skill Learners"
                        className="relative z-10 w-full h-full object-contain invert dark:invert-0 drop-shadow-2xl"
                    />
                </div>

                {/* Branded Text */}
                <div className={cn(
                    "mt-8 flex flex-col items-center transition-all duration-1000 delay-300",
                    isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}>
                    <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                        SKILL <span className="text-primary not-italic">LEARNERS</span>
                    </h1>
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mt-2">
                        Empowering Your Future
                    </p>
                </div>

                {/* Loading indicator - Apple-style activity indicator */}
                <div className="mt-12 flex items-center justify-center gap-2">
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div
                                key={i}
                                className="w-1 h-3 bg-slate-300 dark:bg-white/20 rounded-full animate-ios-spinner"
                                style={{
                                    transform: `rotate(${i * 45}deg) translateY(-8px)`,
                                    animationDelay: `${i * 0.1}s`,
                                    position: 'absolute'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Tagline */}
            <div className="absolute bottom-12 text-center">
                <p className="text-[10px] font-bold text-slate-300 dark:text-zinc-600 uppercase tracking-widest">
                    Skill Learners Academy • iOS Edition
                </p>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                @keyframes ios-spinner {
                    0% { opacity: 1; }
                    100% { opacity: 0.2; }
                }
                .animate-ios-spinner {
                    animation: ios-spinner 0.8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
