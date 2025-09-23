import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  CloudUpload,
  FileText,
  File,
  Lock,
  Shield,
  CheckCircle,
  Zap,
  Upload,
  Database,
  Eye,
  Key,
  ArrowUp,
  Sparkles,
  Fingerprint,
  ShieldCheck,
  AlertTriangle,
  Image,
  FileSpreadsheet
} from 'lucide-react';
import { EncryptionService } from '@/lib/encryption';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { SecurityBadge, SecurityStatus, SecurityIcon } from '@/components/ui/security-badge';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUploaded?: () => void;
}

export function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files",
        variant: "destructive",
      });
      return;
    }

    if (!EncryptionService.hasValidKey()) {
      toast({
        title: "Encryption key missing",
        description: "Please set up your encryption key first",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.md', '.csv', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please select a supported file type (PDF, DOC, DOCX, TXT, MD, CSV, or Image)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate encryption progress
      const encryptionSteps = [20, 40, 60, 80, 100];
      for (const step of encryptionSteps) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(step);
      }

      // Encrypt the file
      const encryptedData = await EncryptionService.encryptFile(file);

      // Upload encrypted payload as JSON to server (do not send raw file)
      const payload = {
        userId: user.id,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        encryptedData,
      };

      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.error('Upload response not ok:', response.status, errText);
        throw new Error('Upload failed');
      }

      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been encrypted and stored securely`,
      });

      onFileUploaded?.();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SecurityIcon type="database" size="md" />
            <div>
              <CardTitle className="text-xl font-semibold">Secure File Upload</CardTitle>
              <CardDescription className="text-base">Upload and encrypt your files with military-grade security</CardDescription>
            </div>
          </div>
          <SecurityBadge variant="secure" size="md" animated>
            Encryption Ready
          </SecurityBadge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border border-emerald-200 dark:border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-semibold text-foreground">AES-256 Encryption</h4>
            </div>
            <p className="text-sm text-muted-foreground">Military-grade encryption before upload</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border border-blue-200 dark:border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-semibold text-foreground">Zero-Knowledge</h4>
            </div>
            <p className="text-sm text-muted-foreground">We never see your unencrypted data</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border border-purple-200 dark:border-slate-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-semibold text-foreground">Secure Storage</h4>
            </div>
            <p className="text-sm text-muted-foreground">Enterprise-grade infrastructure</p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
            dragActive
              ? "border-primary-500 bg-primary-50 dark:bg-primary-950 dark:bg-opacity-20 scale-105"
              : "border-gray-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-slate-800 dark:hover:bg-opacity-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.txt,.md,.csv,.png,.jpg,.jpeg,.gif,.webp"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          <div className="space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CloudUpload className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-security-500 to-security-600 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isUploading ? "Encrypting & Uploading..." : "Drop files here or click to upload"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isUploading
                  ? "Your file is being encrypted with AES-256 before secure transmission"
                  : "Supported formats: PDF, DOC, DOCX, TXT, MD, CSV, Images (Max 50MB)"
                }
              </p>

              {!isUploading && (
                <Button
                  onClick={handleFileSelect}
                  className="btn-security group"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                  <ArrowUp className="h-4 w-4 ml-2 group-hover:translate-y-[-2px] transition-transform duration-200" />
                </Button>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">Encryption Progress</span>
                <span className="text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-security-500 rounded-full animate-pulse"></div>
                <span>Securing your data with client-side encryption...</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border border-emerald-200 dark:border-slate-600">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">Security Guarantee</h4>
              <p className="text-sm text-muted-foreground mb-3">
                All files are encrypted on your device before transmission. Your encryption keys never leave your browser.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-3 w-3" />
                  <span>Client-side Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  <span>AES-256 Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  <span>Zero-Knowledge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Type Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">PDF</p>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <File className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">DOC/DOCX</p>
              <p className="text-xs text-muted-foreground">Word files</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">TXT/MD</p>
              <p className="text-xs text-muted-foreground">Text files</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">CSV</p>
              <p className="text-xs text-muted-foreground">Data files</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 md:col-span-2 lg:col-span-1">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Images</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
