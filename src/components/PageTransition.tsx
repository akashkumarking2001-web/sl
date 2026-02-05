import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);

    // After a brief delay, swap content and fade in
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1)",
        isTransitioning
          ? "opacity-0 translate-x-4 scale-[0.98] blur-sm"
          : "opacity-100 translate-x-0 scale-100 blur-0"
      )}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
