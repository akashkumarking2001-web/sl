import { useNavigate, useLocation } from "react-router-dom";
import { Home, PlayCircle, Wallet, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const isNative = Capacitor.isNativePlatform();

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Logic: Hide when near bottom (footer area) to prevent overlap
            const isNearBottom = windowHeight + currentScrollY >= documentHeight - 300; // 300px buffer for footer

            // Also optional: Hide on scroll down, show on scroll up (classic mobile behavior)
            // But user specifically asked about "overlap with footer".

            setIsVisible(!isNearBottom);
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Home", icon: Home, path: "/user-home" },
        { label: "Courses", icon: PlayCircle, path: "/dashboard/courses" },
        { label: "Store", icon: ShoppingBag, path: "/shopping" },
        { label: "Wallet", icon: Wallet, path: "/dashboard/wallet" },
        { label: "Profile", icon: User, path: "/dashboard/profile" },
    ];

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-lg border-t border-border pb-safe transition-transform duration-300 md:hidden",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full transition-all duration-300 gap-1",
                                isActive
                                    ? "text-primary scale-110"
                                    : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
