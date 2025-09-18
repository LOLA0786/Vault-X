import * as React from "react"
import { cn } from "@/lib/utils"
import { ModernCard, ModernCardContent } from "./modern-card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'security' | 'premium';
}

interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  className,
  variant = 'gradient'
}: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'neutral':
        return <Minus className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      case 'neutral':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <ModernCard variant={variant} hover="lift" interactive className={className}>
      <ModernCardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-foreground">
                {value}
              </p>
              {trend && (
                <div className={cn("flex items-center space-x-1 text-sm font-medium", getTrendColor())}>
                  {getTrendIcon()}
                  <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
                </div>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {trend?.label && (
              <p className="text-xs text-muted-foreground">
                {trend.label}
              </p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                {React.cloneElement(icon as React.ReactElement, {
                  className: "h-7 w-7 text-white"
                })}
              </div>
            </div>
          )}
        </div>
      </ModernCardContent>
    </ModernCard>
  )
}

export function StatsGrid({ children, className, cols = 3 }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[cols],
      className
    )}>
      {children}
    </div>
  )
}

// Specialized security stats component
export function SecurityStats({ 
  encryptedFiles, 
  activeAgents, 
  securityLevel = "Maximum",
  className 
}: {
  encryptedFiles: number;
  activeAgents: number;
  securityLevel?: string;
  className?: string;
}) {
  return (
    <StatsGrid cols={3} className={className}>
      <StatCard
        title="Encrypted Files"
        value={encryptedFiles}
        description="Files secured with AES-256"
        icon={<div className="w-7 h-7 bg-blue-500 rounded-lg" />}
        variant="gradient"
        trend={{
          value: 12,
          label: "vs last month",
          direction: 'up'
        }}
      />
      <StatCard
        title="Security Level"
        value={securityLevel}
        description="Client-side encryption active"
        icon={<div className="w-7 h-7 bg-emerald-500 rounded-lg" />}
        variant="security"
      />
      <StatCard
        title="AI Agents"
        value={activeAgents}
        description="Private assistants ready"
        icon={<div className="w-7 h-7 bg-violet-500 rounded-lg" />}
        variant="premium"
        trend={{
          value: 5,
          label: "new this week",
          direction: 'up'
        }}
      />
    </StatsGrid>
  )
}

// Progress stat component
export function ProgressStat({
  title,
  value,
  max,
  description,
  className,
  color = 'blue'
}: {
  title: string;
  value: number;
  max: number;
  description?: string;
  className?: string;
  color?: 'blue' | 'emerald' | 'violet' | 'amber';
}) {
  const percentage = Math.round((value / max) * 100)
  
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600'
  }

  return (
    <ModernCard variant="glass" className={className}>
      <ModernCardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {title}
            </h3>
            <span className="text-2xl font-bold text-foreground">
              {percentage}%
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className={cn(
                  "h-full bg-gradient-to-r transition-all duration-500 ease-out rounded-full",
                  colorClasses[color]
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{value} of {max}</span>
              {description && <span>{description}</span>}
            </div>
          </div>
        </div>
      </ModernCardContent>
    </ModernCard>
  )
}