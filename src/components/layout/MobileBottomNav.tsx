import { useNavigate, useLocation } from "react-router-dom";
import { Home, PlayCircle, Wallet, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isNative = Capacitor.isNativePlatform();

    // Only show on native platforms or small mobile screens
    if (!isNative && window.innerWidth > 768) return null;

    const navItems = [
        { label: "Home", icon: Home, path: "/user-home" },
        { label: "Courses", icon: PlayCircle, path: "/dashboard/courses" },
        { label: "Store", icon: ShoppingBag, path: "/shopping" },
        { label: "Wallet", icon: Wallet, path: "/dashboard/wallet" },
        { label: "Profile", icon: User, path: "/dashboard/profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-lg border-t border-border pb-safe">
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
