import * as React from "react";

export function PremiumGlowHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 backdrop-blur shadow-xl">
      <div className="absolute inset-0 opacity-40 blur-3xl" style={{
        background: "radial-gradient(600px circle at 0% 0%, rgba(59,130,246,0.15), transparent 40%), radial-gradient(600px circle at 100% 100%, rgba(16,185,129,0.15), transparent 40%)"
      }} />
      <div className="relative p-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default PremiumGlowHeader;



