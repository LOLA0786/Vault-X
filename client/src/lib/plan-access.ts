import type { User } from '@shared/schema';
import { PLAN_CONFIGS } from '@shared/schema';

export interface PlanLimits {
  storage: number; // GB
  chats: number; // per month
  devices: number; // -1 = unlimited
  aiAgents: number; // -1 = unlimited
  maxFileSize: number; // MB
  chatHistoryDays: number; // -1 = unlimited
  prioritySupport?: boolean;
  apiAccess?: boolean;
  advancedAnalytics?: boolean;
  adminDashboard?: boolean;
  sso?: boolean;
  auditLogs?: boolean;
  complianceReports?: boolean;
  versionHistory?: number; // days, -1 = unlimited
  dedicatedSupport?: boolean;
  teamMembers?: number;
}

/**
 * Check if user has an active subscription
 * NO FREE PLAN - Users must have a paid plan
 * ADMIN USERS have unlimited access
 */
export function hasActiveSubscription(user: User | null | undefined): boolean {
  console.log('[Plan Access] Checking subscription for user:', {
    hasUser: !!user,
    email: user?.email,
    currentPlan: user?.currentPlan,
    planStatus: user?.planStatus,
    subscriptionEndDate: user?.subscriptionEndDate
  });
  
  if (!user) {
    console.log('[Plan Access] No user - returning false');
    return false;
  }
  
  // ADMIN USERS have unlimited access - no subscription required
  const adminEmails = ['Lolasolution27@gmail.com', 'lolasolution27@gmail.com'];
  if (adminEmails.includes(user.email)) {
    console.log('[Plan Access] Admin user - granting unlimited access');
    return true;
  }
  
  // NO FREE PLAN ALLOWED - must have a valid paid plan
  const validPaidPlans = ['starter-plan', 'personal-plan', 'pro-plan', 'business-plan'];
  
  if (!user.currentPlan || !validPaidPlans.includes(user.currentPlan)) {
    console.log('[Plan Access] No valid paid plan (free or null not allowed) - returning false');
    return false;
  }
  
  // Plan status must be active
  if (user.planStatus !== 'active') {
    console.log('[Plan Access] Plan not active - returning false');
    return false;
  }
  
  // Check if subscription hasn't expired
  if (user.subscriptionEndDate) {
    const endDate = new Date(user.subscriptionEndDate);
    const now = new Date();
    if (endDate < now) {
      console.log('[Plan Access] Subscription expired - returning false');
      return false;
    }
  }
  
  console.log('[Plan Access] Has active PAID subscription - returning true');
  return true;
}

/**
 * Get user's plan limits
 */
export function getUserPlanLimits(user: User | null | undefined): PlanLimits | null {
  if (!user || !user.currentPlan) return null;
  
  const planConfig = PLAN_CONFIGS[user.currentPlan as keyof typeof PLAN_CONFIGS];
  if (!planConfig) return null;
  
  return planConfig.limits as PlanLimits;
}

/**
 * Check if user can upload a file of given size
 */
export function canUploadFile(user: User | null | undefined, fileSizeMB: number): {
  allowed: boolean;
  reason?: string;
  limit?: number;
} {
  if (!hasActiveSubscription(user)) {
    return {
      allowed: false,
      reason: 'No active subscription. Please subscribe to upload files.',
    };
  }
  
  const limits = getUserPlanLimits(user);
  if (!limits) {
    return {
      allowed: false,
      reason: 'Unable to determine plan limits.',
    };
  }
  
  if (fileSizeMB > limits.maxFileSize) {
    return {
      allowed: false,
      reason: `File size exceeds your plan limit of ${limits.maxFileSize}MB.`,
      limit: limits.maxFileSize,
    };
  }
  
  return { allowed: true };
}

/**
 * Check if user can send more AI chat messages
 */
export function canSendChatMessage(user: User | null | undefined, currentMonthChats: number): {
  allowed: boolean;
  reason?: string;
  limit?: number;
  remaining?: number;
} {
  if (!hasActiveSubscription(user)) {
    return {
      allowed: false,
      reason: 'No active subscription. Please subscribe to use AI chat.',
    };
  }
  
  const limits = getUserPlanLimits(user);
  if (!limits) {
    return {
      allowed: false,
      reason: 'Unable to determine plan limits.',
    };
  }
  
  // -1 means unlimited
  if (limits.chats === -1) {
    return { allowed: true };
  }
  
  if (currentMonthChats >= limits.chats) {
    return {
      allowed: false,
      reason: `You've reached your monthly limit of ${limits.chats} AI chats.`,
      limit: limits.chats,
      remaining: 0,
    };
  }
  
  return {
    allowed: true,
    limit: limits.chats,
    remaining: limits.chats - currentMonthChats,
  };
}

/**
 * Check if user can create more AI agents
 */
export function canCreateAIAgent(user: User | null | undefined, currentAgentCount: number): {
  allowed: boolean;
  reason?: string;
  limit?: number;
} {
  if (!hasActiveSubscription(user)) {
    return {
      allowed: false,
      reason: 'No active subscription. Please subscribe to create AI agents.',
    };
  }
  
  const limits = getUserPlanLimits(user);
  if (!limits) {
    return {
      allowed: false,
      reason: 'Unable to determine plan limits.',
    };
  }
  
  // -1 means unlimited
  if (limits.aiAgents === -1) {
    return { allowed: true };
  }
  
  if (currentAgentCount >= limits.aiAgents) {
    return {
      allowed: false,
      reason: `You've reached your plan limit of ${limits.aiAgents} AI agents.`,
      limit: limits.aiAgents,
    };
  }
  
  return { allowed: true, limit: limits.aiAgents };
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(user: User | null | undefined, feature: keyof PlanLimits): boolean {
  if (!hasActiveSubscription(user)) return false;
  
  const limits = getUserPlanLimits(user);
  if (!limits) return false;
  
  return !!limits[feature];
}

/**
 * Get user's plan name
 */
export function getUserPlanName(user: User | null | undefined): string {
  if (!user || !user.currentPlan) return 'No Plan';
  
  const planConfig = PLAN_CONFIGS[user.currentPlan as keyof typeof PLAN_CONFIGS];
  return planConfig?.name || 'Unknown Plan';
}

/**
 * Get days until subscription expires
 */
export function getDaysUntilExpiration(user: User | null | undefined): number | null {
  if (!user || !user.subscriptionEndDate) return null;
  
  const endDate = new Date(user.subscriptionEndDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isSubscriptionExpiringSoon(user: User | null | undefined): boolean {
  const days = getDaysUntilExpiration(user);
  return days !== null && days > 0 && days <= 7;
}

/**
 * Format storage size
 */
export function formatStorageSize(gb: number): string {
  if (gb >= 1000) {
    return `${gb / 1000}TB`;
  }
  return `${gb}GB`;
}

/**
 * Get plan badge color
 */
export function getPlanBadgeColor(planId: string | null | undefined): string {
  switch (planId) {
    case 'starter-plan':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'personal-plan':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'pro-plan':
      return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400';
    case 'business-plan':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  }
}
