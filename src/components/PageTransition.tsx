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
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isTransitioning
          ? "opacity-0 translate-y-2 scale-[0.99]"
          : "opacity-100 translate-y-0 scale-100"
      )}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
