import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { EncryptionService } from '@/lib/encryption';

// Layout Components
import { Sidebar } from '@/components/ui/sidebar';
import { ModernHeader } from '@/components/ui/modern-header';
import { Footer } from '@/components/ui/footer';
import { Container } from '@/components/ui/container';
import { PageTransition } from '@/components/ui/page-transition';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Modern UI Components
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle, ModernCardDescription } from '@/components/ui/modern-card';
import { ModernGrid, ModernContainer, ModernStack } from '@/components/ui/modern-layout';
import { StatCard, StatsGrid } from '@/components/ui/modern-stats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityBadge, EncryptionIndicator } from '@/components/ui/security-badge';

// Icons
import { 
  Key, 
  Lock, 
  Upload, 
  Download, 
  AlertTriangle, 
  Shield, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileText,
  MessageSquare,
  Bot,
  Zap,
  Database,
  Fingerprint,
  ShieldCheck,
  Menu,
  LogOut,
  User,
  Info as InfoIcon,
  Globe,
  Smartphone,
  Laptop,
  HardDrive,
  Wifi,
  WifiOff,
  Server
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';

// Mobile KeyInfo Component
function MobileKeyInfo({ 
  renderContent 
}: { 
  renderContent: () => React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

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
    if (tab === 'settings') {
      setLocation('/settings');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
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
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-sidebar-foreground">Private Vault</h1>
                        <p className="text-xs text-sidebar-foreground/70">Your Secure AI Assistant</p>
                      </div>
                    </div>
                  </div>
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

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <InfoIcon className="text-white h-4 w-4" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                Security Info
              </h1>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 pb-4">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}

export default function KeyInfo() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

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
    if (tab === 'settings') {
      setLocation('/settings');
      return;
    }
  };

  const handleExport = () => {
    try {
      const exportedKey = EncryptionService.exportKey();
      const blob = new Blob([exportedKey], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-vault-encryption-key.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      // ignore: handled by KeyManagement UI normally
    }
  };

  const renderContent = () => {
    return (
      <ModernContainer className="py-8">
        <ModernStack spacing="xl">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Zero-Knowledge Encryption
                </h1>
                <p className="text-xl text-muted-foreground mt-2">Understanding Your Private Vault Security</p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Your data is protected by military-grade AES-256 encryption that happens entirely on your device. 
              We never see your unencrypted data, ensuring complete privacy and security.
            </p>
          </div>

          {/* Security Overview Stats */}
          <StatsGrid cols={3}>
            <StatCard
              title="Client-Side Encryption"
              value="AES-256"
              description="Military-grade encryption on your device"
              icon={<Lock />}
              variant="security"
            />
            
            <StatCard
              title="Zero-Knowledge"
              value="100%"
              description="Complete privacy protection"
              icon={<EyeOff />}
              variant="premium"
            />

            <StatCard
              title="Local Key Control"
              value="Full"
              description="You control your encryption keys"
              icon={<Key />}
              variant="gradient"
            />
          </StatsGrid>

          {/* How It Works Section */}
          <ModernCard variant="gradient" hover="glow">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                How Encryption Works in Private Vault
              </ModernCardTitle>
              <ModernCardDescription className="text-base">
                Step-by-step breakdown of our zero-knowledge encryption process
              </ModernCardDescription>
            </ModernCardHeader>
            <ModernCardContent>
              <ModernGrid cols={2} gap="xl" responsive>
                {/* Data Flow */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Data Flow Process
                  </h3>
                  
                  <ModernStack spacing="md">
                    <ModernCard variant="glass" hover="scale">
                      <ModernCardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-sm font-bold text-white">1</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Key Generation</h4>
                            <p className="text-sm text-muted-foreground">When you first sign up, a unique 256-bit encryption key is generated locally in your browser using cryptographically secure random number generation.</p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>

                    <ModernCard variant="glass" hover="scale">
                      <ModernCardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-sm font-bold text-white">2</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Local Encryption</h4>
                            <p className="text-sm text-muted-foreground">All your files, chat messages, and AI agent data are encrypted on your device using AES-256-GCM before being transmitted to our servers.</p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>

                    <ModernCard variant="glass" hover="scale">
                      <ModernCardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-sm font-bold text-white">3</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Secure Storage</h4>
                            <p className="text-sm text-muted-foreground">Only encrypted data is stored on our servers. We never have access to your encryption key or unencrypted content.</p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>

                    <ModernCard variant="glass" hover="scale">
                      <ModernCardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-sm font-bold text-white">4</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Local Decryption</h4>
                            <p className="text-sm text-muted-foreground">When you access your data, it's downloaded encrypted and decrypted locally in your browser using your stored key.</p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>
                  </ModernStack>
                </div>

                {/* What Gets Encrypted */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    What Gets Encrypted
                  </h3>
                  
                  <ModernStack spacing="sm">
                    <ModernCard variant="glass" hover="scale" className="border-emerald-200 dark:border-emerald-800">
                      <ModernCardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <h4 className="font-semibold text-foreground">Files & Documents</h4>
                            <p className="text-sm text-muted-foreground">All uploaded files and their metadata</p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>

                    <ModernCard variant="glass" hover="scale" className="border-primary/20 dark:border-primary/30">
                      <ModernCardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          <div>
                            <h4 className="font-semibold text-foreground">Chat Messages</h4>
                            <p className="text-sm text-muted-foreground">All conversations with AI assistants</p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>

                    <ModernCard variant="glass" hover="scale" className="border-purple-200 dark:border-purple-800">
                      <ModernCardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          <div>
                            <h4 className="font-semibold text-foreground">AI Agent Data</h4>
                            <p className="text-sm text-muted-foreground">Custom agents and their configurations</p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>

                    <ModernCard variant="glass" hover="scale" className="border-orange-200 dark:border-orange-800">
                      <ModernCardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Fingerprint className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                          <div>
                            <h4 className="font-semibold text-foreground">Personal Preferences</h4>
                            <p className="text-sm text-muted-foreground">Settings and customizations</p>
                          </div>
                        </div>
                      </ModernCardContent>
                    </ModernCard>
                  </ModernStack>

                  <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> Your email address and basic account info are not encrypted as they're needed for authentication and account management.
                    </AlertDescription>
                  </Alert>
                </div>
              </ModernGrid>
            </ModernCardContent>
          </ModernCard>

          {/* Key Management Section */}
          <ModernGrid cols={2} gap="lg" responsive>
            <ModernCard variant="elevated" hover="lift">
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Download className="w-5 w-5 text-white" />
                  </div>
                  Key Backup & Export
                </ModernCardTitle>
                <ModernCardDescription>
                  Secure your encryption key for future access
                </ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Why backup your key?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Access data from new devices
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Recover data after browser reset
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Share access across devices
                </li>
              </ul>
            </div>
            
                <div className="pt-4 space-y-2">
                  <Button onClick={handleExport} variant="premium" className="w-full shadow-lg">
                    <Download className="w-4 h-4 mr-2" />
                    Export Encryption Key
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Downloads a secure backup file to your device
                  </p>
                </div>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="elevated" hover="lift">
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Upload className="w-5 w-5 text-white" />
                  </div>
                  Key Import & Recovery
                </ModernCardTitle>
                <ModernCardDescription>
                  Restore access to your encrypted data
                </ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">When to import a key?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  Signing in from a new device
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  After clearing browser data
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  Accessing old encrypted content
                </li>
              </ul>
            </div>
            
                <div className="pt-4 space-y-2">
                  <Button variant="security" onClick={() => setLocation('/settings')} className="w-full shadow-lg">
                    <Key className="w-4 h-4 mr-2" />
                    Go to Key Management
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Import your key backup in Settings
                  </p>
                </div>
              </ModernCardContent>
            </ModernCard>
          </ModernGrid>

          {/* Security Comparison */}
          <ModernCard variant="professional" hover="lift">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                Security Comparison
              </ModernCardTitle>
              <ModernCardDescription className="text-base">
                How Private Vault compares to other solutions
              </ModernCardDescription>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-emerald-600">Private Vault</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">Traditional Cloud</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">Basic Encryption</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-4 font-medium">Client-side Encryption</td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Zero-Knowledge Architecture</td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                      <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Local Key Management</td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">AI Integration</td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Enterprise-Grade Security</td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ModernCardContent>
          </ModernCard>

          {/* Critical Security Warning */}
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <div className="space-y-2">
                <h4 className="font-semibold">Critical Security Warning</h4>
                <p>
                  If you lose your encryption key and don't have a backup, your encrypted data cannot be recovered. 
                  This is by design - it ensures that even we cannot access your data. Always keep a secure backup 
                  of your encryption key in a safe location.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="premium" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-1" />
                    Backup Now
                  </Button>
                  <Button size="sm" variant="security" onClick={() => setLocation('/settings')}>
                    <Key className="w-4 h-4 mr-1" />
                    Key Management
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </ModernStack>
      </ModernContainer>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileKeyInfo renderContent={renderContent} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar 
          activeTab="key-info" 
          onTabChange={handleTabChange}
          className="fixed h-full w-64 bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
        />

        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-background text-foreground">
          {/* Modern Header */}
          <ModernHeader
            title="Security Info"
            subtitle="Understanding your zero-knowledge encryption and privacy protection"
            user={user ? { email: user.email } : undefined}
            onLogout={logout}
            showSearch={false}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-background text-foreground">
            <Container size="xl" padding="lg" className="py-6">
              <PageTransition>
                {renderContent()}
              </PageTransition>
            </Container>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
