/**
 * API utility functions for handling subscription-related errors
 */

export interface ApiError {
  error: string;
  requiresSubscription?: boolean;
  subscriptionExpired?: boolean;
  currentPlan?: string;
  planStatus?: string;
}

/**
 * Check if an API response indicates subscription is required
 */
export function isSubscriptionRequired(response: Response): boolean {
  return response.status === 403;
}

/**
 * Handle API errors and redirect to subscription page if needed
 * Returns true if error was handled, false otherwise
 */
export async function handleApiError(
  response: Response,
  onRedirect?: (path: string) => void
): Promise<boolean> {
  if (response.status === 403) {
    try {
      const error: ApiError = await response.json();
      
      if (error.requiresSubscription) {
        // Redirect to subscription required page
        if (onRedirect) {
          onRedirect('/subscription-required');
        } else if (typeof window !== 'undefined') {
          window.location.href = '/subscription-required';
        }
        return true;
      }
    } catch (e) {
      // JSON parse error, treat as generic 403
      if (onRedirect) {
        onRedirect('/subscription-required');
      } else if (typeof window !== 'undefined') {
        window.location.href = '/subscription-required';
      }
      return true;
    }
  }
  
  return false;
}

/**
 * Fetch wrapper that automatically handles subscription errors
 */
export async function fetchWithSubscriptionCheck(
  url: string,
  options?: RequestInit,
  onRedirect?: (path: string) => void
): Promise<Response> {
  const response = await fetch(url, options);
  
  if (response.status === 403) {
    await handleApiError(response, onRedirect);
    throw new Error('Subscription required');
  }
  
  return response;
}
