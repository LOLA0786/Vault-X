import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Key, 
  RefreshCw, 
  Upload, 
  Download, 
  AlertTriangle,
  Shield,
  CheckCircle
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
  const { toast } = useToast();

  const handleExportKey = () => {
    try {
      const exportedKey = EncryptionService.exportKey();
      
      // Create download link
      const blob = new Blob([exportedKey], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-vault-encryption-key.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Key exported successfully",
        description: "Store your encryption key backup in a safe place",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Encryption Key Management
        </CardTitle>
        <CardDescription>
          Your encryption keys are stored locally and never leave your browser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Status */}
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Key className="text-secondary text-xl h-6 w-6" />
            <div>
              <p className="font-medium text-gray-900">Master Encryption Key</p>
              <p className="text-sm text-gray-600">Generated locally, AES-256 encryption</p>
            </div>
          </div>
          <Badge variant={hasValidKey ? "default" : "destructive"}>
            {hasValidKey ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </>
            ) : (
              'Missing'
            )}
          </Badge>
        </div>

        {/* Key Information */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Key Storage Location</p>
            <p className="text-sm text-gray-600">Browser localStorage (device-specific)</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportKey}
            disabled={!hasValidKey}
            data-testid="export-key-button"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Backup
          </Button>
        </div>

        {/* Import Key Section */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <Label htmlFor="import-key">Import Encryption Key</Label>
          <div className="flex space-x-2">
            <Input
              id="import-key"
              type="text"
              placeholder="Paste your encryption key backup here"
              value={importKey}
              onChange={(e) => setImportKey(e.target.value)}
              data-testid="import-key-input"
            />
            <Button
              variant="outline"
              onClick={handleImportKey}
              disabled={!importKey.trim()}
              data-testid="import-key-button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200">
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
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <AlertTriangle className="w-4 h-4 text-accent mr-1" />
            Regenerating will make existing files inaccessible
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
