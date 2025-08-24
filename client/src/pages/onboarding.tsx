import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Info, 
  Lock, 
  Eye, 
  Key, 
  Database, 
  CheckCircle, 
  Zap,
  Globe,
  Server,
  ArrowRight,
  Sparkles,
  Fingerprint,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { SecurityBadge, SecurityStatus, TrustScore, SecurityIcon } from '@/components/ui/security-badge';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Security Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Enhanced Security Features */}
          <div className="space-y-10">
            {/* Enhanced Header */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                    <Shield className="text-white h-10 w-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-security-500 to-security-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="text-white h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Vault-X
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">Enterprise Security Platform</p>
                </div>
              </div>
              <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
                {isLogin ? 'Welcome Back' : 'Maximum Security'}
                <br />
                <span className="text-3xl text-muted-foreground font-normal">
                  {isLogin ? 'Access Your Vault' : 'Zero-Knowledge AI'}
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {isLogin 
                  ? 'Sign in to access your private, encrypted AI assistant with enterprise-grade security.'
                  : 'Your private AI workspace with client-side encryption. We never see your data.'
                }
              </p>
            </div>

            {/* Enhanced Security Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="security-panel group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <SecurityIcon type="lock" size="md" />
                  <h3 className="font-semibold text-foreground text-lg">AES-256 Encryption</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Military-grade encryption protects your files before they leave your device.
                </p>
                <SecurityBadge variant="encrypted" size="sm" className="group-hover:scale-110 transition-transform duration-200">
                  End-to-End
                </SecurityBadge>
              </div>

              <div className="security-panel group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <SecurityIcon type="eye" size="md" />
                  <h3 className="font-semibold text-foreground text-lg">Zero-Knowledge</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  We can't access your data even if we wanted to. Complete privacy guaranteed.
                </p>
                <SecurityBadge variant="verified" size="sm" className="group-hover:scale-110 transition-transform duration-200">
                  Privacy First
                </SecurityBadge>
              </div>

              <div className="security-panel group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <SecurityIcon type="key" size="md" />
                  <h3 className="font-semibold text-foreground text-lg">Local Key Management</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Encryption keys generated and stored locally. Never transmitted to our servers.
                </p>
                <SecurityBadge variant="secure" size="sm" className="group-hover:scale-110 transition-transform duration-200">
                  Local Control
                </SecurityBadge>
              </div>

              <div className="security-panel group hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <SecurityIcon type="database" size="md" />
                  <h3 className="font-semibold text-foreground text-lg">Secure Storage</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Enterprise-grade infrastructure with encrypted data at rest and in transit.
                </p>
                <SecurityBadge variant="secure" size="sm" className="group-hover:scale-110 transition-transform duration-200">
                  Enterprise Grade
                </SecurityBadge>
              </div>
            </div>

            {/* Enhanced Trust Score */}
            <div className="security-panel">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Security Rating</h3>
                  <p className="text-sm text-muted-foreground">Independently verified security standards</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-security-500" />
                                     <span className="text-sm font-medium text-emerald-600">Certified</span>
                </div>
              </div>
              <TrustScore score={98} label="Security Score" size="lg" />
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4" />
                  <span>FIPS 140-2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>SOC 2 Type II</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Auth Form */}
          <div className="max-w-md mx-auto w-full">
            <Card className="card-professional shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <div className="relative mx-auto mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Shield className="text-white h-8 w-8" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-white h-3 w-3" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mb-2">
                  {isLogin ? 'Secure Login' : 'Create Secure Account'}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {isLogin 
                    ? 'Access your encrypted AI workspace'
                    : 'Set up your private, zero-knowledge AI assistant'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-security h-12 text-base"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-500" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-security h-12 text-base"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-security h-12 text-base"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="btn-security w-full h-12 text-base font-semibold group"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    )}
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full h-12 text-base font-medium border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-200"
                >
                  {isLogin ? 'Create New Account' : 'Sign In to Existing Account'}
                </Button>
                
                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-emerald-200 dark:border-slate-600">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-1">Your data is secure</p>
                      <p className="text-muted-foreground">
                        All data is encrypted client-side before transmission. Your encryption keys never leave your device.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
