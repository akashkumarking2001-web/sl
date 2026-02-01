import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

interface ThemeToggleProps {
  variant?: "icon" | "switch" | "pill";
  className?: string;
}

const ThemeToggle = ({ variant = "icon", className }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      applyTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", newTheme === "dark");
    }
  };

  const toggleTheme = () => {
    setIsAnimating(true);
    
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const cycleTheme = () => {
    setIsAnimating(true);
    
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const newTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Icon variant - simple button
  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "relative p-2.5 rounded-full bg-muted/50 hover:bg-muted transition-all duration-300 overflow-hidden group",
          className
        )}
        aria-label="Toggle theme"
      >
        {/* Animated background glow */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            isDark 
              ? "bg-gradient-to-tr from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/20 group-hover:to-yellow-500/10" 
              : "bg-gradient-to-tr from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:to-indigo-500/10"
          )}
        />
        
        {/* Sun icon */}
        <Sun 
          className={cn(
            "w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
            isDark 
              ? "rotate-0 scale-100 opacity-100 text-amber-500" 
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
        
        {/* Moon icon */}
        <Moon 
          className={cn(
            "w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
            isDark 
              ? "rotate-90 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100 text-blue-500"
          )}
        />
        
        {/* Invisible placeholder for sizing */}
        <Sun className="w-5 h-5 opacity-0" />
      </button>
    );
  }

  // Switch variant - iOS-style toggle
  if (variant === "switch") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "relative w-16 h-9 rounded-full transition-all duration-500 p-1",
          isDark ? "bg-slate-700" : "bg-blue-100",
          className
        )}
        aria-label="Toggle theme"
      >
        {/* Stars (dark mode) */}
        <div className={cn(
          "absolute inset-1 transition-opacity duration-300",
          isDark ? "opacity-100" : "opacity-0"
        )}>
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
              style={{
                top: `${20 + i * 25}%`,
                left: `${60 + i * 10}%`,
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
        </div>
        
        {/* Cloud (light mode) */}
        <div className={cn(
          "absolute right-2 top-2 w-4 h-2 bg-white rounded-full transition-opacity duration-300",
          isDark ? "opacity-0" : "opacity-60"
        )} />
        
        {/* Toggle knob */}
        <div
          className={cn(
            "relative w-7 h-7 rounded-full shadow-md transition-all duration-500 flex items-center justify-center",
            isDark 
              ? "translate-x-7 bg-slate-800" 
              : "translate-x-0 bg-gradient-to-br from-amber-300 to-orange-400"
          )}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-blue-200" />
          ) : (
            <Sun className="w-4 h-4 text-white" />
          )}
        </div>
      </button>
    );
  }

  // Pill variant - three-way toggle
  return (
    <div 
      className={cn(
        "flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border",
        className
      )}
    >
      {[
        { value: "light" as Theme, icon: Sun, label: "Light" },
        { value: "dark" as Theme, icon: Moon, label: "Dark" },
        { value: "system" as Theme, icon: Monitor, label: "System" },
      ].map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => {
            setIsAnimating(true);
            setTheme(value);
            localStorage.setItem("theme", value);
            applyTheme(value);
            setTimeout(() => setIsAnimating(false), 500);
          }}
          className={cn(
            "relative p-2 rounded-full transition-all duration-300",
            theme === value 
              ? "bg-card text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={label}
        >
          <Icon className={cn(
            "w-4 h-4 transition-transform duration-300",
            theme === value && isAnimating && "animate-[spin_0.5s_ease-out]"
          )} />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
