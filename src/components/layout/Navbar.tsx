import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Shield,
  ShoppingCart,
  Search,
  User as UserIcon,
  ChevronDown,
  Home,
  ShoppingBag,
  BookOpen,
  Info,
  Mail,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Store", href: "/shopping", icon: ShoppingBag },
  { name: "Courses", href: "/#courses", icon: BookOpen },
  { name: "Affiliate", href: "/affiliate/apply", icon: UserIcon },
  { name: "About", href: "/#about", icon: Info },
  { name: "Contact", href: "/#contact", icon: Mail },
];

import { Capacitor } from "@capacitor/core";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { totalItems } = useCart();
  const isNative = Capacitor.isNativePlatform();

  // On Native Mobile, we hide the traditional web navbar to use Bottom Navigation instead
  if (isNative && !location.pathname.includes('/admin')) return null;

  const isIndexPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const id = href.substring(2);
      if (!isIndexPage) {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  const isShoppingPage = location.pathname.startsWith("/shopping");

  const shoppingLinks = [
    { name: "Back to Home", href: "/", icon: Home },
    { name: "Electronics", href: "/shopping?cat=electronics", icon: ShoppingBag },
    { name: "Digital Assets", href: "/shopping?cat=assets", icon: BookOpen },
    { name: "Software", href: "/shopping?cat=software", icon: BookOpen },
  ];

  const activeLinks = isShoppingPage ? shoppingLinks : navLinks;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          scrolled
            ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src={logo}
                alt="Skill Learners"
                className="h-12 md:h-16 w-auto transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Mid Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {activeLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.href.startsWith("/#") && isIndexPage);
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className={cn(
                      "text-sm font-medium tracking-wider transition-all duration-300 hover:text-primary uppercase",
                      isActive
                        ? "text-primary"
                        : "text-black dark:text-white"
                    )}
                  >
                    {link.name}
                  </button>
                );
              })}
            </div>

            {/* Desktop End Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle variant="icon" />

              {!isShoppingPage && (
                <Link to="/shopping" className="relative group">
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <ShoppingBag className="w-5 h-5" />
                  </Button>
                </Link>
              )}

              {isShoppingPage && (
                <Link to="/shopping/cart" className="relative group">
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-black border-2 border-background">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-full h-11 px-5 gap-2 font-black shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95">
                      <UserIcon className="w-4 h-4" />
                      Account
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
                    <DropdownMenuItem onClick={() => navigate("/user-home")} className="rounded-xl p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 font-bold">
                      <LayoutDashboard className="w-4 h-4 mr-3 text-primary" />
                      Dashboard
                    </DropdownMenuItem>
                    {isShoppingPage && (
                      <DropdownMenuItem onClick={() => navigate("/dashboard/orders")} className="rounded-xl p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 font-bold">
                        <ShoppingCart className="w-4 h-4 mr-3 text-primary" />
                        My Orders
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="rounded-xl p-3 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10 font-bold">
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-800/50 my-2" />
                    <DropdownMenuItem onClick={() => signOut()} className="rounded-xl p-3 cursor-pointer text-destructive hover:bg-destructive/10 font-bold">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-5 ml-2">
                  <Link to="/login" className="text-sm font-extrabold text-black dark:text-white hover:text-primary transition-colors uppercase tracking-widest">
                    Login
                  </Link>
                  <Link to="/register">
                    <Button className="btn-premium font-bold text-white px-8 py-6 h-auto hover:scale-105 transition-all">Join Now</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Controls - Hamburger for everyone */}
            <div className="flex lg:hidden items-center gap-3">
              <ThemeToggle variant="icon" />
              {isShoppingPage && (
                <Link to="/shopping/cart" className="relative group">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[8px] font-black border-2 border-background">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 relative z-[110]"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={cn(
          "fixed inset-0 z-[95] lg:hidden transition-all duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background shadow-2xl transition-transform duration-500 ease-out flex flex-col",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* User Header */}
          <div className="relative p-8 bg-black dark:bg-slate-900 text-white overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <UserIcon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-xl truncate tracking-tight">{user ? (user.email?.split('@')[0]) : 'Guest Student'}</h3>
                <p className="text-xs text-white/60 font-medium uppercase tracking-widest">{user ? 'Premium Member' : 'Welcome to Academy'}</p>
              </div>
            </div>

            {!user ? (
              <div className="flex gap-3 relative z-10">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button size="lg" variant="secondary" className="w-full font-black rounded-xl">LOGIN</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button size="lg" className="w-full font-black bg-primary text-primary-foreground rounded-xl">JOIN</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 relative z-10">
                <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                  Verified Account
                </div>
              </div>
            )}
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto py-8">
            <div className="px-6 mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-6 px-2">Main Navigation</h4>
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-primary/5 transition-all group active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <link.icon className="w-5 h-5" />
                    </div>
                    <span className="font-black text-sm tracking-wide uppercase transition-colors group-hover:text-primary">{link.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {user && (
              <div className="px-6 pb-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-6 px-2">Earning Portal</h4>
                <nav className="space-y-2">
                  <button
                    onClick={() => handleNavClick("/user-home")}
                    className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-emerald/5 transition-all group active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-emerald group-hover:text-white transition-all duration-300">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <span className="font-black text-sm tracking-wide uppercase group-hover:text-emerald">My Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("/shopping")}
                    className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-blue-500/5 transition-all group active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="font-black text-sm tracking-wide uppercase group-hover:text-blue-500">Shop Marketplace</span>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Logout Section */}
          {user && (
            <div className="p-8 border-t border-border/50">
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-destructive/20 text-destructive font-black hover:bg-destructive hover:text-white transition-all active:scale-95"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                SIGN OUT
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;