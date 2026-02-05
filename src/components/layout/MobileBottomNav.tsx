import { useNavigate, useLocation } from "react-router-dom";
import { Home, PlayCircle, Wallet, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const isNative = Capacitor.isNativePlatform() || ['8080', '5174'].includes(window.location.port);

    // Visibility logic: Only after login and not on landing/auth pages
    const publicPaths = ["/", "/login", "/register", "/admin-login", "/admin-forgot-password", "/reset-password"];
    const isPublicPath = publicPaths.includes(location.pathname);

    const hasUnlockedWallet = !!(profile?.purchased_plan && profile.purchased_plan !== "");

    useEffect(() => {
        if (!isNative || !user || isPublicPath) return;

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Logic: Hide when near bottom (footer area) to prevent overlap
            const isNearBottom = windowHeight + currentScrollY >= documentHeight - 300;

            setIsVisible(!isNearBottom);
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isNative, user, isPublicPath]);

    // Render check moved AFTER all hooks
    if (!isNative || !user || isPublicPath) return null;

    const navItems = [
        { label: "Home", icon: Home, path: "/user-home" },
        { label: "Courses", icon: PlayCircle, path: "/dashboard/courses" },
        { label: "Store", icon: ShoppingBag, path: "/shopping" },
        ...(hasUnlockedWallet ? [{ label: "Wallet", icon: Wallet, path: "/dashboard/wallet" }] : []),
        { label: "Profile", icon: User, path: "/dashboard/profile" },
    ];

    return (
        <div
            className={cn(
                "fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[350px] z-[100] transition-all duration-500 md:hidden",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
            )}
        >
            <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex justify-evenly items-center h-16 px-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/user-home' && location.pathname.startsWith(item.path.split('/dashboard')[1] || item.path));
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "relative flex flex-col items-center justify-center min-w-[50px] transition-all duration-300 group",
                                isActive ? "text-primary scale-110" : "text-gray-500"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-all duration-300",
                                isActive ? "drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : ""
                            )} strokeWidth={isActive ? 2.5 : 2} />

                            <span className={cn(
                                "text-[8px] font-black tracking-tighter transition-all duration-300 mt-0.5",
                                isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                            )}>
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
