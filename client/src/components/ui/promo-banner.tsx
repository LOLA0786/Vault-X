import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Shield, Zap, Gift, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromoBannerProps {
  message: string;
  cta?: string;
  ctaAction?: () => void;
  variant?: 'default' | 'gradient' | 'security' | 'success' | 'warning' | 'holiday';
  dismissible?: boolean;
  icon?: React.ReactNode;
  className?: string;
  badge?: string;
}

const bannerVariants = {
  default: "bg-primary/10 border-primary/20 text-primary-foreground",
  gradient: "bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 border-violet-200 dark:border-violet-800",
  security: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800", 
  success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
  holiday: "bg-gradient-to-r from-red-500/10 via-green-500/10 to-red-500/10 border-red-200 dark:border-red-800"
};

const iconVariants = {
  default: <Sparkles className="w-5 h-5" />,
  gradient: <Star className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  success: <Zap className="w-5 h-5" />,
  warning: <Zap className="w-5 h-5" />,
  holiday: <Gift className="w-5 h-5" />
};

export function PromoBanner({
  message,
  cta,
  ctaAction,
  variant = 'default',
  dismissible = true,
  icon,
  className = '',
  badge
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const defaultIcon = icon || iconVariants[variant];

  return (
    <div className={cn(
      "relative w-full border rounded-lg p-4 animate-in slide-in-from-top-5 duration-500",
      bannerVariants[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {defaultIcon && (
            <div className="flex-shrink-0">
              {defaultIcon}
            </div>
          )}
          <div className="flex items-center space-x-3 flex-1">
            {badge && (
              <Badge variant="secondary" className="text-xs font-medium">
                {badge}
              </Badge>
            )}
            <p className="text-sm font-medium flex-1">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {cta && ctaAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={ctaAction}
              className="text-xs font-medium"
            >
              {cta}
            </Button>
          )}
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0 hover:bg-background/80"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Preset banner components for common use cases
export function SecurityTrustBanner({ className }: { className?: string }) {
  return (
    <PromoBanner
      variant="security"
      icon={<Shield className="w-5 h-5 text-green-600" />}
      message="🔒 Your files are protected with military-grade AES-256 encryption"
      dismissible={false}
      className={className}
    />
  );
}

export function NewFeatureBanner({ 
  feature, 
  className,
  onTryNow 
}: { 
  feature: string;
  className?: string;
  onTryNow?: () => void;
}) {
  return (
    <PromoBanner
      variant="gradient"
      badge="NEW"
      message={`🚀 ${feature}`}
      cta="Try Now"
      ctaAction={onTryNow}
      className={className}
    />
  );
}

export function HolidayPromoBanner({ 
  offer, 
  className,
  onClaim 
}: { 
  offer: string;
  className?: string;
  onClaim?: () => void;
}) {
  return (
    <PromoBanner
      variant="holiday"
      icon={<Gift className="w-5 h-5 text-red-600" />}
      badge="LIMITED TIME"
      message={`🎁 ${offer}`}
      cta="Claim Now"
      ctaAction={onClaim}
      className={className}
    />
  );
}

export function ActivityBanner({ 
  activity, 
  className 
}: { 
  activity: string;
  className?: string;
}) {
  return (
    <PromoBanner
      variant="success"
      icon={<Zap className="w-5 h-5 text-green-600" />}
      message={activity}
      dismissible={false}
      className={className}
    />
  );
}

export default PromoBanner;