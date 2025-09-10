import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type User } from '@shared/schema';
import { EncryptionService } from '@/lib/encryption';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      // Fetch user data (encryption key will be handled by onboarding if needed)
      fetchUser(userEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (email: string) => {
    try {
      console.log('[Auth Debug] Fetching user with email:', email);
      const response = await fetch(`/api/users/${email}`);
      if (response.ok) {
        const userData = await response.json();
        console.log('[Auth Debug] User data retrieved:', userData);
        setUser(userData);
      } else {
        console.error('[Auth Debug] Failed to fetch user, status:', response.status);
      }
    } catch (error) {
      console.error('[Auth Debug] Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // Create user with email and password
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const userData = await response.json();
      
      // Mark as new user for onboarding
      localStorage.setItem('vault_x_is_new_user', 'true');
      
      // Store user session (encryption key will be handled by onboarding)
      localStorage.setItem('user_email', email);
      setUser(userData);
    } catch (error) {
      throw new Error('Registration failed: ' + (error as Error).message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Check if user exists
      const response = await fetch(`/api/users/${email}`);
      if (!response.ok) {
        throw new Error('User not found');
      }

      const userData = await response.json();
      
      // Store user session (encryption key will be handled by onboarding if needed)
      localStorage.setItem('user_email', email);
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed: ' + (error as Error).message);
    }
  };

  const logout = () => {
    EncryptionService.removeKey();
    localStorage.removeItem('user_email');
    localStorage.removeItem('vault_x_is_new_user');
    localStorage.removeItem('vault_x_encryption_onboarding_complete');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
