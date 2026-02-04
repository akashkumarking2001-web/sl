import { Link, useNavigate } from "react-router-dom";
import { Bell, ShoppingCart, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const NativeHeader = ({ title }: { title: string }) => {
    const { user, signOut } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const isNative = Capacitor.isNativePlatform();

    if (!isNative && window.innerWidth > 768) return null;

    const handleAction = async (path: string) => {
        if (isNative) await Haptics.impact({ style: ImpactStyle.Light });
        navigate(path);
    };

    return (
        <header className="sticky top-0 z-[60] w-full bg-background/80 backdrop-blur-xl border-b border-border safe-top">
            <div className="flex items-center justify-between h-14 px-4">
                <h1 className="text-lg font-bold tracking-tight text-foreground truncate max-w-[150px]">
                    {title}
                </h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleAction("/search")}
                        className="p-2 rounded-full hover:bg-muted"
                    >
                        <Search className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <button
                        onClick={() => handleAction("/shopping/cart")}
                        className="relative p-2 rounded-full hover:bg-muted"
                    >
                        <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                        {totalItems > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
                                {totalItems}
                            </Badge>
                        )}
                    </button>

                    <button
                        onClick={() => handleAction("/dashboard/profile")}
                        className="p-1 rounded-full border border-primary/20 overflow-hidden"
                    >
                        <div className="w-7 h-7 bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default NativeHeader;
