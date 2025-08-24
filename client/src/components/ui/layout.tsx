import * as React from "react";
import { cn } from "@/lib/utils";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface MainContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hasSidebar?: boolean;
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "min-h-screen bg-background text-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Layout.displayName = "Layout";

const MainContent = React.forwardRef<HTMLDivElement, MainContentProps>(
  ({ className, children, hasSidebar = false, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen",
          hasSidebar && "lg:ml-64",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MainContent.displayName = "MainContent";

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, spacing = 'md', ...props }, ref) => {
    const spacingClasses = {
      none: '',
      sm: 'py-4',
      md: 'py-8',
      lg: 'py-12',
      xl: 'py-16',
    };

    return (
      <section
        className={cn(
          "w-full",
          spacingClasses[spacing],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

export { Layout, MainContent, Section };