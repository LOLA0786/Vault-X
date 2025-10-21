import { useLocation } from 'wouter';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernContainer } from '@/components/ui/modern-layout';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/ui/page-transition';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { Shield, Lock, Zap, Users, Target, Heart, ArrowLeft } from 'lucide-react';

export default function About() {
  const [, setLocation] = useLocation();

  const values = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data belongs to you. We use end-to-end encryption to ensure only you can access your files.'
    },
    {
      icon: Lock,
      title: 'Zero-Knowledge',
      description: 'We never have access to your encryption keys or unencrypted data. True zero-knowledge architecture.'
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Leverage cutting-edge AI technology while maintaining complete privacy and security.'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Built for individuals and teams who value both productivity and privacy.'
    }
  ];

  const team = [
    {
      name: 'Security Team',
      role: 'Encryption & Infrastructure',
      description: 'Experts in cryptography and secure systems'
    },
    {
      name: 'AI Team',
      role: 'Machine Learning & NLP',
      description: 'Building intelligent, privacy-preserving AI'
    },
    {
      name: 'Product Team',
      role: 'User Experience',
      description: 'Creating intuitive, powerful tools'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => setLocation('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <PrivateVaultLogo size="sm" />
            </button>
            <Button onClick={() => setLocation('/')} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </header>

        <ModernContainer className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                About PrivateVault.ai
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're on a mission to make AI-powered productivity tools that respect your privacy
              </p>
            </div>

            {/* Mission Statement */}
            <ModernCard className="mb-12 bg-gradient-to-r from-primary/5 to-purple-600/5">
              <ModernCardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      In an era where data breaches and privacy violations are commonplace, we believe you shouldn't have to choose between powerful AI tools and data security. PrivateVault.ai combines state-of-the-art encryption with cutting-edge AI to give you the best of both worlds: intelligent assistance that respects your privacy.
                    </p>
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Our Story */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PrivateVault.ai was born from a simple observation: as AI becomes more powerful, our personal data becomes more valuable and vulnerable. Traditional cloud storage and AI services require you to trust companies with your unencrypted data.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We asked ourselves: what if there was a better way? What if you could harness the power of AI without sacrificing your privacy?
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  That question led us to build PrivateVault.ai—a platform where your encryption keys never leave your device, where we can't access your data even if we wanted to, and where you maintain complete control over your digital life.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <ModernCard key={index}>
                    <ModernCardHeader>
                      <ModernCardTitle className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <value.icon className="h-5 w-5 text-primary" />
                        </div>
                        {value.title}
                      </ModernCardTitle>
                    </ModernCardHeader>
                    <ModernCardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </ModernCardContent>
                  </ModernCard>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {team.map((member, index) => (
                  <ModernCard key={index}>
                    <ModernCardHeader>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 mb-4" />
                      <ModernCardTitle>{member.name}</ModernCardTitle>
                      <p className="text-sm text-primary">{member.role}</p>
                    </ModernCardHeader>
                    <ModernCardContent>
                      <p className="text-sm text-muted-foreground">{member.description}</p>
                    </ModernCardContent>
                  </ModernCard>
                ))}
              </div>
            </div>

            {/* Technology */}
            <ModernCard className="mb-12">
              <ModernCardHeader>
                <ModernCardTitle className="text-2xl">Our Technology</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                  <p className="text-muted-foreground text-sm">
                    We use AES-256 encryption, the same standard used by governments and militaries worldwide. Your encryption key is generated on your device and never transmitted to our servers.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Zero-Knowledge Architecture</h3>
                  <p className="text-muted-foreground text-sm">
                    Our infrastructure is designed so that we cannot access your data, even if compelled to do so. Your privacy is built into our architecture, not just our policies.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Advanced AI Integration</h3>
                  <p className="text-muted-foreground text-sm">
                    We integrate with leading AI models while maintaining your privacy. Your data is decrypted only on your device, processed securely, and re-encrypted before storage.
                  </p>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* CTA */}
            <ModernCard className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
              <ModernCardContent className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-3">Join Us on Our Mission</h2>
                <p className="mb-6 opacity-90">
                  Experience the future of private, AI-powered productivity
                </p>
                <Button onClick={() => setLocation('/onboarding')} variant="secondary" size="lg">
                  Get Started Free
                </Button>
              </ModernCardContent>
            </ModernCard>
          </div>
        </ModernContainer>
      </div>
    </PageTransition>
  );
}
