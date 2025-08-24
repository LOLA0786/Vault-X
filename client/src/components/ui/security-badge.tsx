import { cn } from "@/lib/utils";
import { Shield, Lock, Eye, CheckCircle, AlertTriangle, XCircle, Zap, Key, Database, Bot } from "lucide-react";
import { ReactNode } from "react";

interface SecurityBadgeProps {
  variant?: 'secure' | 'encrypted' | 'verified' | 'warning' | 'danger' | 'active' | 'inactive';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  className?: string;
  showIcon?: boolean;
  animated?: boolean;
}

interface SecurityStatusProps {
  status: 'secure' | 'encrypted' | 'verified' | 'warning' | 'danger' | 'active' | 'inactive';
  message: string;
  className?: string;
  showIcon?: boolean;
}

interface TrustScoreProps {
  score: number;
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface EncryptionIndicatorProps {
  isEncrypted: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getVariantStyles = (variant: string, size: string) => {
  const baseStyles = "inline-flex items-center gap-2 font-medium border backdrop-blur-sm transition-all duration-200 ease-in-out";
  
  const sizeStyles = {
    sm: "px-2 py-1 text-xs rounded-md",
    md: "px-3 py-1.5 text-sm rounded-lg",
    lg: "px-4 py-2 text-base rounded-xl"
  };

  const variantStyles = {
    secure: "bg-gradient-to-r from-security-600 to-security-700 hover:from-security-700 hover:to-security-800 text-security-foreground border-security-500 border-opacity-30 shadow-lg shadow-security-500/25 hover:shadow-xl hover:shadow-security-500/35",
    encrypted: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-primary-foreground border-primary-500 border-opacity-30 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35",
    verified: "bg-gradient-to-r from-security-500 to-security-600 hover:from-security-600 hover:to-security-700 text-security-foreground border-security-400 border-opacity-30 shadow-lg shadow-security-400/25 hover:shadow-xl hover:shadow-security-400/35",
    warning: "bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800 text-warning-foreground border-warning-500 border-opacity-30 shadow-lg shadow-warning-500/25 hover:shadow-xl hover:shadow-warning-500/35",
    danger: "bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 text-danger-foreground border-danger-500 border-opacity-30 shadow-lg shadow-danger-500/25 hover:shadow-xl hover:shadow-danger-500/35",
    active: "bg-gradient-to-r from-security-500 to-primary-600 hover:from-security-600 hover:to-primary-700 text-white border-security-400 border-opacity-30 shadow-lg shadow-security-400/25 hover:shadow-xl hover:shadow-security-400/35",
    inactive: "bg-gradient-to-r from-secondary to-muted hover:from-muted hover:to-secondary text-muted-foreground border-border border-opacity-30 shadow-sm hover:shadow-md"
  };

  return cn(baseStyles, sizeStyles[size as keyof typeof sizeStyles], variantStyles[variant as keyof typeof variantStyles]);
};

const getIcon = (variant: string, size: string) => {
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  
  const icons = {
    secure: <Shield size={iconSize} />,
    encrypted: <Lock size={iconSize} />,
    verified: <CheckCircle size={iconSize} />,
    warning: <AlertTriangle size={iconSize} />,
    danger: <XCircle size={iconSize} />,
    active: <Zap size={iconSize} />,
    inactive: <XCircle size={iconSize} />
  };

  return icons[variant as keyof typeof icons];
};

export function SecurityBadge({ 
  variant = 'secure', 
  size = 'md', 
  children, 
  className,
  showIcon = true,
  animated = true 
}: SecurityBadgeProps) {
  const styles = getVariantStyles(variant, size);
  const icon = getIcon(variant, size);

  return (
    <span 
      className={cn(
        styles,
        animated && "hover:transform hover:scale-105 hover:shadow-xl",
        className
      )}
    >
      {showIcon && icon}
      {children}
    </span>
  );
}

export function SecurityStatus({ 
  status, 
  message, 
  className,
  showIcon = true 
}: SecurityStatusProps) {
  const icon = getIcon(status, 'md');
  
  const statusStyles = {
    secure: "text-security-600 dark:text-security-400",
    encrypted: "text-primary-600 dark:text-primary-400",
    verified: "text-security-500 dark:text-security-300",
    warning: "text-warning-600 dark:text-warning-400",
    danger: "text-danger-600 dark:text-danger-400",
    active: "text-security-500 dark:text-security-300",
    inactive: "text-muted-foreground"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <div className={cn("flex items-center justify-center", statusStyles[status])}>
          {icon}
        </div>
      )}
      <span className={cn("text-sm font-medium", statusStyles[status])}>
        {message}
      </span>
    </div>
  );
}

export function TrustScore({ 
  score, 
  label, 
  className,
  size = 'md' 
}: TrustScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-security-600 dark:text-security-400";
    if (score >= 70) return "text-warning-600 dark:text-warning-400";
    return "text-danger-600 dark:text-danger-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Shield className="h-4 w-4" />;
    if (score >= 70) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-2">
        {getScoreIcon(score)}
        <span className={cn("font-bold", sizeStyles[size], getScoreColor(score))}>
          {score}%
        </span>
      </div>
      <div className="flex flex-col">
        <span className={cn("font-medium text-foreground", sizeStyles[size])}>
          {label}
        </span>
        <div className="w-16 h-1.5 bg-secondary dark:bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500 ease-out",
              score >= 90 ? "bg-gradient-to-r from-security-500 to-security-600" :
              score >= 70 ? "bg-gradient-to-r from-warning-500 to-warning-600" :
              "bg-gradient-to-r from-danger-500 to-danger-600"
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function EncryptionIndicator({ 
  isEncrypted, 
  showLabel = true, 
  size = 'md',
  className 
}: EncryptionIndicatorProps) {
  const sizeStyles = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const textStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-full",
        isEncrypted 
          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400" 
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
      )}>
        {isEncrypted ? (
          <Lock className={sizeStyles[size]} />
        ) : (
          <XCircle className={sizeStyles[size]} />
        )}
      </div>
      {showLabel && (
        <span className={cn(
          "font-medium",
          textStyles[size],
          isEncrypted 
            ? "text-emerald-600 dark:text-emerald-400" 
            : "text-gray-500 dark:text-gray-400"
        )}>
          {isEncrypted ? "Encrypted" : "Unencrypted"}
        </span>
      )}
    </div>
  );
}

// Enhanced Security Icons Component
export function SecurityIcon({ 
  type, 
  size = 'md',
  className 
}: { 
  type: 'shield' | 'lock' | 'key' | 'database' | 'bot' | 'eye' | 'zap';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  
  const icons = {
    shield: <Shield size={iconSize} />,
    lock: <Lock size={iconSize} />,
    key: <Key size={iconSize} />,
    database: <Database size={iconSize} />,
    bot: <Bot size={iconSize} />,
    eye: <Eye size={iconSize} />,
    zap: <Zap size={iconSize} />
  };

  return (
    <div className={cn(
      "flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg",
      size === 'sm' ? "h-8 w-8" : size === 'md' ? "h-10 w-10" : "h-12 w-12",
      className
    )}>
      {icons[type]}
    </div>
  );
}