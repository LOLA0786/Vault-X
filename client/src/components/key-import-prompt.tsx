import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  Upload,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EncryptionService } from '@/lib/encryption';
import { useAuth } from '@/hooks/use-auth';

interface KeyImportPromptProps {
  onComplete: () => void;
}

export function KeyImportPrompt({ onComplete }: KeyImportPromptProps) {
  const [importKey, setImportKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleImportKey = () => {
    if (!importKey.trim()) {
      toast({
        title: 'Invalid key',
        description: 'Please paste a valid encryption key',
        variant: 'destructive',
      });
      return;
    }

    try {
      EncryptionService.importKey(importKey.trim());
      setImportKey('');
      toast({
        title: 'Key imported successfully',
        description: 'Your encryption key has been restored',
      });
      onComplete();
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Invalid encryption key format. Please check your key and try again.',
        variant: 'destructive',
      });
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto border-amber-300 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-6">
            <Key className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl mb-4">🔑 Import Your Encryption Key</CardTitle>
          <CardDescription className="text-lg">
            <strong>Important:</strong> You must import your encryption key before you can access your files, chat history, and AI assistant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <Shield className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <div className="space-y-3">
                  <p className="font-semibold text-base">🚫 Access Blocked</p>
                  <p>Your data is encrypted and cannot be accessed without your encryption key. This is a security feature to protect your privacy.</p>
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <div className="space-y-3">
                  <p className="font-semibold text-base">📋 What to do:</p>
                  <ol className="space-y-2 ml-4 list-decimal">
                    <li>Find your encryption key from your secure backup</li>
                    <li>Paste it in the field below</li>
                    <li>Click "Import Key & Continue" to access your data</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-4">
            <Label htmlFor="import-key" className="text-base font-semibold">Encryption Key</Label>
            <div className="flex items-center gap-3">
              <Input
                id="import-key"
                type={showKey ? "text" : "password"}
                placeholder="Paste your encryption key here..."
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
                className="flex-1 h-12 text-base px-4"
              />
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShowKey(!showKey)}
                className="px-4 h-12"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleImportKey} 
              disabled={!importKey.trim()}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              <Upload className="w-5 h-5 mr-3" />
              Import Key & Continue
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Lost your encryption key?
              </p>
              <Button
                onClick={handleCreateNewAccount}
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
              >
                Create New Account Instead
              </Button>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <div className="space-y-4">
                <p className="font-semibold text-base">🔍 Where to find your key:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div><strong>Password Manager:</strong> Check 1Password, Bitwarden, LastPass, etc.</div>
                    <div><strong>Secure Notes:</strong> Look for saved encryption keys or backup files</div>
                    <div><strong>Email:</strong> Search for "Private Vault" or "encryption key"</div>
                  </div>
                  <div className="space-y-2">
                    <div><strong>Downloads:</strong> Check for exported key files (.txt, .key)</div>
                    <div><strong>Cloud Storage:</strong> Look in secure folders (Google Drive, iCloud, etc.)</div>
                    <div><strong>Physical Storage:</strong> USB drives, secure documents</div>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-base text-muted-foreground">
              Don't have your key? <span className="text-primary font-semibold">Contact support</span> or{' '}
              <button
                onClick={handleCreateNewAccount}
                className="text-primary font-semibold hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                create a new account
              </button>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
