import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarDays, CreditCard, Settings2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: string;
  billingPeriod: string;
  startDate: string;
  endDate: string | null;
  autoRenew: number;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function SubscriptionDisplay() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchSubscription();
    }
  }, [user?.id]);

  const fetchSubscription = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/subscriptions/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else if (response.status === 404) {
        // No subscription found
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAutoRenew = async (enabled: boolean) => {
    if (!user?.id || !subscription) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/subscriptions/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          autoRenew: enabled,
        }),
      });

      if (response.ok) {
        const updatedSubscription = await response.json();
        setSubscription(updatedSubscription);
        toast({
          title: "Success",
          description: `Auto-renewal has been ${enabled ? 'enabled' : 'disabled'}.`,
        });
      } else {
        throw new Error('Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update auto-renewal setting.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />;
      case 'cancelled':
      case 'expired':
      case 'paused':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <CardTitle>Subscription</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <CardDescription>
            You don't have an active subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to a paid plan to unlock premium features.
            </p>
            <Button onClick={() => window.location.href = '/pricing'}>
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(subscription.status)} flex items-center gap-1`}
          >
            {getStatusIcon(subscription.status)}
            {subscription.status}
          </Badge>
        </div>
        <CardDescription>
          Manage your subscription and billing preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
            <p className="text-sm font-medium">{subscription.planName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Billing Period</Label>
            <p className="text-sm font-medium capitalize">{subscription.billingPeriod}ly</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
            <p className="text-sm">{formatDate(subscription.startDate)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
            <p className="text-sm">{formatDate(subscription.endDate)}</p>
          </div>
        </div>

        {subscription.status === 'active' && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label htmlFor="auto-renew" className="text-sm font-medium">
                Auto-renewal
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically renew your subscription
              </p>
            </div>
            <Switch
              id="auto-renew"
              checked={subscription.autoRenew === 1}
              onCheckedChange={updateAutoRenew}
              disabled={updating}
            />
          </div>
        )}

        {subscription.status !== 'active' && (
          <div className="pt-4 border-t">
            <Button onClick={() => window.location.href = '/pricing'} className="w-full">
              Renew Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
