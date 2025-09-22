import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export function MobileThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-10 bg-slate-800 bg-opacity-50 rounded-lg animate-pulse" />
    );
  }

  const isDark = resolvedTheme === 'dark';
  const isSystem = theme === 'system';

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (isSystem) {
      return <Monitor className="w-5 h-5 transition-transform duration-200" />;
    }
    return isDark ? (
      <Moon className="w-5 h-5 transition-transform duration-200 rotate-0 hover:-rotate-12" />
    ) : (
      <Sun className="w-5 h-5 transition-transform duration-200 rotate-0 hover:rotate-12" />
    );
  };

  const getThemeLabel = () => {
    if (isSystem) return 'System Theme';
    return isDark ? 'Dark Mode' : 'Light Mode';
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label={`Currently ${getThemeLabel()}, click to change theme`}
      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
    >
      <span className="mr-3">
        {getThemeIcon()}
      </span>
      {getThemeLabel()}
    </Button>
  );
}