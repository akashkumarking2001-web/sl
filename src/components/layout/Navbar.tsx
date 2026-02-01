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
  { name: "About", href: "/#about", icon: Info },
  { name: "Contact", href: "/#contact", icon: Mail },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { totalItems } = useCart();

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

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          scrolled
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl shadow-xl border-b border-gray-200/50 dark:border-gray-800/50 py-3"
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
                className="h-10 md:h-12 w-auto transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Mid Navigation - Standard Menu Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    "relative text-sm font-bold tracking-wide transition-all duration-300 group py-2",
                    location.pathname === link.href || (link.href.startsWith("/#") && isIndexPage)
                      ? "text-[#FBBF24]"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#FBBF24] dark:hover:text-[#FBBF24]"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-[#FBBF24] transform origin-left transition-transform duration-300",
                    location.pathname === link.href || (link.href.startsWith("/#") && isIndexPage)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </button>
              ))}
            </div>

            {/* Desktop End Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle variant="icon" />

              {!isIndexPage && (
                <Link to="/shopping" className="relative group">
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full hover:bg-[#FBBF24]/10 hover:text-[#FBBF24] transition-all duration-300">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#FBBF24] text-black text-[10px] font-black border-2 border-white">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-full h-11 px-4 gap-2 font-bold shadow-lg shadow-[#FBBF24]/20 bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <span className="hidden xl:inline">Account</span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
                    <DropdownMenuItem onClick={() => navigate("/user-home")} className="rounded-xl p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                      <LayoutDashboard className="w-4 h-4 mr-3 text-[#FBBF24]" />
                      Dashboard
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="rounded-xl p-3 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10">
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-800/50 my-2" />
                    <DropdownMenuItem onClick={() => signOut()} className="rounded-xl p-3 cursor-pointer text-destructive hover:bg-destructive/10">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-4 ml-2">
                  <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#FBBF24] transition-colors">
                    Login
                  </Link>
                  <Link to="/register">
                    <Button className="rounded-full font-bold shadow-lg shadow-[#FBBF24]/20 bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 hover:scale-105 transition-all px-6">Join Now</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle variant="icon" />
              {!isIndexPage && (
                <Link to="/shopping" className="relative">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[#FBBF24] text-black text-[8px] font-black border-2 border-white">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 relative z-[60]"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu (Amazon/Flipkart Style) */}
      <div
        className={cn(
          "fixed inset-0 z-[90] lg:hidden transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-card shadow-2xl transition-transform duration-500 ease-out flex flex-col",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-6 bg-gradient-to-br from-[#FBBF24] to-black text-white">
            <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg">Hello,</h3>
                <p className="text-sm opacity-80">{user?.email?.split('@')[0] || 'Guest Visitor'}</p>
              </div>
            </div>
            {!user && (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button size="sm" variant="secondary" className="w-full font-bold">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full font-bold bg-white text-primary hover:bg-white/90">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-6 mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Navigation</h4>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <link.icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold">{link.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 border-t pt-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Personal</h4>
              <div className="space-y-1">
                {user && (
                  <button
                    onClick={() => handleNavClick("/user-home")}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <span className="font-bold">My Dashboard</span>
                  </button>
                )}
                <button
                  onClick={() => handleNavClick("/shopping")}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="font-bold">My Orders</span>
                </button>
              </div>
            </div>
          </div>

          {user && (
            <div className="p-6 border-t">
              <Button
                variant="outline"
                className="w-full rounded-xl border-destructive/30 text-destructive font-black"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;