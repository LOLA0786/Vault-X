import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function Onboarding() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin 
          ? "You have successfully logged in to your AI Vault"
          : "Your private AI vault has been set up with client-side encryption",
      });
    } catch (error) {
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white text-2xl h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Welcome to AI Vault'}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to access your private AI assistant'
              : 'Set up your private, encrypted AI assistant'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Sign In' : 'Create Account'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Enter your credentials to access your vault'
                : 'Your encryption keys will be generated locally'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  data-testid="email-input"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  {isLogin ? 'Password' : 'Master Password'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  required
                  data-testid="password-input"
                />
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-1">
                    Used to derive your local encryption key
                  </p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    data-testid="confirm-password-input"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="text-primary mt-1 h-4 w-4" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Privacy First Design</p>
                      <ul className="text-xs space-y-1 text-blue-700">
                        <li>• Encryption keys generated locally</li>
                        <li>• Server never sees your data</li>
                        <li>• Keys stored in browser only</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isLoading}
                  data-testid="toggle-mode-button"
                >
                  {isLogin ? 'Create Account' : 'Sign In Instead'}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                  data-testid="submit-button"
                >
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Set Up Vault')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
