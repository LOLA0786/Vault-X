import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Footer } from '@/components/ui/footer';
import { 
  Shield, 
  Key, 
  Download, 
  Upload,
  AlertTriangle, 
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  ArrowRight,
  Lock,
  Sparkles,
  FileKey,
  Database,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EncryptionService } from '@/lib/encryption';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';

interface EncryptionOnboardingProps {
  onComplete: () => void;
  isFirstTime?: boolean;
}

type Step = 'welcome' | 'generate' | 'backup' | 'verify' | 'complete';

export function EncryptionOnboarding({ onComplete, isFirstTime = true }: EncryptionOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  const [keyBackedUp, setKeyBackedUp] = useState(false);
  const [verificationKey, setVerificationKey] = useState('');
  const { toast } = useToast();

  const generateKey = () => {
    const key = EncryptionService.generateKey();
    EncryptionService.storeKey(key);
    setEncryptionKey(EncryptionService.exportKey());
    setCurrentStep('backup');
  };

  const downloadKey = () => {
    const exportedKey = EncryptionService.exportKey();
    const blob = new Blob([exportedKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-x-encryption-key-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setKeyBackedUp(true);
    toast({ 
      title: 'Key downloaded', 
      description: 'Store this file in a secure location like a password manager or encrypted drive.' 
    });
  };

  const copyKey = () => {
    navigator.clipboard.writeText(encryptionKey);
    toast({ 
      title: 'Key copied', 
      description: 'Paste it into your password manager or secure note app.' 
    });
  };

  const verifyKey = () => {
    if (verificationKey.trim() === encryptionKey) {
      setCurrentStep('complete');
      toast({ 
        title: 'Verification successful!', 
        description: 'Your encryption key has been properly backed up.' 
      });
    } else {
      toast({ 
        title: 'Verification failed', 
        description: 'The key you entered doesn\'t match. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const completeOnboarding = () => {
    // Mark onboarding as complete and clear new user flag
    localStorage.setItem('privatevault_encryption_onboarding_complete', 'true');
    localStorage.removeItem('privatevault_is_new_user');
    onComplete();
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      <div className="relative mx-auto group">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110">
          <Key className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="text-white h-4 w-4" />
        </div>
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-ping"></div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isFirstTime ? 'Welcome to Private Vault!' : 'Encryption Key Setup'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your privacy and security are our top priority. Let's set up your personal encryption key to protect all your data with military-grade security.
        </p>
      </div>

      <div className="grid gap-4 text-left">
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Zero-Knowledge Security</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your data is encrypted on your device before it reaches our servers. We never see your unencrypted data.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">Critical: Backup Your Key</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <strong>If you lose your encryption key, your data cannot be recovered.</strong> We'll help you back it up safely.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <Lock className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">Your Key, Your Control</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              You'll need to import your key each time you sign in from a new device or browser.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={() => setCurrentStep('generate')} className="w-full" size="lg">
        <Sparkles className="w-4 h-4 mr-2" />
        Generate My Encryption Key
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderGenerateStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
        <Zap className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Generate Encryption Key</h2>
        <p className="text-muted-foreground">
          We'll create a unique, cryptographically secure key for your account.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Database className="w-4 h-4" />
          <span>AES-256 Encryption</span>
          <span>•</span>
          <FileKey className="w-4 h-4" />
          <span>256-bit Key Size</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Your key is generated locally and never transmitted to our servers.
        </p>
      </div>

      <Button onClick={generateKey} className="w-full" size="lg">
        <Key className="w-4 h-4 mr-2" />
        Generate Secure Key
      </Button>
    </div>
  );

  const renderBackupStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Backup Your Key</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          <strong>Critical Step:</strong> Save your encryption key in a secure location.
        </p>
      </div>

      <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <strong>Warning:</strong> If you lose this key, all your encrypted data will be permanently inaccessible. 
          There is no way to recover it.
        </AlertDescription>
      </Alert>

      <div className="bg-muted rounded-lg p-3 sm:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Your Encryption Key:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKey(!showKey)}
            className="shrink-0"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        <div className="font-mono text-xs sm:text-sm bg-background border rounded p-2 sm:p-3 break-all overflow-x-auto max-w-full">
          {showKey ? encryptionKey : '•'.repeat(encryptionKey.length)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button onClick={downloadKey} variant="outline" className="flex-1 h-10 sm:h-auto">
          <Download className="w-4 h-4 mr-2" />
          Download as File
        </Button>
        <Button onClick={copyKey} variant="outline" className="flex-1 h-10 sm:h-auto">
          <Copy className="w-4 h-4 mr-2" />
          Copy to Clipboard
        </Button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">Recommended Storage Options:</h3>
        <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Password manager (1Password, Bitwarden, etc.)</li>
          <li>• Encrypted cloud storage</li>
          <li>• Secure physical backup (USB drive, paper)</li>
          <li>• Multiple secure locations</li>
        </ul>
      </div>

      <Button 
        onClick={() => setCurrentStep('verify')} 
        disabled={!keyBackedUp}
        className="w-full h-10 sm:h-auto" 
        size="lg"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        I've Backed Up My Key
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Verify Your Backup</h2>
        <p className="text-muted-foreground">
          To ensure you've backed up your key correctly, please paste it below.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Paste your encryption key:</label>
        <textarea
          value={verificationKey}
          onChange={(e) => setVerificationKey(e.target.value)}
          placeholder="Paste your encryption key here..."
          className="w-full h-24 p-3 border rounded-lg font-mono text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => setCurrentStep('backup')} variant="outline">
          Back to Backup
        </Button>
        <Button onClick={verifyKey} disabled={!verificationKey.trim()}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Verify Key
        </Button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Setup Complete!</h2>
        <p className="text-muted-foreground">
          Your encryption key has been generated and backed up successfully.
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Remember:</h3>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 text-left">
          <li>• Keep your encryption key safe and accessible</li>
          <li>• You'll need to import it when signing in from new devices</li>
          <li>• Your data is now protected with military-grade encryption</li>
          <li>• We cannot recover your data if you lose your key</li>
        </ul>
      </div>

      <Button onClick={completeOnboarding} className="w-full" size="lg">
        <ArrowRight className="w-4 h-4 mr-2" />
        Start Using Private Vault
      </Button>
    </div>
  );

  const stepComponents = {
    welcome: renderWelcomeStep,
    generate: renderGenerateStep,
    backup: renderBackupStep,
    verify: renderVerifyStep,
    complete: renderCompleteStep,
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-white dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 relative z-10">
        <Card className="w-full max-w-3xl mx-auto shadow-2xl border-indigo-200 dark:border-indigo-800 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-t-lg">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative group">
              <PrivateVaultLogo 
                size="md" 
                animated={true}
                className="group-hover:scale-105 transition-all duration-300"
              />

            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Private Vault</span>
              <div className="text-sm text-muted-foreground">Encryption Setup</div>
            </div>
          </div>
          
          {/* Enhanced Progress Indicator */}
          <div className="flex justify-center items-center space-x-3 mb-6">
            {(['welcome', 'generate', 'backup', 'verify', 'complete'] as Step[]).map((step, index) => {
              const isActive = (['welcome', 'generate', 'backup', 'verify', 'complete'] as Step[]).indexOf(currentStep) >= index;
              const isCurrent = (['welcome', 'generate', 'backup', 'verify', 'complete'] as Step[]).indexOf(currentStep) === index;
              
              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? isCurrent 
                          ? 'bg-indigo-500 ring-4 ring-indigo-200 dark:ring-indigo-800 scale-125' 
                          : 'bg-indigo-400'
                        : 'bg-muted'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75"></div>
                    )}
                  </div>
                  {index < 4 && (
                    <div className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${
                      (['welcome', 'generate', 'backup', 'verify', 'complete'] as Step[]).indexOf(currentStep) > index 
                        ? 'bg-indigo-400' 
                        : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Step Labels */}
          <div className="text-sm text-muted-foreground">
            Step {(['welcome', 'generate', 'backup', 'verify', 'complete'] as Step[]).indexOf(currentStep) + 1} of 5: {
              currentStep === 'welcome' ? 'Welcome & Overview' :
              currentStep === 'generate' ? 'Generate Encryption Key' :
              currentStep === 'backup' ? 'Backup Your Key' :
              currentStep === 'verify' ? 'Verify Backup' :
              'Setup Complete'
            }
          </div>
        </CardHeader>
        <CardContent className="pt-4 px-3 sm:px-6">
          {stepComponents[currentStep]()}
        </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
