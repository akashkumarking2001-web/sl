import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RefreshCw, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { packages } from '@/data/packages';
import { cn } from '@/lib/utils';

interface AIRecommendationsProps {
  userName: string;
  purchasedPlan?: string;
}

const AIRecommendations = ({ userName, purchasedPlan }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Local Recommendations Logic - Zero Dependency
      const availablePackages = packages.filter(p => !purchasedPlan || p.name !== purchasedPlan);
      const topPick = availablePackages[0];
      const secondPick = availablePackages[1];

      setTimeout(() => {
        setRecommendations(`Based on your profile, I recommend starting with the ${topPick?.displayName || 'STARTER'} plan to master basic skills, or the ${secondPick?.displayName || 'ACCELERATOR'} plan for faster growth and monetization.`);
        setIsLoading(false);
      }, 1000);

    } catch (err: any) {
      setError('Unable to load recommendations');
      setRecommendations('Explore our courses to find the perfect fit for your learning goals!');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userName, purchasedPlan]);

  const recommendedPackages = packages
    .filter(p => p.name !== purchasedPlan)
    .slice(0, 3);

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-primary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Recommendations</h3>
              <p className="text-xs text-muted-foreground">Personalized for you</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchRecommendations}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* AI Message */}
      <div className="p-4 border-b border-border/50">
        {isLoading ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing your profile...</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {recommendations}
          </p>
        )}
      </div>

      {/* Recommended Courses */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Recommended for you</p>
        <div className="space-y-3">
          {recommendedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group cursor-pointer"
              onClick={() => navigate('/payment', { state: { selectedPlan: pkg.name } })}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                  pkg.color
                )}>
                  <pkg.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {pkg.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {pkg.shortDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">₹{pkg.price.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => navigate('/dashboard/courses')}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          View All Courses
        </Button>
      </div>
    </div>
  );
};

export default AIRecommendations;
