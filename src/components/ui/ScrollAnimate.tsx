import React, { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface ScrollAnimateProps {
  children: ReactNode;
  className?: string;
  animation?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  threshold?: number;
}

export const ScrollAnimate = ({ 
  children, 
  className,
  animation = 'up',
  delay = 0,
  threshold = 0.1
}: ScrollAnimateProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const animationClass = {
    up: 'scroll-animate',
    left: 'scroll-animate-left',
    right: 'scroll-animate-right',
    scale: 'scroll-animate-scale',
  }[animation];

  return (
    <div
      ref={ref}
      className={cn(animationClass, isVisible && 'visible', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface ScrollStaggerProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
}

export const ScrollStagger = ({ 
  children, 
  className,
  threshold = 0.1
}: ScrollStaggerProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  return (
    <div
      ref={ref}
      className={cn('scroll-stagger', isVisible && 'visible', className)}
    >
      {children}
    </div>
  );
};

export default ScrollAnimate;