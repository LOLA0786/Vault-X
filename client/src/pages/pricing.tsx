import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '@/lib/payment-service';

// Layout Components
import { Sidebar } from '@/components/ui/sidebar';
import { ModernHeader } from '@/components/ui/modern-header';
import { Footer } from '@/components/ui/footer';
import { PageTransition } from '@/components/ui/page-transition';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Modern UI Components
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle, ModernCardDescription } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { MobileThemeToggle } from '@/components/ui/mobile-theme-toggle';
import { getNavigationItems } from '@/components/ui/modern-navigation';

// Icons
import {
  Check,
  Star,
  Shield,
  Zap,
  Users,
  HardDrive,
  MessageSquare,
  Smartphone,
  Crown,
  Building,
  Infinity,
  ArrowRight,
  Menu,
  User,
  LogOut,
  Lock,
  X,
  Sparkles,
  Activity,
  Briefcase,
  Award
} from 'lucide-react';

// Mobile Pricing Component
function MobilePricing({
  renderContent
}: {
  renderContent: () => React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const navigationItems = getNavigationItems(user);

  const handleTabChange = (tab: string) => {
    if (tab === 'dashboard') {
      setLocation('/');
      return;
    }
    if (tab === 'vault') {
      setLocation('/vault');
      return;
    }
    if (tab === 'chat') {
      setLocation('/chat');
      return;
    }
    if (tab === 'agents') {
      setLocation('/agents');
      return;
    }
    if (tab === 'history') {
      setLocation('/history');
      return;
    }
    if (tab === 'pricing') {
      setLocation('/pricing');
      return;
    }
    if (tab === 'settings') {
      setLocation('/settings');
      return;
    }
    if (tab === 'key-info') {
      setLocation('/key-info');
      return;
    }
    if (tab === 'admin') {
      setLocation('/admin');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full bg-sidebar">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <PrivateVaultLogo size="sm" animated={true} className="drop-shadow-lg" />
                      <div>
                        <h1 className="text-lg font-bold text-sidebar-foreground">Private Vault</h1>
                        <p className="text-xs text-sidebar-foreground/70">Your Secure AI Assistant</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="flex-1 p-4">
                    <div className="space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.id === 'pricing';
                        return (
                          <Button
                            key={item.id}
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                            onClick={() => {
                              if (item.id !== 'pricing') {
                                handleTabChange(item.id);
                              }
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Theme Toggle */}
                    <div className="px-4 pt-4 border-t border-border/30">
                      <MobileThemeToggle />
                    </div>
                  </nav>

                  {user && (
                    <div className="mt-auto p-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-sidebar-foreground truncate">
                          {user.email}
                        </span>
                        <Button variant="ghost" size="sm" onClick={logout}>
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-3">
              <PrivateVaultLogo size="sm" animated={true} className="drop-shadow-md" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Pricing Plans</h1>
                <p className="text-xs text-muted-foreground">Choose your secure AI journey</p>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            <User className="h-5 w-5" />
          </Button>
        </div >
      </header >

      <main className="flex-1 pb-4">
        {renderContent()}
      </main>

      <Footer />
    </div >
  );
}

export default function PricingPage() {
  const { user, logout, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Debug log to check if page is loading
  useEffect(() => {
    console.log('Pricing page loaded/mounted');
  }, []);

  const handleTabChange = (tab: string) => {
    console.log('Pricing page handleTabChange called with tab:', tab);
    if (tab === 'dashboard') {
      setLocation('/');
      return;
    }
    if (tab === 'vault') {
      setLocation('/vault');
      return;
    }
    if (tab === 'chat') {
      setLocation('/chat');
      return;
    }
    if (tab === 'agents') {
      setLocation('/agents');
      return;
    }
    if (tab === 'history') {
      setLocation('/history');
      return;
    }
    if (tab === 'settings') {
      setLocation('/settings');
      return;
    }
    if (tab === 'key-info') {
      setLocation('/key-info');
      return;
    }
    if (tab === 'pricing') {
      // Always allow navigation to pricing, even if already on pricing page
      console.log('Navigating to pricing page');
      setLocation('/pricing');
      return;
    }
    if (tab === 'admin') {
      console.log('Navigating to admin page');
      setLocation('/admin');
      return;
    }
  };

  const handlePayment = async (plan: any) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase a plan.",
        variant: "destructive"
      });
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;

    try {
      setLoading(prev => ({ ...prev, [plan.name]: true }));

      // Set a timeout to automatically reset loading state after 5 minutes
      timeoutId = setTimeout(() => {
        setLoading(prev => ({ ...prev, [plan.name]: false }));
        toast({
          title: "Payment Timeout",
          description: "Payment process timed out. Please try again.",
          variant: "destructive"
        });
      }, 300000); // 5 minutes

      // Extract price from string (remove $ and convert to number)
      const priceString = plan.price.replace('$', '');
      const price = parseFloat(priceString);

      // Create order with plan details
      const orderData = await PaymentService.createOrder({
        amount: price,
        currency: 'USD',
        description: `${plan.name} - ${plan.period}`,
        planId: plan.name.toLowerCase().replace(/\s+/g, '-'),
        planName: plan.name,
        billingPeriod: billingCycle === 'monthly' ? 'month' : 'year'
      }, user.id); // Pass the user ID

      if (!orderData.success || !orderData.order || !orderData.key) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Show currency conversion info if payment will be in INR
      if (orderData.order.currency === 'INR') {
        toast({
          title: "Currency Conversion",
          description: `${price} USD has been converted to ₹${(orderData.order.amount / 100).toFixed(2)} INR for payment processing.`,
          variant: "default"
        });
      }

      // Open Razorpay checkout with plan amount
      try {
        const response = await PaymentService.openRazorpayCheckout(orderData);

        // Verify payment
        const verificationData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          plan_id: plan.name.toLowerCase().replace(/\s+/g, '-')
        };

        const verification = await PaymentService.verifyPayment(verificationData);

        if (verification.success) {
          toast({
            title: "Payment Successful!",
            description: `Your ${plan.name} subscription is now active. Welcome to PrivateVaultAI!`,
            variant: "default"
          });
          
          // Refresh user data to get updated subscription info
          console.log('[Payment] Refreshing user data after successful payment');
          await refreshUser();
          
          // Redirect to dashboard
          setTimeout(() => {
            setLocation('/dashboard');
          }, 2000);
        } else {
          throw new Error(verification.error || 'Payment verification failed');
        }
      } catch (checkoutError: any) {
        // Handle specific payment cancellation
        if (checkoutError.message === 'Payment cancelled by user') {
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment. You can try again anytime.",
            variant: "default"
          });
          return; // Exit early without showing error
        }
        // Re-throw other errors to be handled by the outer catch block
        throw checkoutError;
      }
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong with your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Clear the timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setLoading(prev => ({ ...prev, [plan.name]: false }));
    }
  };

  const plans = [
    {
      name: "Starter Plan",
      subtitle: "Perfect for individuals",
      price: billingCycle === 'monthly' ? "$7" : "$70",
      period: billingCycle === 'monthly' ? "/month" : "/year",
      originalPrice: billingCycle === 'annual' ? "$84" : undefined,
      description: "Essential features for personal secure file management",
      badge: "Most Popular",
      badgeColor: "bg-green-500",
      features: [
        { icon: HardDrive, text: "50 GB Storage", included: true },
        { icon: MessageSquare, text: "200 AI chats/month", included: true },
        { icon: Smartphone, text: "3 Devices", included: true },
        { icon: Shield, text: "End-to-End Encryption", included: true },
        { icon: Lock, text: "Zero-Knowledge Security", included: true }
      ] as Array<{ icon: any; text: string; included: boolean; note?: string }>,
      cta: "Get Started",
      ctaVariant: "default" as const,
      popular: true
    },
    {
      name: "Personal Plan",
      subtitle: "For power users",
      price: billingCycle === 'monthly' ? "$15" : "$150",
      period: billingCycle === 'monthly' ? "/month" : "/year",
      originalPrice: billingCycle === 'annual' ? "$180" : undefined,
      description: "Enhanced storage and AI capabilities for personal use",
      features: [
        { icon: HardDrive, text: "200 GB Storage", included: true },
        { icon: MessageSquare, text: "800 chats/month", included: true },
        { icon: Smartphone, text: "5 Devices", included: true },
        { icon: Shield, text: "End-to-End Encryption", included: true },
        { icon: Lock, text: "Zero-Knowledge Security", included: true },
        { icon: Zap, text: "Priority Support", included: true }
      ] as Array<{ icon: any; text: string; included: boolean; note?: string }>,
      cta: "Upgrade to Personal",
      ctaVariant: "outline" as const
    },
    {
      name: "Pro Plan",
      subtitle: "For professionals & creators",
      price: billingCycle === 'monthly' ? "$39" : "$390",
      period: billingCycle === 'monthly' ? "/month" : "/year",
      originalPrice: billingCycle === 'annual' ? "$468" : undefined,
      description: "Advanced features for small businesses and content creators",
      badge: "Best Value",
      badgeColor: "bg-violet-500",
      features: [
        { icon: HardDrive, text: "500 GB Storage", included: true },
        { icon: MessageSquare, text: "3,000 chats/month", included: true },
        { icon: Infinity, text: "Unlimited Devices", included: true },
        { icon: Users, text: "Advanced Sharing", included: true },
        { icon: Shield, text: "API Access", included: true },
        { icon: Zap, text: "24/7 Support", included: true }
      ] as Array<{ icon: any; text: string; included: boolean; note?: string }>,
      cta: "Upgrade to Pro",
      ctaVariant: "premium" as const,
      popular: false
    },
    {
      name: "Business Plan",
      subtitle: "For growing teams",
      price: billingCycle === 'monthly' ? "$199" : "$1,990",
      period: billingCycle === 'monthly' ? "/month" : "/year",
      originalPrice: billingCycle === 'annual' ? "$2,388" : undefined,
      description: "Enterprise-grade features for business teams",
      features: [
        { icon: HardDrive, text: "2 TB Shared Storage", included: true },
        { icon: MessageSquare, text: "15,000 chats/month", included: true },
        { icon: Users, text: "Up to 10 Users", included: true },
        { icon: Building, text: "Admin Dashboard", included: true },
        { icon: Shield, text: "SSO & Audit Logs", included: true },
        { icon: Zap, text: "Dedicated Support", included: true }
      ] as Array<{ icon: any; text: string; included: boolean; note?: string }>,
      cta: "Contact Sales",
      ctaVariant: "outline" as const
    }
  ];

  const renderContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-violet-500/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <PageTransition>
        {/* Hero Section */}
        <div className="relative pt-20 pb-24 px-4 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-violet-400/20 to-purple-600/20 blur-3xl" />
              <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl" />
            </div>

            <div className="relative z-10">
              <Badge variant="secondary" className="mb-6 text-sm px-4 py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200 dark:border-violet-800">
                <Sparkles className="w-4 h-4 mr-2" />
                Choose Your Perfect Plan
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Simple, Transparent
                </span>
                <br />
                <span className="text-foreground">Pricing</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
                Secure, AI-powered file management with end-to-end encryption.
                <br className="hidden sm:block" />
                Start free and scale as you grow with confidence.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`text-base font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <div className="relative">
                  <button
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full border-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${billingCycle === 'annual'
                      ? 'bg-primary border-primary'
                      : 'bg-muted border-border'
                      }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
                <span className={`text-base font-semibold transition-colors ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Annual
                </span>
                {billingCycle === 'annual' && (
                  <Badge variant="default" className="ml-3 bg-green-500 text-white animate-pulse px-3 py-1 text-xs font-bold">
                    <Award className="w-3 h-3 mr-1" />
                    Save 20%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="px-4 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Horizontal Layout - 4 plans perfectly structured grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr">
              {plans.map((plan) => (
                <ModernCard
                  key={plan.name}
                  variant={plan.popular ? "premium" : "default"}
                  hover="lift"
                  className={`relative flex flex-col h-full transition-all duration-300 ${plan.popular
                    ? 'border-2 border-primary/50 shadow-xl shadow-primary/20 transform scale-[1.02]'
                    : 'hover:shadow-lg hover:scale-[1.01]'
                    }`}
                >
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${plan.badgeColor} z-10`}>
                      {plan.badge === 'Most Popular' && <Star className="w-3 h-3 inline mr-1" />}
                      {plan.badge === 'Best Value' && <Award className="w-3 h-3 inline mr-1" />}
                      {plan.badge === 'Custom' && <Crown className="w-3 h-3 inline mr-1" />}
                      {plan.badge}
                    </div>
                  )}

                  <ModernCardHeader className="pb-3 pt-6 text-center flex-shrink-0">
                    <div className="mb-3">
                      {plan.name === 'Starter Plan' && <HardDrive className="w-10 h-10 mx-auto mb-2 text-green-500" />}
                      {plan.name === 'Personal Plan' && <User className="w-10 h-10 mx-auto mb-2 text-blue-500" />}
                      {plan.name === 'Pro Plan' && <Sparkles className="w-10 h-10 mx-auto mb-2 text-violet-500" />}
                      {plan.name === 'Business Plan' && <Briefcase className="w-10 h-10 mx-auto mb-2 text-orange-500" />}
                    </div>

                    <ModernCardTitle className="text-lg font-bold mb-2 line-clamp-1">{plan.name}</ModernCardTitle>
                    <ModernCardDescription className="text-xs text-muted-foreground mb-3 min-h-[2rem] flex items-center justify-center text-center px-2 line-clamp-2">
                      {plan.subtitle}
                    </ModernCardDescription>

                    <div className="mb-3">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-black text-foreground">{plan.price}</span>
                        {plan.period !== 'forever' && plan.period !== 'contract' && (
                          <span className="text-xs text-muted-foreground">/{plan.period.replace('/', '')}</span>
                        )}
                        {(plan.period === 'forever' || plan.period === 'contract') && (
                          <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>
                        )}
                      </div>
                      {plan.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through mt-1">
                          {plan.originalPrice}/year
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed min-h-[2.5rem] flex items-center justify-center px-1 text-center">
                      {plan.description}
                    </p>
                  </ModernCardHeader>

                  <ModernCardContent className="pt-0 pb-4 flex-1 flex flex-col px-4">
                    <ul className="space-y-2 mb-4 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {feature.included ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <X className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <feature.icon className="h-3 w-3 text-primary flex-shrink-0" />
                              <span className="text-xs font-medium leading-tight truncate">{feature.text}</span>
                            </div>
                            {feature.note && (
                              <p className="text-xs text-muted-foreground mt-1 ml-4 leading-relaxed">{feature.note}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-2">
                      <Button
                        variant={plan.ctaVariant}
                        className="w-full group text-xs py-2 font-semibold"
                        size="sm"
                        onClick={() => handlePayment(plan)}
                        disabled={loading[plan.name]}
                      >
                        {loading[plan.name] ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            {plan.cta}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>

                      {loading[plan.name] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setLoading(prev => ({ ...prev, [plan.name]: false }));
                            toast({
                              title: "Payment Cancelled",
                              description: "Payment process has been cancelled.",
                              variant: "default"
                            });
                          }}
                        >
                          Cancel Payment
                        </Button>
                      )}
                    </div>
                  </ModernCardContent>
                </ModernCard>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-4 lg:px-8 py-24 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Why Choose VaultX?</h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Built for security, powered by AI, designed for scale. Experience the future of secure file management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <ModernCard hover="lift" className="text-center p-10 lg:p-12 h-full bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-6">Zero-Knowledge Security</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your data is encrypted client-side with AES-256. We never see your content - true zero-knowledge architecture ensures complete privacy.
                </p>
              </ModernCard>

              <ModernCard hover="lift" className="text-center p-10 lg:p-12 h-full bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Zap className="h-10 w-10 text-violet-500" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-6">AI-Powered Intelligence</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Advanced AI chat with multiple providers, custom agents, and intelligent file analysis capabilities for enhanced productivity.
                </p>
              </ModernCard>

              <ModernCard hover="lift" className="text-center p-10 lg:p-12 h-full bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Activity className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-6">Enterprise-Grade Scale</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From personal use to enterprise teams, VaultX grows with you. Dedicated infrastructure and custom solutions available.
                </p>
              </ModernCard>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-4 lg:px-8 py-24">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about VaultX pricing and features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-left">
              <ModernCard className="p-8 lg:p-10 h-full hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-foreground">Can I change plans anytime?</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.
                </p>
              </ModernCard>

              <ModernCard className="p-8 lg:p-10 h-full hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-foreground">What happens to my data if I downgrade?</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your data remains secure and accessible. You'll just have reduced storage and AI chat limits according to your new plan.
                </p>
              </ModernCard>

              <ModernCard className="p-8 lg:p-10 h-full hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-foreground">Is my data really secure?</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Absolutely. We use client-side AES-256 encryption. Your encryption key never leaves your device, ensuring true zero-knowledge security.
                </p>
              </ModernCard>

              <ModernCard className="p-8 lg:p-10 h-full hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-foreground">Do you offer discounts for teams?</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Yes! Business and Enterprise plans include volume discounts. Contact our sales team for custom pricing and enterprise solutions.
                </p>
              </ModernCard>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <MobilePricing renderContent={renderContent} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Sidebar - Outside any transform containers */}
        <Sidebar
          activeTab="pricing"
          onTabChange={handleTabChange}
        />

        {/* Main Content */}
        <div className="ml-64 flex flex-col min-h-screen bg-background text-foreground">
          {/* Modern Header */}
          <ModernHeader
            title="Pricing Plans"
            subtitle="Choose the perfect plan for your secure AI-powered workflow"
            user={user ? { email: user.email } : undefined}
            onLogout={logout}
            showSearch={false}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-background text-foreground">
            {renderContent()}
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}