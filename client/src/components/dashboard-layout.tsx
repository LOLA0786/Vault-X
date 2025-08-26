import { useLocation } from 'wouter';
import { Sidebar } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();

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
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 w-full min-h-0 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}