import { useLocation } from 'wouter';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernContainer } from '@/components/ui/modern-layout';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/ui/page-transition';
import { Sidebar } from '@/components/ui/sidebar';
import { Footer } from '@/components/ui/footer';
import { Shield, Lock, Zap, ArrowRight, CheckCircle, Sparkles, Crown, Rocket } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function SubscriptionRequired() {
    const [, setLocation] = useLocation();
    const { user } = useAuth();

    const handleNavigation = (tab: string) => {
        if (tab === 'dashboard') {
            setLocation('/');
        } else if (tab === 'pricing') {
            setLocation('/pricing');
        } else if (tab === 'settings') {
            setLocation('/settings');
        } else if (tab === 'key-info') {
            setLocation('/key-info');
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-background text-foreground">
                {/* Sidebar */}
                <Sidebar activeTab="pricing" onTabChange={handleNavigation} />

                {/* Main Content */}
                <div className="ml-0 lg:ml-64 flex flex-col min-h-screen">
                    <div className="flex-1">
                        {/* Hero Section */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border-b">
                            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                            <ModernContainer className="relative py-16 lg:py-24">
                                <div className="text-center max-w-3xl mx-auto">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
                                        <Sparkles className="w-4 h-4" />
                                        Unlock Premium Features
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Choose Your Plan
                                    </h1>
                                    <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                                        Get access to secure encrypted storage, AI-powered chat, and custom AI agents.
                                        All with zero-knowledge encryption.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button
                                            size="lg"
                                            className="text-lg px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                                            onClick={() => setLocation('/pricing')}
                                        >
                                            View All Plans
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="text-lg px-8"
                                            onClick={() => setLocation('/')}
                                        >
                                            Back to Dashboard
                                        </Button>
                                    </div>
                                </div>
                            </ModernContainer>
                        </div>

                        {/* Features Grid */}
                        <ModernContainer className="py-12">
                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                <ModernCard className="border-2 hover:border-violet-500 transition-colors">
                                    <ModernCardContent className="pt-6">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">Military-Grade Security</h3>
                                        <p className="text-sm text-muted-foreground">
                                            AES-256 encryption with zero-knowledge architecture. Your data is encrypted before it leaves your device.
                                        </p>
                                    </ModernCardContent>
                                </ModernCard>

                                <ModernCard className="border-2 hover:border-violet-500 transition-colors">
                                    <ModernCardContent className="pt-6">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">AI-Powered Intelligence</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Chat with AI about your documents, get insights, and create custom AI agents tailored to your needs.
                                        </p>
                                    </ModernCardContent>
                                </ModernCard>

                                <ModernCard className="border-2 hover:border-violet-500 transition-colors">
                                    <ModernCardContent className="pt-6">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4">
                                            <Lock className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">Complete Privacy</h3>
                                        <p className="text-sm text-muted-foreground">
                                            We can't access your data. Only you hold the encryption keys. True privacy guaranteed.
                                        </p>
                                    </ModernCardContent>
                                </ModernCard>
                            </div>

                            {/* Quick Plan Comparison */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Starter */}
                                <ModernCard className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-violet-500">
                                    <ModernCardContent className="pt-6">
                                        <div className="mb-4">
                                            <Rocket className="w-8 h-8 text-violet-600 mb-2" />
                                            <h3 className="font-bold text-xl mb-1">Starter</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-violet-600">$7</span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2 mb-6">
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>50GB Storage</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>200 AI chats/month</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>3 Devices</span>
                                            </li>
                                        </ul>
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={() => setLocation('/pricing')}
                                        >
                                            Get Started
                                        </Button>
                                    </ModernCardContent>
                                </ModernCard>

                                {/* Personal */}
                                <ModernCard className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-violet-500">
                                    <ModernCardContent className="pt-6">
                                        <div className="mb-4">
                                            <Zap className="w-8 h-8 text-purple-600 mb-2" />
                                            <h3 className="font-bold text-xl mb-1">Personal</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-purple-600">$15</span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2 mb-6">
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>200GB Storage</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>800 AI chats/month</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>5 Devices</span>
                                            </li>
                                        </ul>
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={() => setLocation('/pricing')}
                                        >
                                            Get Started
                                        </Button>
                                    </ModernCardContent>
                                </ModernCard>

                                {/* Pro - Highlighted */}
                                <ModernCard className="relative hover:shadow-2xl transition-all duration-300 border-2 border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                                        BEST VALUE
                                    </div>
                                    <ModernCardContent className="pt-6">
                                        <div className="mb-4">
                                            <Crown className="w-8 h-8 text-violet-600 mb-2" />
                                            <h3 className="font-bold text-xl mb-1">Pro</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-violet-600">$39</span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2 mb-6">
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>500GB Storage</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>3,000 AI chats/month</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>Unlimited Devices</span>
                                            </li>
                                        </ul>
                                        <Button
                                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                                            onClick={() => setLocation('/pricing')}
                                        >
                                            Get Started
                                        </Button>
                                    </ModernCardContent>
                                </ModernCard>

                                {/* Business */}
                                <ModernCard className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-violet-500">
                                    <ModernCardContent className="pt-6">
                                        <div className="mb-4">
                                            <Shield className="w-8 h-8 text-pink-600 mb-2" />
                                            <h3 className="font-bold text-xl mb-1">Business</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-pink-600">$199</span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2 mb-6">
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>2TB Storage</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>15,000 AI chats/month</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span>Up to 10 Users</span>
                                            </li>
                                        </ul>
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={() => setLocation('/pricing')}
                                        >
                                            Contact Sales
                                        </Button>
                                    </ModernCardContent>
                                </ModernCard>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-16 text-center">
                                <p className="text-sm text-muted-foreground mb-6">Trusted by thousands of users worldwide</p>
                                <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <span>AES-256 Encryption</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-blue-600" />
                                        <span>Zero-Knowledge</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-violet-600" />
                                        <span>GDPR Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-orange-600" />
                                        <span>99.9% Uptime</span>
                                    </div>
                                </div>
                            </div>
                        </ModernContainer>
                    </div>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </PageTransition>
    );
}
