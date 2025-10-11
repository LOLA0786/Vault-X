import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  FileText, 
  Database, 
  Globe, 
  Clock,
  Zap,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'default' | 'success' | 'warning' | 'info' | 'security';
}

interface StatsCounterProps {
  stats?: StatItem[];
  variant?: 'default' | 'compact' | 'featured' | 'grid';
  animated?: boolean;
  className?: string;
}

const defaultStats: StatItem[] = [
  {
    id: 'files',
    label: 'Files Encrypted',
    value: '150+',
    icon: <FileText className="w-6 h-6" />,
    description: 'Securely processed',
    trend: 'up',
    trendValue: '+12%',
    color: 'success'
  },
  {
    id: 'users', 
    label: 'Users Protected',
    value: '50+',
    icon: <Users className="w-6 h-6" />,
    description: 'Trust our platform',
    trend: 'up', 
    trendValue: '+24%',
    color: 'info'
  },
  {
    id: 'data',
    label: 'Data Secured',
    value: '2+ GB',
    icon: <Database className="w-6 h-6" />,
    description: 'Under encryption',
    trend: 'up',
    trendValue: '+8%',
    color: 'security'
  },
  {
    id: 'uptime',
    label: 'Uptime',
    value: '99.5%',
    icon: <Zap className="w-6 h-6" />,
    description: 'Growing strong',
    trend: 'stable',
    color: 'success'
  }
];

const colorVariants = {
  default: 'text-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400', 
  info: 'text-blue-600 dark:text-blue-400',
  security: 'text-purple-600 dark:text-purple-400'
};

function AnimatedCounter({ 
  value, 
  duration = 2000 
}: { 
  value: string | number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const numericValue = typeof value === 'string' 
      ? parseInt(value.replace(/[^\d]/g, '')) 
      : value;
      
    if (isNaN(numericValue)) {
      return;
    }

    const startTime = Date.now();
    const startValue = 0;
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (numericValue - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  if (typeof value === 'string' && isNaN(parseInt(value.replace(/[^\d]/g, '')))) {
    return <span>{value}</span>;
  }

  const suffix = typeof value === 'string' ? value.replace(/[\d,]/g, '') : '';
  return <span>{displayValue.toLocaleString()}{suffix}</span>;
}

export function StatsCounter({ 
  stats = defaultStats,
  variant = 'default',
  animated = true,
  className = ''
}: StatsCounterProps) {
  
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center justify-between space-x-6 p-4 bg-muted/30 rounded-lg", className)}>
        {stats.slice(0, 4).map((stat) => (
          <div key={stat.id} className="text-center">
            <div className={cn("text-2xl font-bold", colorVariants[stat.color || 'default'])}>
              {animated ? <AnimatedCounter value={stat.value} /> : stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'featured') {
    const featured = stats[0];
    return (
      <Card className={cn("bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20", className)}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {featured.icon}
          </div>
          <div className="text-4xl font-bold mb-2">
            {animated ? <AnimatedCounter value={featured.value} /> : featured.value}
          </div>
          <div className="text-lg font-medium mb-2">{featured.label}</div>
          {featured.description && (
            <p className="text-muted-foreground">{featured.description}</p>
          )}
          {featured.trend && (
            <Badge variant="outline" className="mt-3">
              {featured.trend === 'up' && '↗'} 
              {featured.trend === 'down' && '↘'}
              {featured.trend === 'stable' && '→'}
              {featured.trendValue}
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        {stats.map((stat) => (
          <Card key={stat.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3", 
                stat.color === 'success' && 'bg-green-100 dark:bg-green-900',
                stat.color === 'info' && 'bg-blue-100 dark:bg-blue-900',
                stat.color === 'security' && 'bg-purple-100 dark:bg-purple-900',
                stat.color === 'warning' && 'bg-yellow-100 dark:bg-yellow-900',
                !stat.color && 'bg-muted'
              )}>
                <div className={colorVariants[stat.color || 'default']}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {animated ? <AnimatedCounter value={stat.value} /> : stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              {stat.description && (
                <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8", className)}>
      {stats.map((stat) => (
        <div key={stat.id} className="flex items-center space-x-4 text-center md:text-left">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", 
            stat.color === 'success' && 'bg-green-100 dark:bg-green-900',
            stat.color === 'info' && 'bg-blue-100 dark:bg-blue-900', 
            stat.color === 'security' && 'bg-purple-100 dark:bg-purple-900',
            stat.color === 'warning' && 'bg-yellow-100 dark:bg-yellow-900',
            !stat.color && 'bg-muted'
          )}>
            <div className={colorVariants[stat.color || 'default']}>
              {stat.icon}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {animated ? <AnimatedCounter value={stat.value} /> : stat.value}
            </div>
            <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            {stat.description && (
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Preset stats for common use cases
export function SecurityStats({ className }: { className?: string }) {
  const securityStats: StatItem[] = [
    {
      id: 'incidents',
      label: 'Security Incidents',
      value: '0',
      icon: <Shield className="w-6 h-6" />,
      description: 'In 90+ days',
      color: 'success'
    },
    {
      id: 'encryption',
      label: 'Encryption Level',
      value: 'AES-256',
      icon: <Lock className="w-6 h-6" />,
      description: 'Military grade',
      color: 'security'
    },
    {
      id: 'uptime',
      label: 'Uptime',
      value: '99.5%',
      icon: <Clock className="w-6 h-6" />,
      description: 'Beta reliability',
      color: 'info'
    }
  ];

  return <StatsCounter stats={securityStats} variant="compact" className={className} />;
}

export function UsageStats({ className }: { className?: string }) {
  return <StatsCounter stats={defaultStats} variant="grid" className={className} />;
}

export default StatsCounter;