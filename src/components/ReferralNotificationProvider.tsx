import { useReferralNotifications } from '@/hooks/useReferralNotifications';

/**
 * This component enables real-time referral notifications.
 * It should be placed inside AuthProvider to access user context.
 */
const ReferralNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  useReferralNotifications();
  return <>{children}</>;
};

export default ReferralNotificationProvider;
