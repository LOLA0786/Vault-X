import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from '@/components/ui/sidebar';
import { Container } from '@/components/ui/container';
import { Layout, MainContent, Section } from '@/components/ui/layout';
import { useAuth } from '@/hooks/use-auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setLocation(`/${tab === 'dashboard' ? '' : tab}`);
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
        <div className="flex-1 w-full h-full min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}