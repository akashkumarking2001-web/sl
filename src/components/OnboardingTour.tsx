import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, Styles } from 'react-joyride';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingTourProps {
  page: 'dashboard' | 'affiliate' | 'shopping' | 'courses';
}

const OnboardingTour = ({ page }: OnboardingTourProps) => {
  const { user } = useAuth();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

        // Check if onboarding_completed exists (will be added via migration)
        // For now, check localStorage as fallback
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);

        // Start tour if not completed
        if (!hasCompletedOnboarding) {
          setTimeout(() => setRun(true), 1000); // Delay for page load
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
        // If error, show tour anyway (better UX)
        setTimeout(() => setRun(true), 1000);
      }
    };

    checkOnboarding();
  }, [user?.id]);

  // Mark onboarding as completed
  const completeOnboarding = async () => {
    if (!user?.id) return;

    try {
      // Try to update database (will work after migration)
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true } as any)
        .eq('user_id', user.id);
    } catch (error) {
      console.log('Database update pending migration, using localStorage');
    }

    // Always save to localStorage as backup
    localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
  };

  // Handle tour callbacks
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRun(false);
      completeOnboarding();
    }

    if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  // Define steps for each page
  const dashboardSteps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Welcome to Skill Learners! 🎉</h2>
          <p className="text-muted-foreground">
            Let's take a quick tour to help you get started with our platform.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="quick-actions"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Access your most-used features quickly from here: courses, shopping, and affiliate tools.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="referral-code"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Your Referral Code</h3>
          <p className="text-sm text-muted-foreground">
            Share this code to earn commissions when others join using your link!
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="earnings"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Track Your Earnings</h3>
          <p className="text-sm text-muted-foreground">
            Monitor your income from referrals, levels, and other sources here.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="navigation"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Navigation Menu</h3>
          <p className="text-sm text-muted-foreground">
            Use this menu to explore courses, shopping, affiliate dashboard, and more.
          </p>
        </div>
      ),
      placement: 'right',
    },
  ];

  const affiliateSteps: Step[] = [
    {
      target: '[data-tour="affiliate-stats"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Affiliate Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            View your referral statistics, earnings, and team performance at a glance.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="income-streams"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Income Streams</h3>
          <p className="text-sm text-muted-foreground">
            Track income from different sources: referrals, levels, global pool, and more.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="referral-network"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Your Network</h3>
          <p className="text-sm text-muted-foreground">
            See your direct referrals and downline members. Click to view detailed network tree.
          </p>
        </div>
      ),
      placement: 'top',
    },
  ];

  const shoppingSteps: Step[] = [
    {
      target: '[data-tour="categories"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Browse Categories</h3>
          <p className="text-sm text-muted-foreground">
            Explore products by category. Click any category to filter products.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="search"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Search Products</h3>
          <p className="text-sm text-muted-foreground">
            Quickly find what you're looking for using the search bar.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="cart"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Shopping Cart</h3>
          <p className="text-sm text-muted-foreground">
            Add items to your cart and checkout when ready. Your cart syncs across all devices!
          </p>
        </div>
      ),
      placement: 'left',
    },
  ];

  const coursesSteps: Step[] = [
    {
      target: '[data-tour="course-grid"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">Available Courses</h3>
          <p className="text-sm text-muted-foreground">
            Browse all available courses. Click any course to view details and enroll.
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="my-courses"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">My Courses</h3>
          <p className="text-sm text-muted-foreground">
            Access your enrolled courses and track your learning progress.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
  ];

  // Select steps based on page
  const getSteps = (): Step[] => {
    switch (page) {
      case 'dashboard':
        return dashboardSteps;
      case 'affiliate':
        return affiliateSteps;
      case 'shopping':
        return shoppingSteps;
      case 'courses':
        return coursesSteps;
      default:
        return dashboardSteps;
    }
  };

  // Custom styles matching your theme
  const styles: Partial<Styles> = {
    options: {
      primaryColor: 'hsl(42 80% 58%)', // Primary gold
      backgroundColor: 'hsl(228 28% 13%)', // Card background
      textColor: 'hsl(45 20% 97%)', // Foreground
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      arrowColor: 'hsl(228 28% 13%)',
      zIndex: 10000,
    },
    tooltip: {
      borderRadius: '12px',
      padding: '20px',
      fontSize: '14px',
    },
    tooltipContainer: {
      textAlign: 'left',
    },
    buttonNext: {
      backgroundColor: 'hsl(42 80% 58%)',
      color: 'hsl(30 25% 8%)',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
    },
    buttonBack: {
      color: 'hsl(220 15% 65%)',
      marginRight: '8px',
    },
    buttonSkip: {
      color: 'hsl(220 15% 65%)',
    },
    beacon: {
      backgroundColor: 'hsl(42 80% 58%)',
    },
    beaconInner: {
      backgroundColor: 'hsl(42 80% 58%)',
    },
    beaconOuter: {
      backgroundColor: 'hsl(42 80% 58% / 0.2)',
      border: '2px solid hsl(42 80% 58%)',
    },
  };

  return (
    <Joyride
      steps={getSteps()}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={styles}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
};

export default OnboardingTour;
