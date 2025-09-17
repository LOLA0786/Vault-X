import React from 'react';

interface PrivateVaultLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export function PrivateVaultLogo({ size = 'md', className = '', animated = true }: PrivateVaultLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  // Generate unique IDs for this component instance
  const uniqueId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
  const vaultGradientId = `vaultGradient-${uniqueId}`;
  const lockGradientId = `lockGradient-${uniqueId}`;
  const keyGradientId = `keyGradient-${uniqueId}`;
  const shadowId = `shadow-${uniqueId}`;
  const glowId = `glow-${uniqueId}`;

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id={vaultGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          
          <linearGradient id={lockGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          
          <linearGradient id={keyGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Shadow filter */}
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
          </filter>

          {/* Glow effect */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer vault circle with geometric pattern */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill={`url(#${vaultGradientId})`}
          filter={`url(#${shadowId})`}
          className={animated ? "animate-pulse" : ""}
          style={{ animationDuration: '3s' }}
        />

        {/* Inner geometric pattern - hexagonal vault door */}
        <g transform="translate(50,50)">
          {/* Hexagonal vault door */}
          <polygon
            points="-20,-12 -10,-20 10,-20 20,-12 20,12 10,20 -10,20 -20,12"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          
          {/* Inner hexagon */}
          <polygon
            points="-12,-7 -6,-12 6,-12 12,-7 12,7 6,12 -6,12 -12,7"
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />

          {/* Vault handle/wheel */}
          <circle
            cx="0"
            cy="0"
            r="8"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
          />
          
          {/* Vault spokes */}
          <g stroke="rgba(255,255,255,0.6)" strokeWidth="1" className={animated ? "animate-spin" : ""} style={{ animationDuration: '8s' }}>
            <line x1="-6" y1="0" x2="6" y2="0" />
            <line x1="0" y1="-6" x2="0" y2="6" />
            <line x1="-4" y1="-4" x2="4" y2="4" />
            <line x1="-4" y1="4" x2="4" y2="-4" />
          </g>

          {/* Center dot */}
          <circle cx="0" cy="0" r="2" fill="rgba(255,255,255,0.8)" />
        </g>

        {/* Security lock indicator */}
        <g transform="translate(72,28)">
          <rect
            x="-4"
            y="-2"
            width="8"
            height="6"
            rx="1"
            fill={`url(#${lockGradientId})`}
            filter={`url(#${glowId})`}
          />
          <path
            d="M -2,-2 A 2,2 0 0,1 2,-2"
            fill="none"
            stroke={`url(#${lockGradientId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* AI/Digital elements - circuit pattern */}
        <g opacity="0.4">
          {/* Circuit lines */}
          <path
            d="M 15,25 L 25,25 L 25,35 M 75,25 L 85,25 L 85,35 M 15,75 L 25,75 L 25,65 M 75,75 L 85,75 L 85,65"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
            fill="none"
          />
          
          {/* Circuit nodes */}
          <circle cx="25" cy="25" r="1.5" fill="rgba(255,255,255,0.8)" />
          <circle cx="85" cy="25" r="1.5" fill="rgba(255,255,255,0.8)" />
          <circle cx="25" cy="75" r="1.5" fill="rgba(255,255,255,0.8)" />
          <circle cx="85" cy="75" r="1.5" fill="rgba(255,255,255,0.8)" />
        </g>

        {/* Key accent - representing access/encryption */}
        <g transform="translate(28,72)" opacity="0.8">
          <rect x="0" y="-1" width="6" height="2" rx="1" fill={`url(#${keyGradientId})`} />
          <rect x="6" y="-2" width="2" height="1" fill={`url(#${keyGradientId})`} />
          <rect x="6" y="1" width="2" height="1" fill={`url(#${keyGradientId})`} />
        </g>

        {/* Data flow particles */}
        {animated && (
          <g className="animate-pulse" style={{ animationDuration: '2s' }}>
            <circle cx="20" cy="50" r="1" fill="#10B981" opacity="0.6" />
            <circle cx="80" cy="50" r="1" fill="#3B82F6" opacity="0.6" />
            <circle cx="50" cy="20" r="1" fill="#8B5CF6" opacity="0.6" />
            <circle cx="50" cy="80" r="1" fill="#F59E0B" opacity="0.6" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default PrivateVaultLogo;