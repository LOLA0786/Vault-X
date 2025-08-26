import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, Lock, Upload, Download, AlertTriangle } from 'lucide-react';
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
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Key className="w-5 h-5" />
            How the encryption key works
          </CardTitle>
          <CardDescription>
            A short explanation of how your encryption key protects your data and how to back it up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Overview</h3>
            <p className="text-sm text-muted-foreground">When you sign in, Vault-X generates a unique encryption key that stays only on your device (stored in localStorage). All files, chat sessions, and agent data you create are encrypted locally with this key before being sent to the server. The server stores only ciphertext — it never has access to your plaintext or your key.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Key lifecycle</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>At login — a new key is generated and stored locally.</li>
              <li>While signed in — your key decrypts and re-encrypts data locally so the app can read your content.</li>
              <li>At logout — the key is removed from the browser. The server still holds ciphertext, but without the key it cannot be decrypted.</li>
              <li>On next login — a new key is created. It can decrypt content encrypted with that new key only.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Recovering old data</h3>
            <p className="text-sm text-muted-foreground">If you want to access data encrypted with a previous key, you must import the original key backup. Use the <strong>Export Backup</strong> action in Key Management to save your key before logging out. You can later import that backup to restore access.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Quick steps</h3>
            <ol className="list-decimal pl-5 text-sm text-muted-foreground">
              <li>On first login, go to <strong>Security Settings → Encryption Key Management</strong>.</li>
              <li>Click <strong>Export Backup</strong> and store the downloaded file in a safe place (offline recommended).</li>
              <li>If you log out or switch devices, use <strong>Import Encryption Key</strong> to restore access to previously encrypted data.</li>
            </ol>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button variant="outline" onClick={() => setLocation('/settings') }>
              Open Key Management
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Key Now
            </Button>
          </div>

          <div className="pt-4 text-sm text-muted-foreground flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <div>
              <strong>Security note:</strong> If you lose the original key and don't have a backup, the encrypted data is unrecoverable. Treat your exported key like a real cryptographic secret.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
