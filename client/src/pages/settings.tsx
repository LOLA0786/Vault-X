import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
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
import { ModernInput } from '@/components/ui/modern-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityBadge, EncryptionIndicator } from '@/components/ui/security-badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';

// Icons
import { 
  Settings as SettingsIcon, 
  Shield, 
  Menu, 
  LogOut,
  User,
  Key,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Bell,
  Moon,
  Sun,
  Monitor,
  Lock,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  Fingerprint,
  Database,
  Globe,
  Smartphone,
  Home,
  MessageSquare,
  History,
  Bot,
  LayoutDashboard
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mobile Settings Component
function MobileSettings({ 
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
    if (tab === 'key-info') {
      setLocation('/key-info');
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
                      <PrivateVaultLogo 
                        size="sm" 
                        animated={true}
                        className="drop-shadow-lg"
                      />
                      <div>
                        <h1 className="text-lg font-bold text-sidebar-foreground">Private Vault</h1>
                        <p className="text-xs text-sidebar-foreground/70">Your Secure AI Assistant</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Menu */}
                  <nav className="flex-1 p-4">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('vault');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 7H21L19 2H5L3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        File Vault
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('chat');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <MessageSquare className="mr-3 h-5 w-5" />
                        AI Assistant
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('agents');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Bot className="mr-3 h-5 w-5" />
                        AI Agents
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('history');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <History className="mr-3 h-5 w-5" />
                        Chat History
                      </Button>
                      <Button
                        variant="default"
                        className="w-full justify-start bg-primary text-primary-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <SettingsIcon className="mr-3 h-5 w-5" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                        onClick={() => {
                          handleTabChange('key-info');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Key className="mr-3 h-5 w-5" />
                        How it works
                      </Button>
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

            <div className="flex items-center space-x-2">
              <PrivateVaultLogo 
                size="sm" 
                animated={true}
                className="drop-shadow-md"
              />
              <h1 className="text-lg font-semibold text-foreground">
                Settings
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

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Key Management State
  const [importKey, setImportKey] = useState('');
  const [showImportKey, setShowImportKey] = useState(false);
  const [showExportKey, setShowExportKey] = useState(false);
  const [exportedKey, setExportedKey] = useState('');

  // Settings State
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('system');
  const [autoSave, setAutoSave] = useState(true);
  const [dataRetention, setDataRetention] = useState('1year');

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
    if (tab === 'key-info') {
      setLocation('/key-info');
      return;
    }
  };

  // Key Management Functions
  const handleExportKey = () => {
    try {
      const key = EncryptionService.exportKey();
      setExportedKey(key);
      setShowExportKey(true);
      
      toast({
        title: "Key ready for export",
        description: "Copy or download your encryption key",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDownloadKey = () => {
    const blob = new Blob([exportedKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-encryption-key-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Key downloaded",
      description: "Store this file in a secure location",
    });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(exportedKey);
    toast({
      title: "Key copied",
      description: "Paste it into your password manager",
    });
  };

  const handleImportKey = () => {
    if (!importKey.trim()) {
      toast({
        title: "Invalid key",
        description: "Please enter a valid encryption key",
        variant: "destructive",
      });
      return;
    }

    try {
      EncryptionService.importKey(importKey);
      setImportKey('');
      
      toast({
        title: "Key imported successfully",
        description: "Your encryption key has been restored",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Invalid encryption key format",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateKey = () => {
    try {
      const newKey = EncryptionService.generateKey();
      EncryptionService.storeKey(newKey);
      
      toast({
        title: "Key regenerated",
        description: "A new encryption key has been generated",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Regeneration failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const hasValidKey = EncryptionService.hasValidKey();

  const renderContent = () => {
    return (
      <ModernContainer className="py-4 sm:py-8 px-4 sm:px-6">
        <ModernStack spacing="lg" className="sm:spacing-xl">
          {/* Header Section */}
          <div className="text-center space-y-2 sm:space-y-4">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Manage your account, security, and privacy preferences
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6 sm:space-y-8">
            {/* Account Settings */}
            <ModernCard variant="elevated" hover="lift">
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  Account Settings
                </ModernCardTitle>
                <ModernCardDescription className="text-sm">
                  Manage your account information and preferences
                </ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <ModernInput
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      variant="filled"
                      className="touch-manipulation"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed for security reasons
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme Preference</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="touch-manipulation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-0">
                    <div className="space-y-0.5">
                      <Label>Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about important updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                      className="touch-manipulation"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-0">
                    <div className="space-y-0.5">
                      <Label>Auto-save Conversations</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save chat conversations
                      </p>
                    </div>
                    <Switch
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                      className="touch-manipulation"
                    />
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Encryption Key Management */}
            <ModernCard variant="gradient" hover="glow">
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Key className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  Encryption Key Management
                </ModernCardTitle>
                <ModernCardDescription className="text-sm">
                  Your encryption keys are stored locally and never leave your browser
                </ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4 sm:space-y-6">
                {/* Key Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Key className="text-emerald-600 dark:text-emerald-400 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground text-sm sm:text-base">Master Encryption Key</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">AES-256 encryption, generated locally</p>
                    </div>
                  </div>
                  <Badge variant={hasValidKey ? "default" : "destructive"} className="text-xs">
                    {hasValidKey ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Missing
                      </>
                    )}
                  </Badge>
                </div>

                {/* Educational Information */}
                <Alert className="border-primary/20 bg-primary/5 dark:bg-primary/10 dark:border-primary/30">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    <div className="space-y-2">
                      <p className="font-semibold">How Encryption Keys Work:</p>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li><strong>Device-Specific:</strong> Your key is stored only on this device/browser</li>
                        <li><strong>Required for Access:</strong> You need your key to decrypt files and chat history</li>
                        <li><strong>Your Responsibility:</strong> We cannot recover your data if you lose your key</li>
                        <li><strong>New Devices:</strong> Import your key backup when signing in elsewhere</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Export Key Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Export Encryption Key</p>
                      <p className="text-sm text-muted-foreground">Create a backup of your encryption key</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleExportKey}
                      disabled={!hasValidKey}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Show Key
                    </Button>
                  </div>

                  {showExportKey && exportedKey && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Your Encryption Key:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowExportKey(!showExportKey)}
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="font-mono text-xs bg-background border rounded-lg p-3 break-all select-all">
                        {exportedKey}
                      </div>
                      <ModernGrid cols={2} gap="sm">
                        <Button onClick={handleCopyKey} variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Key
                        </Button>
                        <Button onClick={handleDownloadKey} variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download File
                        </Button>
                      </ModernGrid>
                    </div>
                  )}
                </div>

                {/* Import Key Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <Label htmlFor="import-key" className="font-semibold">Import Encryption Key</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Restore your encryption key from a backup to access your encrypted data
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ModernInput
                        id="import-key"
                        type={showImportKey ? "text" : "password"}
                        placeholder="Paste your encryption key backup here..."
                        value={importKey}
                        onChange={(e) => setImportKey(e.target.value)}
                        variant="filled"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowImportKey(!showImportKey)}
                        className="px-3"
                      >
                        {showImportKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={handleImportKey}
                        disabled={!importKey.trim()}
                        variant="premium"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Key
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Regenerate Key Section */}
                <div className="pt-4 border-t border-border">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate Key
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Regenerate Encryption Key?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will generate a new encryption key. All existing encrypted files 
                          will become permanently inaccessible. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleRegenerateKey}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Regenerate Key
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-1" />
                    Regenerating will make existing files inaccessible
                  </p>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Privacy & Security */}
            <ModernCard variant="security" hover="lift">
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  Privacy & Security
                </ModernCardTitle>
                <ModernCardDescription>
                  Advanced security and privacy settings
                </ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="retention">Data Retention Period</Label>
                  <Select value={dataRetention} onValueChange={setDataRetention}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How long to keep your encrypted data before automatic deletion
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <Fingerprint className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-semibold text-sm">Client-side Encryption</p>
                      <p className="text-xs text-muted-foreground">AES-256 Protected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 dark:border-primary/30">
                    <Database className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">Zero-Knowledge</p>
                      <p className="text-xs text-muted-foreground">Private by Design</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-semibold text-sm">Secure Infrastructure</p>
                      <p className="text-xs text-muted-foreground">Enterprise Grade</p>
                    </div>
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Danger Zone */}
            <ModernCard variant="elevated" className="border-red-200 dark:border-red-800">
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center gap-3 text-xl text-red-600 dark:text-red-400">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  Danger Zone
                </ModernCardTitle>
                <ModernCardDescription>
                  Irreversible actions that will permanently delete your data
                </ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <div className="space-y-2">
                      <p className="font-semibold">Warning: These actions cannot be undone</p>
                      <p className="text-sm">
                        Deleting your account will permanently remove all your encrypted files, 
                        chat history, and AI agents. Make sure to export any important data first.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all your files, chat history, AI agents, and account data. 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground">
                          Delete Everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </ModernCardContent>
            </ModernCard>
          </div>
        </ModernStack>
      </ModernContainer>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileSettings renderContent={renderContent} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <Sidebar 
          activeTab="settings" 
          onTabChange={handleTabChange}
          className="fixed h-full w-64 bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
        />

        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-background text-foreground">
          {/* Modern Header */}
          <ModernHeader
            title="Settings"
            subtitle="Manage your account, security, and privacy preferences"
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