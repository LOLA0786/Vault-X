import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Shield,
  Info,
  Lock,
  Eye,
  Key,
  Database,
  CheckCircle,
  Sparkles,
  Globe,
  ArrowRight,
  Fingerprint,
  ShieldCheck,
  Zap,
  Star,
  Users,
  Award
} from 'lucide-react';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { SecurityBadge, TrustScore } from '@/components/ui/security-badge';
import { Footer } from '@/components/ui/footer';
import { PageTransition } from '@/components/ui/page-transition';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernContainer, ModernGrid } from '@/components/ui/modern-layout';
import { ModernInput } from '@/components/ui/modern-input';

export default function Onboarding() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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

      setLocation('/');
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Enhanced Background with Animated Elements */}
      <div className="absolute inset-0 bg-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" />



      <div className="flex-1 py-16 relative z-10">
        <ModernContainer size="xl">
          <PageTransition>
            <ModernGrid cols={2} gap="xl" responsive>
              {/* Left Side - Modern Hero Section */}
              <div className="space-y-12">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-8 mb-12">
                    <div className="relative group">
                      {/* Custom Private Vault Logo */}
                      <div className="relative">
                        <PrivateVaultLogo
                          size="xl"
                          animated={true}
                          className="group-hover:scale-105 transition-all duration-500 drop-shadow-2xl"
                        />


                      </div>
                    </div>
                    <div>
                      <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">
                        Private Vault
                      </h1>
                      <p className="text-xl text-muted-foreground font-semibold">Your Secure AI Assistant</p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                          <Users className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">10K+ Users</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <Award className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Enterprise Grade</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-6xl font-bold text-foreground leading-tight">
                      {isLogin ? (
                        <>
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome Back
                          </span>
                          <br />
                          <span className="text-4xl text-muted-foreground font-normal">
                            Access Your Vault
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            Maximum Security
                          </span>
                          <br />
                          <span className="text-4xl text-muted-foreground font-normal">
                            Zero-Knowledge AI
                          </span>
                        </>
                      )}
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                      {isLogin
                        ? 'Sign in to access your private, encrypted AI assistant with enterprise-grade security and complete privacy protection.'
                        : 'Your private AI workspace with client-side encryption. We never see your data, ensuring complete privacy and security.'
                      }
                    </p>
                  </div>
                </div>

                {/* Modern Security Features */}
                <ModernGrid cols={2} gap="lg">
                  <ModernCard variant="glass" hover="lift" className="group">
                    <ModernCardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">AES-256 Encryption</h3>
                      </div>
                      <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                        Military-grade encryption protects your files before they leave your device.
                      </p>
                      <SecurityBadge variant="encrypted" size="md" className="group-hover:scale-110 transition-transform duration-300">
                        End-to-End
                      </SecurityBadge>
                    </ModernCardContent>
                  </ModernCard>

                  <ModernCard variant="glass" hover="lift" className="group">
                    <ModernCardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Zero-Knowledge</h3>
                      </div>
                      <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                        We can't access your data even if we wanted to. Complete privacy guaranteed.
                      </p>
                      <SecurityBadge variant="verified" size="md" className="group-hover:scale-110 transition-transform duration-300">
                        Privacy First
                      </SecurityBadge>
                    </ModernCardContent>
                  </ModernCard>

                  <ModernCard variant="glass" hover="lift" className="group">
                    <ModernCardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Key className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Local Key Management</h3>
                      </div>
                      <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                        Encryption keys generated and stored locally. Never transmitted to our servers.
                      </p>
                      <SecurityBadge variant="secure" size="md" className="group-hover:scale-110 transition-transform duration-300">
                        Local Control
                      </SecurityBadge>
                    </ModernCardContent>
                  </ModernCard>

                  <ModernCard variant="glass" hover="lift" className="group">
                    <ModernCardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Database className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Secure Storage</h3>
                      </div>
                      <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                        Enterprise-grade infrastructure with encrypted data at rest and in transit.
                      </p>
                      <SecurityBadge variant="secure" size="md" className="group-hover:scale-110 transition-transform duration-300">
                        Enterprise Grade
                      </SecurityBadge>
                    </ModernCardContent>
                  </ModernCard>
                </ModernGrid>

                {/* Trust Score */}
                <ModernCard variant="security" className="overflow-hidden">

                  <ModernCardContent className="relative p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">Security Rating</h3>
                        <p className="text-base text-muted-foreground">Independently verified security standards</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-emerald-500" />
                        <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">Certified</span>
                      </div>
                    </div>
                    <TrustScore score={98} label="Security Score" size="lg" />
                    <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4" />
                        <span className="font-medium">FIPS 140-2 Compliant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="font-medium">SOC 2 Type II</span>
                      </div>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              </div>

              {/* Right Side - Enhanced Auth Form */}
              <div className="max-w-lg mx-auto w-full">
                <ModernCard variant="glass" className="shadow-2xl backdrop-blur-xl border-white/20 overflow-hidden">
                  {/* Animated header background */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-violet-500/10 animate-pulse" />

                  <ModernCardHeader className="text-center pb-8 relative">
                    <div className="relative mx-auto mb-12 group">
                      {/* Custom Private Vault Logo - smaller version for auth form */}
                      <div className="relative">
                        <PrivateVaultLogo
                          size="lg"
                          animated={true}
                          className="group-hover:scale-110 transition-all duration-500 drop-shadow-xl"
                        />



                        {/* Status indicator - positioned below with proper spacing */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-700 shadow-md">
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Private Vault</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ModernCardTitle className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                      {isLogin ? 'Welcome Back' : 'Join Private Vault'}
                    </ModernCardTitle>

                    <div className="text-lg text-muted-foreground mb-4">
                      {isLogin
                        ? 'Access your encrypted AI workspace'
                        : 'Set up your private, zero-knowledge AI assistant'
                      }
                    </div>

                    {/* Progress indicator for new users */}
                    {!isLogin && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                        <div className="w-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                        <div className="w-8 h-1 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                        <div className="w-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                      </div>
                    )}
                  </ModernCardHeader>
                  <ModernCardContent className="space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-semibold flex items-center gap-3">
                          <Globe className="h-5 w-5 text-blue-500" />
                          Email Address
                        </Label>
                        <ModernInput
                          id="email"
                          type="email"
                          variant="outlined"
                          inputSize="lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-base font-semibold flex items-center gap-3">
                          <Lock className="h-5 w-5 text-blue-500" />
                          Password
                        </Label>
                        <ModernInput
                          id="password"
                          type="password"
                          variant="outlined"
                          inputSize="lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </div>

                      {!isLogin && (
                        <div className="space-y-3">
                          <Label htmlFor="confirmPassword" className="text-base font-semibold flex items-center gap-3">
                            <Shield className="h-5 w-5 text-blue-500" />
                            Confirm Password
                          </Label>
                          <ModernInput
                            id="confirmPassword"
                            type="password"
                            variant="outlined"
                            inputSize="lg"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                          />
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading}
                        variant="premium"
                        size="xl"
                        className="w-full shadow-2xl group"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        )}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-card px-4 text-muted-foreground font-medium">Or</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="xl"
                      onClick={() => setIsLogin(!isLogin)}
                      className="w-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                    >
                      {isLogin ? 'Create New Account' : 'Sign In to Existing Account'}
                    </Button>

                    <ModernCard variant="security" className="mt-8">
                      <ModernCardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Info className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground mb-2">Your data is secure</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              All data is encrypted client-side before transmission. Your encryption keys never leave your device.
                            </p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>
                  </ModernCardContent>
                </ModernCard>
              </div>
            </ModernGrid>
          </PageTransition>
        </ModernContainer>
      </div>
      <Footer />
    </div>
  );
}
