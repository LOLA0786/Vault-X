import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Footer } from '@/components/ui/footer';
import { Textarea } from '@/components/ui/textarea';
import { 
  Key, 
  Upload,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  HelpCircle,
  FileKey,
  Copy,
  CheckCircle,
  ArrowRight,
  Lock,
  Unlock,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EncryptionService } from '@/lib/encryption';
import { useAuth } from '@/hooks/use-auth';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';

interface KeyImportPromptProps {
  onComplete: () => void;
}

export function KeyImportPrompt({ onComplete }: KeyImportPromptProps) {
  const [importKey, setImportKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyValidated, setKeyValidated] = useState(false);
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();

  // Validate key format as user types
  const validateKeyFormat = (key: string) => {
    const trimmedKey = key.trim();
    if (!trimmedKey) return false;
    
    // Basic validation - should be a long string (encryption keys are typically 32+ chars)
    if (trimmedKey.length < 20) return false;
    
    // Should not contain common invalid characters for base64/hex
    const invalidChars = /[<>{}[\]"'\\]/;
    if (invalidChars.test(trimmedKey)) return false;
    
    return true;
  };

  const handleKeyChange = (value: string) => {
    setImportKey(value);
    setKeyValidated(validateKeyFormat(value));
  };

  const handleImportKey = async () => {
    if (!importKey.trim()) {
      toast({
        title: 'Missing encryption key',
        description: 'Please paste your encryption key to continue',
        variant: 'destructive',
      });
      return;
    }

    if (!keyValidated) {
      toast({
        title: 'Invalid key format',
        description: 'The key format appears to be invalid. Please check and try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      EncryptionService.importKey(importKey.trim());
      
      toast({
        title: 'Key imported successfully!',
        description: 'Your encryption key has been restored. Welcome back!',
      });
      
      // Clear the key from memory
      setImportKey('');
      onComplete();
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'The encryption key is invalid or corrupted. Please verify your key and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewAccount = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You can now create a new account',
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-white dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-indigo-400 rounded-full animate-bounce animation-delay-500" />
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-1500" />
        <div className="absolute top-1/3 left-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce animation-delay-2500" />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-4xl mx-auto border-indigo-200 dark:border-indigo-800 shadow-2xl shadow-indigo-100/50 dark:shadow-indigo-950/50 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
        <CardHeader className="text-center pb-8 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-t-lg relative overflow-hidden">
          {/* Animated header background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 animate-pulse" />
          
          <div className="relative">
            <div className="mx-auto mb-8 group">
              <PrivateVaultLogo 
                size="xl" 
                animated={true}
                className="group hover:scale-110 transition-all duration-500 drop-shadow-2xl"
              />

            </div>
            
            <CardTitle className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back to Private Vault
            </CardTitle>
            
            <CardDescription className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              To protect your privacy, all your data is encrypted with military-grade security. Please import your encryption key to access your files, chat history, and AI assistant.
            </CardDescription>
            
            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Lock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Zero-Knowledge</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-8">
          {/* Status Banner */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-full">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-amber-800 dark:text-amber-200 font-medium">
                Your data is securely encrypted and waiting for you
              </span>
            </div>
          </div>

          {/* Main Key Input Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <FileKey className="w-5 h-5 text-indigo-600" />
                Import Your Encryption Key
              </h3>
              <p className="text-muted-foreground">
                Paste your encryption key below to unlock your private vault
              </p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="import-key" className="text-base font-semibold flex items-center gap-2">
                <Key className="w-4 h-4" />
                Encryption Key
              </Label>
              
              <div className="relative">
                <Textarea
                  id="import-key"
                  placeholder="Paste your encryption key here...

Example: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789..."
                  value={importKey}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  className={`min-h-[120px] text-sm font-mono resize-none transition-all ${
                    importKey && keyValidated 
                      ? 'border-green-300 bg-green-50/50 dark:bg-green-950/20' 
                      : importKey && !keyValidated 
                      ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20' 
                      : 'border-input'
                  }`}
                />
                
                {/* Visual feedback */}
                {importKey && (
                  <div className="absolute top-3 right-3">
                    {keyValidated ? (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Valid format</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-medium">Invalid format</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Key visibility toggle */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="text-sm"
                >
                  {showKey ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showKey ? 'Hide key' : 'Show key'}
                </Button>
                
                {importKey && (
                  <div className="text-sm text-muted-foreground">
                    Key length: {importKey.length} characters
                  </div>
                )}
              </div>
            </div>

            {/* Import Button */}
            <Button 
              onClick={handleImportKey} 
              disabled={!keyValidated || isLoading}
              className={`w-full h-14 text-lg font-semibold transition-all ${
                keyValidated 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700' 
                  : ''
              }`}
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-3 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                  Importing Key...
                </>
              ) : keyValidated ? (
                <>
                  <Unlock className="w-5 h-5 mr-3" />
                  Unlock My Private Vault
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-3" />
                  Import Key & Continue
                </>
              )}
            </Button>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-base text-blue-900 dark:text-blue-100">
                  Where to find your encryption key:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-blue-900 dark:text-blue-100">Password Manager:</strong>
                        <br />
                        <span className="text-blue-700 dark:text-blue-300">1Password, Bitwarden, LastPass</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-blue-900 dark:text-blue-100">Email:</strong>
                        <br />
                        <span className="text-blue-700 dark:text-blue-300">Search "Private Vault encryption"</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-blue-900 dark:text-blue-100">Secure Notes:</strong>
                        <br />
                        <span className="text-blue-700 dark:text-blue-300">Saved backup files or documents</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-blue-900 dark:text-blue-100">Downloads:</strong>
                        <br />
                        <span className="text-blue-700 dark:text-blue-300">Key files (.txt, .key, .pem)</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-blue-900 dark:text-blue-100">Cloud Storage:</strong>
                        <br />
                        <span className="text-blue-700 dark:text-blue-300">Google Drive, iCloud, Dropbox</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-blue-900 dark:text-blue-100">Physical Storage:</strong>
                        <br />
                        <span className="text-blue-700 dark:text-blue-300">USB drives, printed copies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="text-center pt-6 border-t border-border">
            <div className="space-y-4">
              <p className="text-base text-muted-foreground">
                Can't find your encryption key?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => toast({
                    title: 'Contact Support',
                    description: 'Please email chandan@privatevault.ai for assistance',
                  })}
                  className="w-full sm:w-auto"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCreateNewAccount}
                  className="w-full sm:w-auto border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create New Account
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Creating a new account will start fresh - you won't be able to access old data
              </p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
      
      {/* Footer positioned at bottom */}
      <Footer />
    </div>
  );
}
