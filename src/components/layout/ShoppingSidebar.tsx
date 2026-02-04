import { Link, useLocation } from "react-router-dom";
import {
    Home,
    ShoppingBag,
    ShoppingCart,
    Heart,
    User,
    Users,
    MapPin,
    Wallet,
    Menu,
    X,
    CreditCard,
    Package
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const shoppingMenuSections = [
    {
        label: "Store",
        items: [
            { icon: Home, label: "Shop Home", href: "/shopping", description: "Browse products" },
            { icon: ShoppingBag, label: "My Orders", href: "/dashboard/orders", description: "Track your purchases" },
            { icon: ShoppingCart, label: "My Cart", href: "/shopping/cart", description: "View cart items" },
            { icon: Heart, label: "Wishlist", href: "/dashboard/wishlist", description: "Saved items" },
        ]
    },
    {
        label: "Account",
        items: [
            { icon: Wallet, label: "Shopping Wallet", href: "/dashboard/shopping-wallet", description: "Balance & Credits" },
            { icon: Users, label: "Affiliate Center", href: "/dashboard/affiliate", description: "Commissions & Links" },
            { icon: MapPin, label: "Addresses", href: "/dashboard/addresses", description: "Manage delivery info" },
            { icon: User, label: "Shopping Profile", href: "/dashboard/shopping-profile", description: "Preferences & Settings" },
        ]
    }
];

interface ShoppingSidebarProps {
    children: React.ReactNode;
}

const ShoppingSidebar = ({ children }: ShoppingSidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (href: string) => location.pathname === href;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-[90] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-card/95 backdrop-blur-xl border-r border-border z-[100]
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="Skill Learners" className="h-10 w-auto" />
                        <span className="font-bold text-lg hidden md:block">Shopping</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-4">
                    {shoppingMenuSections.map((section, sIndex) => (
                        <div key={sIndex} className="space-y-1">
                            {sIndex > 0 && <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 mx-2" />}

                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive(item.href)
                                            ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <div className="flex-1">
                                            <span className="block">{item.label}</span>
                                            <span className={`text-[10px] block leading-tight ${isActive(item.href) ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                {item.description}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Quick Stats or Promo */}
                <div className="p-4 mt-auto border-t border-border">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                                <Package className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Active Orders</p>
                                <p className="text-sm font-bold">Check Status</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to="/dashboard/orders">Track Orders</Link>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-[40] bg-card/80 backdrop-blur-xl border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                        <Link to="/shopping">
                            <span className="font-bold text-lg">Skill Learners Shop</span>
                        </Link>
                        <Link to="/dashboard/shopping-profile">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <User className="w-4 h-4 text-primary-foreground" />
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ShoppingSidebar;
