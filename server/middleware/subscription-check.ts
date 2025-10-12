import type { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

/**
 * Middleware to check if user has an active subscription
 * Add this to routes that require a paid plan
 */
export async function requireSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.body.userId || req.params.userId || req.query.userId;

        if (!userId) {
            return res.status(400).json({
                error: 'User ID required',
                requiresSubscription: true
            });
        }

        // Get user from database
        const user = await storage.getUser(userId as string);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                requiresSubscription: true
            });
        }

        // ADMIN USERS have unlimited access - no subscription required
        const adminEmails = ['Lolasolution27@gmail.com', 'lolasolution27@gmail.com'];
        const isAdmin = adminEmails.includes(user.email);

        if (isAdmin) {
            console.log('[Subscription Check] Admin user - granting unlimited access', {
                userId,
                email: user.email,
                endpoint: req.path
            });
            return next();
        }

        // Check if user has an active subscription
        // NO FREE PLAN - User must have a valid PAID plan
        const validPaidPlans = ['starter-plan', 'personal-plan', 'pro-plan', 'business-plan'];
        const hasActiveSubscription =
            !!user.currentPlan &&
            validPaidPlans.includes(user.currentPlan) &&
            user.planStatus === 'active';

        console.log('[Subscription Check]', {
            userId,
            endpoint: req.path,
            currentPlan: user.currentPlan,
            planStatus: user.planStatus,
            isValidPaidPlan: validPaidPlans.includes(user.currentPlan || ''),
            hasActiveSubscription
        });

        // Check if subscription hasn't expired
        if (hasActiveSubscription && user.subscriptionEndDate) {
            const endDate = new Date(user.subscriptionEndDate);
            const now = new Date();
            if (endDate < now) {
                return res.status(403).json({
                    error: 'Subscription expired. Please renew to continue using this feature.',
                    requiresSubscription: true,
                    subscriptionExpired: true
                });
            }
        }

        if (!hasActiveSubscription) {
            return res.status(403).json({
                error: 'Active subscription required. Please subscribe to access this feature.',
                requiresSubscription: true,
                currentPlan: user.currentPlan || 'none',
                planStatus: user.planStatus
            });
        }

        // User has valid subscription, continue
        next();
    } catch (error) {
        console.error('[Subscription Check] Error:', error);
        res.status(500).json({
            error: 'Failed to verify subscription',
            requiresSubscription: true
        });
    }
}

/**
 * Optional middleware - allows access but adds subscription info to request
 */
export async function addSubscriptionInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.body.userId || req.params.userId || req.query.userId;

        if (userId) {
            const user = await storage.getUser(userId as string);
            if (user) {
                (req as any).userSubscription = {
                    hasSubscription: user.currentPlan && user.planStatus === 'active',
                    plan: user.currentPlan,
                    status: user.planStatus
                };
            }
        }

        next();
    } catch (error) {
        // Don't block request if subscription check fails
        next();
    }
}
