import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasActiveSubscription, getDaysUntilExpiration, isSubscriptionExpiringSoon, getUserPlanName } from '@/lib/plan-access';

export function SubscriptionBanner() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // User has no subscription
  if (!hasActiveSubscription(user)) {
    return (
      <Alert className="border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <AlertTitle className="text-orange-900 dark:text-orange-100 font-bold">
          No Active Subscription
        </AlertTitle>
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <p className="mb-3">
            Subscribe now to unlock secure file storage, AI chat, and custom AI agents.
          </p>
          <Button 
            onClick={() => setLocation('/pricing')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            View Plans & Subscribe
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Subscription expiring soon
  if (isSubscriptionExpiringSoon(user)) {
    const daysLeft = getDaysUntilExpiration(user);
    return (
      <Alert className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
        <Clock className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-900 dark:text-yellow-100 font-bold">
          Subscription Expiring Soon
        </AlertTitle>
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          <p className="mb-3">
            Your {getUserPlanName(user)} subscription expires in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}. 
            Renew now to avoid service interruption.
          </p>
          <Button 
            onClick={() => setLocation('/pricing')}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Renew Subscription
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Active subscription - show success banner (optional, can be removed)
  return (
    <Alert className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
      <Shield className="h-5 w-5 text-green-600" />
      <AlertTitle className="text-green-900 dark:text-green-100 font-bold">
        {getUserPlanName(user)} Active
      </AlertTitle>
      <AlertDescription className="text-green-800 dark:text-green-200">
        Your subscription is active and all features are unlocked.
      </AlertDescription>
    </Alert>
  );
}
