import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { hasActiveSubscription } from '@/lib/plan-access';
import { ModernLoading } from '@/components/ui/modern-loading';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireSubscription?: boolean;
}

/**
 * Protected Route Component
 * Redirects users without active subscription to subscription-required page
 */
export function ProtectedRoute({ children, requireSubscription = true }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        console.log('[ProtectedRoute] Effect running:', { loading, requireSubscription, hasUser: !!user });

        if (loading) return;

        const hasSubscription = hasActiveSubscription(user);
        console.log('[ProtectedRoute] Subscription check result:', hasSubscription);

        // If subscription is required and user doesn't have one
        if (requireSubscription && !hasSubscription) {
            console.log('[ProtectedRoute] Redirecting to /subscription-required');
            setLocation('/subscription-required');
        }
    }, [user, loading, requireSubscription, setLocation]);

    // Show loading while checking auth
    if (loading) {
        console.log('[ProtectedRoute] Still loading...');
        return <ModernLoading />;
    }

    const hasSubscription = hasActiveSubscription(user);

    // If subscription required but user doesn't have one, show nothing (will redirect)
    if (requireSubscription && !hasSubscription) {
        console.log('[ProtectedRoute] No subscription - showing loading (will redirect)');
        return <ModernLoading />;
    }

    console.log('[ProtectedRoute] Access granted - rendering children');
    // User has access, render children
    return <>{children}</>;
}
