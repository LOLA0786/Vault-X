import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Lock, 
  Upload, 
  Download, 
  AlertTriangle, 
  Shield, 
  Eye, 
  EyeOff,
  Server,
  Smartphone,
  Laptop,
  HardDrive,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileText,
  MessageSquare,
  Bot,
  Zap,
  Globe,
  Database,
  Fingerprint,
  ShieldCheck
} from 'lucide-react';
import { useLocation } from 'wouter';
import { EncryptionService } from '@/lib/encryption';

export default function KeyInfo() {
  const [, setLocation] = useLocation();

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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Zero-Knowledge Encryption</h1>
            <p className="text-lg text-muted-foreground">Understanding Your Private Vault Security</p>
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Your data is protected by military-grade AES-256 encryption that happens entirely on your device. 
          We never see your unencrypted data, ensuring complete privacy and security.
        </p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Client-Side Encryption</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              All encryption happens on your device before data leaves your browser.
            </p>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              AES-256 Standard
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">Zero-Knowledge</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              We cannot access your data even if we wanted to. Your keys never leave your device.
            </p>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Complete Privacy
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">Local Key Control</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              You control your encryption keys. Export, import, and manage them locally.
            </p>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Full Control
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* How It Works Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Zap className="w-6 h-6" />
            How Encryption Works in Private Vault
          </CardTitle>
          <CardDescription className="text-base">
            Step-by-step breakdown of our zero-knowledge encryption process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Flow */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Data Flow Process
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Key Generation</h4>
                    <p className="text-sm text-muted-foreground">When you first sign up, a unique 256-bit encryption key is generated locally in your browser using cryptographically secure random number generation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Local Encryption</h4>
                    <p className="text-sm text-muted-foreground">All your files, chat messages, and AI agent data are encrypted on your device using AES-256-GCM before being transmitted to our servers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Secure Storage</h4>
                    <p className="text-sm text-muted-foreground">Only encrypted data is stored on our servers. We never have access to your encryption key or unencrypted content.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Local Decryption</h4>
                    <p className="text-sm text-muted-foreground">When you access your data, it's downloaded encrypted and decrypted locally in your browser using your stored key.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Gets Encrypted */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Database className="w-5 h-5" />
                What Gets Encrypted
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">Files & Documents</h4>
                    <p className="text-xs text-green-700 dark:text-green-300">All uploaded files and their metadata</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Chat Messages</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">All conversations with AI assistants</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">AI Agent Data</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Custom agents and their configurations</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <Fingerprint className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <h4 className="font-medium text-orange-900 dark:text-orange-100">Personal Preferences</h4>
                    <p className="text-xs text-orange-700 dark:text-orange-300">Settings and customizations</p>
                  </div>
                </div>
              </div>

              <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Your email address and basic account info are not encrypted as they're needed for authentication and account management.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              Key Backup & Export
            </CardTitle>
            <CardDescription>
              Secure your encryption key for future access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Button onClick={handleExport} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Encryption Key
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Downloads a secure backup file to your device
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Upload className="w-5 h-5" />
              Key Import & Recovery
            </CardTitle>
            <CardDescription>
              Restore access to your encrypted data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Button variant="outline" onClick={() => setLocation('/settings')} className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Go to Key Management
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Import your key backup in Settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <ShieldCheck className="w-6 h-6" />
            Security Comparison
          </CardTitle>
          <CardDescription className="text-base">
            How Private Vault compares to other solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold text-green-600">Private Vault</th>
                  <th className="text-center p-4 font-semibold text-muted-foreground">Traditional Cloud</th>
                  <th className="text-center p-4 font-semibold text-muted-foreground">Basic Encryption</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="p-4 font-medium">Client-side Encryption</td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Zero-Knowledge Architecture</td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Local Key Management</td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">AI Integration</td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Enterprise-Grade Security</td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
              <Button size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                Backup Now
              </Button>
              <Button size="sm" variant="outline" onClick={() => setLocation('/settings')}>
                <Key className="w-4 h-4 mr-1" />
                Key Management
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
