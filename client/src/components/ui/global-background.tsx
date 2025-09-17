import * as React from "react";

export interface GlobalBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "subtle" | "moderate";
  parallax?: boolean;
}

export function GlobalBackground({ intensity = "subtle", parallax = false, className, ...props }: GlobalBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!parallax) return;
    const node = containerRef.current;
    if (!node) return;

    let rafId = 0;
    const onMove = () => {
      const y = window.scrollY || window.pageYOffset;
      const x = (window.innerWidth / 2 - (document.documentElement.scrollLeft || 0)) * 0.0;
      node.style.setProperty("--parallax-x", `${x}px`);
      node.style.setProperty("--parallax-y", `${Math.min(y * 0.08, 80)}px`);
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(onMove);
    };
    onMove();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [parallax]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={[
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {/* Gradient wash */}
      <div className="absolute -inset-20 bg-gradient-to-b from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:via-transparent dark:to-primary/20" />

      {/* Radial spotlight */}
      <div
        className="absolute left-1/2 top-[-10%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20 will-change-transform"
        style={{ transform: parallax ? `translate(calc(-50% + var(--parallax-x, 0px)), var(--parallax-y, 0px))` : undefined }}
      />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]" style={{
        backgroundImage:
          "radial-gradient(circle at 25% 25%, rgba(0,0,0,0.9) 0.5px, transparent 0.5px)",
        backgroundSize: intensity === "subtle" ? "24px 24px" : "16px 16px",
      }} />

      {/* Grid lines */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06] dark:opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

export default GlobalBackground;

