import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="welcome"]',
    title: 'Welcome to Your Dashboard! 🎉',
    description: 'This is your personalized learning hub where you can track progress, access courses, and manage your earnings.',
    position: 'bottom'
  },
  {
    target: '[data-tour="quick-actions"]',
    title: 'Quick Actions',
    description: 'Access key features instantly - browse courses, check earnings, manage your referrals, and more.',
    position: 'bottom'
  },
  {
    target: '[data-tour="progress"]',
    title: 'Track Your Progress',
    description: 'Monitor your learning journey with detailed analytics and completion rates for all your courses.',
    position: 'top'
  },
  {
    target: '[data-tour="referral"]',
    title: 'Share & Earn',
    description: 'Use your unique referral code to invite friends and earn rewards for every successful referral.',
    position: 'top'
  },
  {
    target: '[data-tour="recommendations"]',
    title: 'AI-Powered Recommendations',
    description: 'Get personalized course suggestions based on your interests and learning patterns.',
    position: 'top'
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const updatePosition = useCallback(() => {
    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);
      
      const tooltipWidth = 320;
      const tooltipHeight = 180;
      const offset = 16;
      
      let top = 0;
      let left = 0;
      
      switch (step.position) {
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'top':
          top = rect.top - tooltipHeight - offset;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - offset;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + offset;
          break;
      }
      
      // Keep within viewport
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
      top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));
      
      setTooltipPosition({ top, left });
      
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    setCurrentStep(0);
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop with spotlight cutout */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip}>
        {highlightRect && (
          <div
            className="absolute transition-all duration-300 ease-out"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
              borderRadius: '12px',
              border: '2px solid hsl(var(--primary))',
              animation: 'pulse-spotlight 2s ease-in-out infinite'
            }}
          />
        )}
      </div>
      
      {/* Tooltip */}
      <div
        className="absolute z-[101] w-80 transition-all duration-300 ease-out"
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
      >
        <div className="glass-card-premium p-5 rounded-2xl shadow-2xl border-primary/30">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={handleSkip}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Content */}
          <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentStep 
                    ? "w-6 bg-primary" 
                    : index < currentStep 
                      ? "bg-primary/60" 
                      : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip tour
            </Button>
            
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                {isLastStep ? (
                  <>
                    Complete
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Arrow pointer */}
        <div
          className={cn(
            "absolute w-4 h-4 bg-card border-primary/30 transform rotate-45",
            step.position === 'bottom' && "-top-2 left-1/2 -translate-x-1/2 border-l border-t",
            step.position === 'top' && "-bottom-2 left-1/2 -translate-x-1/2 border-r border-b",
            step.position === 'left' && "-right-2 top-1/2 -translate-y-1/2 border-t border-r",
            step.position === 'right' && "-left-2 top-1/2 -translate-y-1/2 border-b border-l"
          )}
        />
      </div>
    </div>
  );
};

export default OnboardingTour;
