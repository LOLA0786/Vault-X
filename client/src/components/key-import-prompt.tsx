import { useState } from 'react';
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

interface KeyImportPromptProps {
  onComplete: () => void;
}

export function KeyImportPrompt({ onComplete }: KeyImportPromptProps) {
  const [importKey, setImportKey] = useState('');
  const [showKey, setShowKey] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome Back to Private Vault</CardTitle>
          <CardDescription>
            Please import your encryption key to access your secure AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              You need your encryption key to access your files and chat history. 
              Check your password manager or secure backup location.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Label htmlFor="import-key">Encryption Key</Label>
            <div className="flex items-center gap-2">
              <Input
                id="import-key"
                type={showKey ? "text" : "password"}
                placeholder="Paste your encryption key here..."
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="px-3"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleImportKey} 
            disabled={!importKey.trim()}
            className="w-full"
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Key & Continue
          </Button>

          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <div className="space-y-2">
                <p className="font-semibold">Where to find your key:</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li>Password manager (1Password, Bitwarden, etc.)</li>
                  <li>Secure note or encrypted file</li>
                  <li>Previous key export/backup</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have your key? Contact support or create a new account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
