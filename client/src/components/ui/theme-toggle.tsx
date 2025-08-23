import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      className="w-full flex items-center justify-center mt-4"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      data-testid="theme-toggle"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 mr-2" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 mr-2" />
          Dark Mode
        </>
      )}
    </Button>
  );
}
