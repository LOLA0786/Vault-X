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
    // Check if user is logged in and has valid encryption key
    const userEmail = localStorage.getItem('user_email');
    if (userEmail && EncryptionService.hasValidKey()) {
      // Fetch user data
      fetchUser(userEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (email: string) => {
    try {
      const response = await fetch(`/api/users/${email}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // Create user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const userData = await response.json();
      
      // Generate and store encryption key
      const encryptionKey = EncryptionService.deriveKeyFromPassword(password);
      EncryptionService.storeKey(encryptionKey);
      
      // Store user session
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
      
      // Derive encryption key from password
      const encryptionKey = EncryptionService.deriveKeyFromPassword(password);
      EncryptionService.storeKey(encryptionKey);
      
      // Store user session
      localStorage.setItem('user_email', email);
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed: ' + (error as Error).message);
    }
  };

  const logout = () => {
    EncryptionService.removeKey();
    localStorage.removeItem('user_email');
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
