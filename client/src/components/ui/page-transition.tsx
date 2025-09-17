import * as React from "react";

export interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

export function PageTransition({ as = "div", className, children, ...props }: PageTransitionProps) {
  const Comp = as as React.ElementType;
  return (
    <Comp
      className={[
        "will-change-transform will-change-opacity",
        "animate-[fade-in_0.25s_ease-out]",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default PageTransition;



