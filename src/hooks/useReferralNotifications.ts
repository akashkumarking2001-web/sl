import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { notify } from '@/lib/notifications';

export const useReferralNotifications = () => {
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user || !profile?.referral_code) return;

    // Subscribe to new profiles where referred_by matches current user's profile id
    const channel = supabase
      .channel('referral-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
        },
        async (payload) => {
          const newProfile = payload.new as {
            id: string;
            referred_by: string | null;
            full_name: string | null;
            email: string | null;
          };

          // Check if this new user was referred by the current user
          if (newProfile.referred_by === profile.id) {
            const referralName = newProfile.full_name || newProfile.email?.split('@')[0] || 'Someone';
            notify.newReferral(referralName);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile?.referral_code, profile?.id]);
};

export default useReferralNotifications;
