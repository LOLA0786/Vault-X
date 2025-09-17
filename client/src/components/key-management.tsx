import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  RefreshCw, 
  Upload, 
  Download, 
  AlertTriangle,
  Shield,
  CheckCircle,
  Info,
  Lock,
  Eye,
  EyeOff,
  Copy,
  HelpCircle
} from 'lucide-react';
import { EncryptionService } from '@/lib/encryption';
import { useToast } from '@/hooks/use-toast';
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

export function KeyManagement() {
  const [importKey, setImportKey] = useState('');
  const [showImportKey, setShowImportKey] = useState(false);
  const [showExportKey, setShowExportKey] = useState(false);
  const [exportedKey, setExportedKey] = useState('');
  const { toast } = useToast();

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
    a.download = `vault-x-encryption-key-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Key downloaded",
      description: "Store this file in a secure location like a password manager",
    });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(exportedKey);
    toast({
      title: "Key copied",
      description: "Paste it into your password manager or secure note app",
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
        description: "A new encryption key has been generated. Previous files will be inaccessible.",
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

  return (
    <ModernCard variant="elevated" hover="lift">
      <ModernCardHeader>
        <ModernCardTitle className="text-lg font-semibold text-foreground">
          Encryption Key Management
        </ModernCardTitle>
        <ModernCardDescription>
          Your encryption keys are stored locally and never leave your browser
        </ModernCardDescription>
      </ModernCardHeader>
      <ModernCardContent className="space-y-4">
        {/* Key Status */}
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Key className="text-green-600 dark:text-green-400 text-xl h-6 w-6" />
            <div>
              <p className="font-medium text-foreground">Master Encryption Key</p>
              <p className="text-sm text-muted-foreground">Generated locally, AES-256 encryption</p>
            </div>
          </div>
          <Badge variant={hasValidKey ? "default" : "destructive"}>
            {hasValidKey ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <AlertTriangle className="text-yellow-600 dark:text-yellow-400 w-3 h-3 mr-1" />
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
              <p className="text-sm font-medium text-foreground">Export Encryption Key</p>
              <p className="text-sm text-muted-foreground">Create a backup of your encryption key</p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportKey}
              disabled={!hasValidKey}
              data-testid="export-key-button"
            >
              <Download className="w-4 h-4 mr-2" />
              Show Key
            </Button>
          </div>

          {showExportKey && exportedKey && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Encryption Key:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExportKey(!showExportKey)}
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              </div>
              <div className="font-mono text-xs bg-background border rounded p-3 break-all select-all">
                {exportedKey}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopyKey} variant="outline" size="sm" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Key
                </Button>
                <Button onClick={handleDownloadKey} variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              </div>
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <div className="space-y-2">
                    <p className="font-semibold">Recommended Storage Options:</p>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>Password manager (1Password, Bitwarden, etc.)</li>
                      <li>Encrypted cloud storage</li>
                      <li>Secure physical backup (USB drive, paper)</li>
                      <li>Multiple secure locations for redundancy</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {/* Import Key Section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <Label htmlFor="import-key" className="text-sm font-medium">Import Encryption Key</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Restore your encryption key from a backup to access your encrypted data
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                id="import-key"
                type={showImportKey ? "text" : "password"}
                placeholder="Paste your encryption key backup here..."
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
                data-testid="import-key-input"
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
                data-testid="import-key-button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Key
              </Button>
            </div>
            
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
              <Lock className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <div className="space-y-1">
                  <p className="font-semibold">When to Import Your Key:</p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>Signing in from a new device or browser</li>
                    <li>After clearing browser data or reinstalling</li>
                    <li>When you see "Missing" key status above</li>
                    <li>To access previously encrypted files and chats</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border">
          <div className="flex space-x-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1"
                  data-testid="regenerate-key-button"
                >
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
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-1" />
            Regenerating will make existing files inaccessible
          </p>
        </div>
      </ModernCardContent>
    </ModernCard>
  );
}
