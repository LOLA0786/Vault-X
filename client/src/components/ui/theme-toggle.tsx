import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
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
      return <Monitor className="w-4 h-4 transition-transform duration-200" />;
    }
    return isDark ? (
      <Moon className="w-4 h-4 transition-transform duration-200 rotate-0 hover:-rotate-12" />
    ) : (
      <Sun className="w-4 h-4 transition-transform duration-200 rotate-0 hover:rotate-12" />
    );
  };

  const getThemeLabel = () => {
    if (isSystem) return 'System';
    return isDark ? 'Dark Mode' : 'Light Mode';
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label={`Currently ${getThemeLabel()}, click to change theme`}
      data-testid="theme-toggle"
      className={cn(
        "w-full justify-start gap-3 h-10 px-3 rounded-lg transition-all duration-200 group",
        "text-slate-300 hover:text-white hover:bg-slate-800 hover:bg-opacity-50",
        "border border-transparent hover:border-slate-600",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
        "bg-slate-700 bg-opacity-50 group-hover:bg-primary-500 group-hover:shadow-md",
        isSystem && "bg-purple-500 bg-opacity-20 group-hover:bg-purple-500"
      )}>
        {getThemeIcon()}
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium text-sm">{getThemeLabel()}</div>
        <div className="text-xs opacity-70">
          {isSystem ? 'Auto detect' : isDark ? 'Currently active' : 'Currently active'}
        </div>
      </div>
      <div className={cn(
        "w-2 h-2 rounded-full transition-all duration-200",
        isDark ? "bg-blue-400" : "bg-amber-400",
        isSystem && "bg-purple-400"
      )} />
    </Button>
  );
}
