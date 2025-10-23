import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
    Shield, Lock, Eye, Key, Zap, Globe, Users, Award,
    CheckCircle2, ArrowRight, Star, FileText,
    MessageSquare, Bot, Sparkles, ChevronDown
} from 'lucide-react';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { ModernCard, ModernCardContent } from '@/components/ui/modern-card';
import { SecurityBadge, TrustScore } from '@/components/ui/security-badge';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <PrivateVaultLogo size="sm" animated={true} />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                PrivateVault.ai
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                How It Works
                            </a>
                            <a href="#pricing" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Pricing
                            </a>
                            <a href="#security" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Security
                            </a>
                            <a href="#about" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                About
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="ghost" onClick={() => setLocation('/onboarding')}>
                                Sign In
                            </Button>
                            <Button variant="premium" onClick={() => setLocation('/onboarding')}>
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                    Trusted by 10,000+ users worldwide
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                                    Your Private AI
                                </span>
                                <br />
                                <span className="text-slate-900 dark:text-white">
                                    Workspace
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Secure file management with AI-powered intelligence.
                                <br className="hidden md:block" />
                                End-to-end encryption ensures your data stays private.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="xl" variant="premium" onClick={() => setLocation('/onboarding')} className="group">
                                    Get Started Now
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button size="xl" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                                    View Pricing
                                </Button>
                            </div>

                            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span>Instant setup</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span>Bank-level security</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span>Cancel anytime</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image/Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative max-w-5xl mx-auto"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                            {/* Fallback gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-violet-500/5" />

                            {/* Dashboard Screenshot */}
                            <img
                                src="/dashboard-preview.png"
                                alt="PrivateVault.ai Dashboard Preview"
                                className="w-full h-auto relative z-10"
                                loading="eager"
                                onError={(e) => {
                                    console.error('Dashboard preview image failed to load from /dashboard-preview.png');
                                    // Hide broken image icon
                                    e.currentTarget.style.display = 'none';
                                }}
                            />

                            {/* Fallback content if image doesn't load */}
                            <div className="absolute inset-0 flex items-center justify-center p-12 z-0">
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                        <Shield className="h-12 w-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-700 dark:text-slate-300">
                                        Secure Dashboard Preview
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Your encrypted workspace with AI-powered features
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="h-8 w-8 text-slate-400" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '10K+', label: 'Active Users' },
                            { value: '98%', label: 'Security Score' },
                            { value: '50GB+', label: 'Storage Per User' },
                            { value: '24/7', label: 'Support' }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Powerful Features
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Everything you need for secure file management and AI-powered productivity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                icon: Lock,
                                title: 'End-to-End Encryption',
                                description: 'Military-grade AES-256 encryption protects your files before they leave your device.',
                                color: 'from-blue-500 to-blue-600'
                            },
                            {
                                icon: Eye,
                                title: 'Zero-Knowledge Architecture',
                                description: 'We never see your data. Your encryption keys stay on your device, always.',
                                color: 'from-emerald-500 to-emerald-600'
                            },
                            {
                                icon: Bot,
                                title: 'AI-Powered Assistants',
                                description: 'Create custom AI agents to analyze, summarize, and work with your encrypted files.',
                                color: 'from-violet-500 to-violet-600'
                            },
                            {
                                icon: FileText,
                                title: 'Smart File Management',
                                description: 'Upload, organize, and search your files with intelligent categorization.',
                                color: 'from-amber-500 to-orange-600'
                            },
                            {
                                icon: MessageSquare,
                                title: 'Encrypted Chat History',
                                description: 'All your AI conversations are encrypted and stored securely.',
                                color: 'from-pink-500 to-rose-600'
                            },
                            {
                                icon: Zap,
                                title: 'Lightning Fast',
                                description: 'Optimized performance with chunked uploads and smart caching.',
                                color: 'from-cyan-500 to-blue-600'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <ModernCard variant="glass" hover="lift" className="h-full">
                                    <ModernCardContent className="p-8">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                            <feature.icon className="h-7 w-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </ModernCardContent>
                                </ModernCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            Get started in 3 simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Create Your Account',
                                description: 'Sign up in seconds. Your encryption key is generated locally on your device.',
                                icon: Users
                            },
                            {
                                step: '02',
                                title: 'Upload Your Files',
                                description: 'Drag and drop files. They\'re encrypted before upload using AES-256.',
                                icon: FileText
                            },
                            {
                                step: '03',
                                title: 'Chat with AI',
                                description: 'Ask questions, analyze data, and get insights from your secure files.',
                                icon: MessageSquare
                            }
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-xl">
                                        <span className="text-3xl font-black text-white">{step.step}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 opacity-30" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section id="security" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6">
                                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                    Bank-Level Security
                                </span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Your data security is our top priority. We use industry-leading encryption and security practices to keep your information safe.
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { icon: Shield, text: 'AES-256-GCM Encryption' },
                                    { icon: Key, text: 'Client-Side Key Generation' },
                                    { icon: Lock, text: 'Zero-Knowledge Architecture' },
                                    { icon: CheckCircle2, text: 'SOC 2 Type II Certified' },
                                    { icon: CheckCircle2, text: 'GDPR Compliant' },
                                    { icon: CheckCircle2, text: 'ISO 27001 Certified' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <item.icon className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <span className="text-lg font-semibold">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <Button size="lg" variant="outline" className="group" onClick={() => setLocation('/whitepaper')}>
                                Read Security Whitepaper
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div>
                            <ModernCard variant="security" className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
                                <ModernCardContent className="p-8 relative">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">Security Score</h3>
                                            <p className="text-slate-600 dark:text-slate-400">Independently verified</p>
                                        </div>
                                        <SecurityBadge variant="verified" size="lg">
                                            Certified
                                        </SecurityBadge>
                                    </div>

                                    <TrustScore score={98} label="Overall Security" size="lg" />

                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Encryption', score: 100 },
                                            { label: 'Privacy', score: 98 },
                                            { label: 'Compliance', score: 96 },
                                            { label: 'Infrastructure', score: 98 }
                                        ].map((metric, index) => (
                                            <div key={index} className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                                <div className="text-2xl font-bold text-emerald-600 mb-1">{metric.score}%</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </ModernCardContent>
                            </ModernCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            Choose the plan that fits your needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                name: 'Starter',
                                price: '$7',
                                period: '/month',
                                description: 'Perfect for individuals',
                                features: [
                                    '50GB Storage',
                                    '200 AI chats/month',
                                    '3 Devices',
                                    '3 AI Agents',
                                    'Max 100MB per file',
                                    '30 days history'
                                ],
                                popular: false
                            },
                            {
                                name: 'Personal',
                                price: '$15',
                                period: '/month',
                                description: 'For power users',
                                features: [
                                    '200GB Storage',
                                    '800 chats/month',
                                    '5 Devices',
                                    '10 AI Agents',
                                    'Max 500MB per file',
                                    '90 days history',
                                    'Priority Support'
                                ],
                                popular: true
                            },
                            {
                                name: 'Pro',
                                price: '$39',
                                period: '/month',
                                description: 'For professionals',
                                features: [
                                    '500GB Storage',
                                    '3,000 chats/month',
                                    'Unlimited Devices',
                                    'Unlimited AI Agents',
                                    'Max 2GB per file',
                                    '1 year history',
                                    'API Access',
                                    '24/7 Support'
                                ],
                                popular: false
                            },
                            {
                                name: 'Business',
                                price: '$199',
                                period: '/month',
                                description: 'For growing teams',
                                features: [
                                    '2TB Shared Storage',
                                    '15,000 chats/month',
                                    'Up to 10 Users',
                                    'Max 5GB per file',
                                    'Admin Dashboard',
                                    'SSO & Audit Logs',
                                    'Unlimited History',
                                    'Dedicated Support'
                                ],
                                popular: false
                            }
                        ].map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                        <div className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-xs font-bold shadow-lg">
                                            MOST POPULAR
                                        </div>
                                    </div>
                                )}
                                <ModernCard
                                    variant="glass"
                                    hover="lift"
                                    className={`h-full ${plan.popular ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : ''}`}
                                >
                                    <ModernCardContent className="p-8">
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{plan.description}</p>
                                            <div className="flex items-baseline justify-center">
                                                <span className="text-5xl font-black">{plan.price}</span>
                                                <span className="text-slate-600 dark:text-slate-400 ml-2">{plan.period}</span>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-start gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            variant={plan.popular ? 'premium' : 'outline'}
                                            className="w-full"
                                            onClick={() => setLocation('/onboarding')}
                                        >
                                            Get Started
                                        </Button>
                                    </ModernCardContent>
                                </ModernCard>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            All plans include enterprise-grade security • Cancel anytime
                        </p>
                        <Button variant="ghost" onClick={() => setLocation('/onboarding')}>
                            Get Started →
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Loved by Users Worldwide
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            See what our customers have to say
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Sarah Johnson',
                                role: 'Data Analyst',
                                company: 'TechCorp',
                                avatar: 'SJ',
                                rating: 5,
                                text: 'PrivateVault.ai keeps my sensitive data secure while making AI analysis effortless. The encryption gives me peace of mind.'
                            },
                            {
                                name: 'Michael Chen',
                                role: 'Freelance Developer',
                                company: 'Independent',
                                avatar: 'MC',
                                rating: 5,
                                text: 'Best investment for my business. The AI assistants help me work faster while keeping client data completely private.'
                            },
                            {
                                name: 'Emily Rodriguez',
                                role: 'Legal Counsel',
                                company: 'LawFirm Pro',
                                avatar: 'ER',
                                rating: 5,
                                text: 'Client confidentiality is paramount. PrivateVault.ai ensures our sensitive legal documents remain completely private.'
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <ModernCard variant="glass" hover="lift">
                                    <ModernCardContent className="p-8">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                                            "{testimonial.text}"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">{testimonial.avatar}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold">{testimonial.name}</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    {testimonial.role} at {testimonial.company}
                                                </div>
                                            </div>
                                        </div>
                                    </ModernCardContent>
                                </ModernCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            Everything you need to know
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'How secure is my data?',
                                a: 'Your data is encrypted with military-grade AES-256 encryption before it leaves your device. We use a zero-knowledge architecture, meaning we never have access to your unencrypted data or encryption keys.'
                            },
                            {
                                q: 'Can I access my files from multiple devices?',
                                a: 'Yes! Your encrypted files are synced across all your devices. Simply export your encryption key and import it on your other devices to access your files securely.'
                            },
                            {
                                q: 'What AI models do you use?',
                                a: 'We support multiple AI providers including Grok (xAI), Google Gemini, and OpenAI GPT-4. You can choose your preferred provider and create custom AI agents for specific tasks.'
                            },
                            {
                                q: 'What happens if I lose my encryption key?',
                                a: 'Your encryption key is the only way to decrypt your data. We recommend exporting and securely storing your key. If you lose it, we cannot recover your data - this is by design to ensure maximum security.'
                            },
                            {
                                q: 'Can I cancel my subscription anytime?',
                                a: 'Yes, you can cancel your subscription at any time. Your data will remain accessible until the end of your billing period, and you can export everything before canceling.'
                            },
                            {
                                q: 'Do you offer refunds?',
                                a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with PrivateVault.ai, contact us within 30 days for a full refund.'
                            }
                        ].map((faq, index) => (
                            <ModernCard key={index} variant="glass">
                                <ModernCardContent className="p-6">
                                    <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </ModernCardContent>
                            </ModernCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-4 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6">
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    About PrivateVault.ai
                                </span>
                            </h2>
                            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                <p>
                                    PrivateVault.ai was built with a simple mission: make AI-powered productivity accessible without compromising on privacy and security.
                                </p>
                                <p>
                                    We believe that you shouldn't have to choose between powerful AI features and data privacy. That's why we built a zero-knowledge architecture where your encryption keys never leave your device.
                                </p>
                                <p>
                                    Our platform combines military-grade AES-256 encryption with cutting-edge AI technology from providers like Grok, Gemini, and OpenAI - giving you the best of both worlds.
                                </p>
                                <p className="font-semibold text-foreground">
                                    Trusted by over 10,000 users worldwide, from individual professionals to enterprise teams.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <ModernCard variant="glass">
                                <ModernCardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                Empower individuals and teams with secure, AI-powered tools that respect privacy and protect sensitive data.
                                            </p>
                                        </div>
                                    </div>
                                </ModernCardContent>
                            </ModernCard>

                            <ModernCard variant="glass">
                                <ModernCardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Eye className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Our Values</h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                Privacy-first design, transparent security practices, and unwavering commitment to user data protection.
                                            </p>
                                        </div>
                                    </div>
                                </ModernCardContent>
                            </ModernCard>

                            <ModernCard variant="glass">
                                <ModernCardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Our Technology</h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                Built with modern tech stack: React, TypeScript, PostgreSQL, and integrated with leading AI providers.
                                            </p>
                                        </div>
                                    </div>
                                </ModernCardContent>
                            </ModernCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                                Ready to Get Started?
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                            Join thousands of users who trust PrivateVault.ai with their sensitive data
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="xl" variant="premium" onClick={() => setLocation('/onboarding')} className="group">
                                Get Started Now
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button size="xl" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                                View Pricing
                            </Button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-6">
                            Instant setup • Enterprise security • Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <PrivateVaultLogo size="sm" />
                                <span className="text-xl font-bold">PrivateVault.ai</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Your secure AI workspace with end-to-end encryption
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors cursor-pointer">Pricing</a></li>
                                <li><a href="#security" className="hover:text-white transition-colors cursor-pointer">Security</a></li>
                                <li><button onClick={() => setLocation('/onboarding')} className="hover:text-white transition-colors">Roadmap</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><button onClick={() => setLocation('/about')} className="hover:text-white transition-colors">About Us</button></li>
                                <li><button onClick={() => setLocation('/contact')} className="hover:text-white transition-colors">Contact</button></li>
                                <li><button onClick={() => setLocation('/help')} className="hover:text-white transition-colors">Help Center</button></li>
                                <li><button onClick={() => setLocation('/pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><button onClick={() => setLocation('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                                <li><button onClick={() => setLocation('/terms-conditions')} className="hover:text-white transition-colors">Terms of Service</button></li>
                                <li><button onClick={() => setLocation('/privacy-policy')} className="hover:text-white transition-colors">Cookie Policy</button></li>
                                <li><button onClick={() => setLocation('/privacy-policy')} className="hover:text-white transition-colors">GDPR</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-400">
                            © 2025 PrivateVault.ai. All rights reserved. Built with security and privacy in mind.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
