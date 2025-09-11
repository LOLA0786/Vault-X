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
    localStorage.setItem('vault_x_encryption_onboarding_complete', 'true');
    localStorage.removeItem('vault_x_is_new_user');
    onComplete();
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Key className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isFirstTime ? 'Welcome to Private Vault!' : 'Encryption Key Setup'}
        </h2>
        <p className="text-muted-foreground">
          Your privacy and security are our top priority. Let's set up your personal encryption key.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
        <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Private Vault</span>
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            {(['welcome', 'generate', 'backup', 'verify', 'complete'] as Step[]).map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  (['welcome', 'generate', 'backup', 'verify', 'complete'] as Step[]).indexOf(currentStep) >= index
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
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
