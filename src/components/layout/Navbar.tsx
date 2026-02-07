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
  const isMobile = window.innerWidth <= 768;
  const isPublicPath = ["/", "/login", "/register", "/admin-login", "/admin-forgot-password", "/reset-password"].includes(location.pathname);

  // Hide traditional web navbar on mobile for logged-in users to use Bottom Navigation instead
  if ((isNative || isMobile) && user && !isPublicPath && !location.pathname.includes('/admin')) return null;

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

  const navLinks = [
    { name: "Home", href: user ? "/user-home" : "/", icon: Home },
    { name: "Store", href: "/shopping", icon: ShoppingBag },
    { name: "Courses", href: "/#courses", icon: BookOpen },
    { name: "About", href: "/#about", icon: Info },
    { name: "Contact", href: "/#contact", icon: Mail },
  ];

  const shoppingLinks = [
    { name: "Back to Home", href: user ? "/user-home" : "/", icon: Home },
    { name: "Marketplace", href: "/shopping", icon: ShoppingBag },
  ];

  const activeLinks = isShoppingPage ? shoppingLinks : navLinks;

  return (
    <>
      <nav
        data-testid="main-nav"
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out",
          scrolled
            ? "bg-white dark:bg-slate-950 shadow-[0_4px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-border/50 py-2"
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src={logo}
                alt="Skill Learners"
                className="h-11 md:h-14 w-auto transition-all duration-500 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Mid Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {activeLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.href.startsWith("/#") && isIndexPage);
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className={cn(
                      "relative px-1 py-1.5 text-[14px] font-medium tracking-normal transition-colors duration-500 group",
                      isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {/* Elegant center-growing underline */}
                    <div className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-primary transition-all duration-500 ease-out",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </button>
                );
              })}
            </div>

            {/* Desktop End Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle variant="icon" />

              {!isShoppingPage && (
                <Link to="/shopping" className="relative group">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/8 hover:text-primary transition-all duration-500">
                    <ShoppingBag className="w-[18px] h-[18px]" />
                  </Button>
                </Link>
              )}

              {isShoppingPage && (
                <Link to="/shopping/cart" className="relative group">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/8 hover:text-primary transition-all duration-500">
                    <ShoppingCart className="w-[18px] h-[18px]" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-[18px] w-[18px] p-0 flex items-center justify-center bg-primary text-primary-foreground text-[9px] font-medium border-2 border-background rounded-full">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-lg h-9 px-4 gap-2 font-medium text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 active:scale-[0.98] shadow-sm hover:shadow-md">
                      <UserIcon className="w-[15px] h-[15px]" />
                      <span>Account</span>
                      <ChevronDown className="w-3 h-3 opacity-60 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl">
                    <DropdownMenuItem onClick={() => navigate("/user-home")} className="rounded-lg p-2.5 cursor-pointer hover:bg-primary/8 font-medium text-[13px] transition-colors duration-300">
                      <LayoutDashboard className="w-4 h-4 mr-2.5 text-primary" />
                      Dashboard
                    </DropdownMenuItem>
                    {isShoppingPage && (
                      <DropdownMenuItem onClick={() => navigate("/dashboard/orders")} className="rounded-lg p-2.5 cursor-pointer hover:bg-primary/8 font-medium text-[13px] transition-colors duration-300">
                        <ShoppingCart className="w-4 h-4 mr-2.5 text-primary" />
                        My Orders
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="rounded-lg p-2.5 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/8 font-medium text-[13px] transition-colors duration-300">
                        <Shield className="w-4 h-4 mr-2.5" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="my-1.5 bg-border/40" />
                    <DropdownMenuItem onClick={() => signOut()} className="rounded-lg p-2.5 cursor-pointer text-destructive hover:bg-destructive/8 font-medium text-[13px] transition-colors duration-300">
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" className="h-9 px-4 text-[13px] font-medium text-foreground/70 hover:text-foreground hover:bg-primary/8 rounded-lg transition-all duration-500">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="h-9 px-5 text-[13px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all duration-500 active:scale-[0.98] shadow-sm hover:shadow-md">
                      Join Now
                    </Button>
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
          {/* Sidebar Header - Clean Logo Integration */}
          <div className="p-8 pb-4 flex items-center justify-between">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <img src={logo} alt="Skill Learners" className="h-10 w-auto" />
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="px-8 py-2">
            <div className="h-[1px] w-full bg-border/50" />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-3 mb-2">Main Navigation</p>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-primary/5 transition-all group active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <link.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm transition-colors group-hover:text-primary">{link.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {user ? (
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-3 mb-2">Quick Access</p>
                <nav className="space-y-1">
                  <button
                    onClick={() => handleNavClick("/user-home")}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-emerald-500/5 transition-all group active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm group-hover:text-emerald-500">My Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("/shopping")}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-blue-500/5 transition-all group active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm group-hover:text-blue-500">Shop Marketplace</span>
                  </button>
                </nav>
              </div>
            ) : (
              <div className="px-3 space-y-3 mt-4">
                <Button
                  onClick={() => handleNavClick("/login")}
                  className="w-full h-12 rounded-xl bg-primary text-black font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNavClick("/register")}
                  className="w-full h-12 rounded-xl border-border font-black uppercase text-[10px] tracking-widest"
                >
                  Create Account
                </Button>
              </div>
            )}
          </div>

          {/* Logout Section */}
          {user && (
            <div className="p-8 border-t border-border/50">
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-destructive/20 text-destructive font-semibold hover:bg-destructive hover:text-white transition-all active:scale-95"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
