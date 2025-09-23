import * as React from "react"
import { cn } from "@/lib/utils"
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from "./modern-card"
import { Button } from "./button"
import { Upload, FileText, Image, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { EncryptionService } from "@/lib/encryption"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface ModernFileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onFileUploaded?: () => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
}

function FilePreview({ file, onRemove, uploadStatus = 'pending', progress = 0 }: FilePreviewProps) {
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5" />
    }
    if (file.type.includes('pdf')) {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-border transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
          {getFileIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
          {uploadStatus === 'uploading' && (
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function ModernFileUpload({
  onFileSelect,
  onFileUploaded,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.md'],
    'text/csv': ['.csv'],
    'application/csv': ['.csv'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  variant = 'default'
}: ModernFileUploadProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [uploadStatus, setUploadStatus] = React.useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({})

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newFiles = [...selectedFiles, ...files].slice(0, maxFiles)
    setSelectedFiles(newFiles)
    onFileSelect?.(newFiles)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFileSelect?.(newFiles)
  }

  const { user } = useAuth();
  const { toast } = useToast();

  const uploadFiles = async () => {
    if (!selectedFiles.length) return;

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

    try {
      for (const file of selectedFiles) {
        const fileId = file.name + file.size;
        setUploadStatus(prev => ({ ...prev, [fileId]: 'uploading' }));

        // Validate file size
        if (file.size > maxSize) {
          toast({
            title: "File too large",
            description: `${file.name} is larger than ${Math.round(maxSize / 1024 / 1024)}MB`,
            variant: "destructive",
          });
          setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
          continue;
        }

        // Validate file type
        const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.md', '.csv', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported file type`,
            variant: "destructive",
          });
          setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
          continue;
        }

        // Encrypt the file
        const encryptedData = await EncryptionService.encryptFile(file);

        // Upload encrypted payload as JSON to server
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
          const errorText = await response.text().catch(() => '');
          console.error('Upload response not ok:', response.status, errorText);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}. Please try again.`,
            variant: "destructive",
          });
          setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
          continue;
        }

        setUploadStatus(prev => ({ ...prev, [fileId]: 'success' }));
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been encrypted and stored securely`,
        });
      }

      // Call the callback to refresh file lists
      onFileUploaded?.();

      // Clear files after successful upload
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadStatus({});
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });

      // Mark all files as error
      const errorStatus: Record<string, 'error'> = {};
      selectedFiles.forEach(file => {
        errorStatus[file.name + file.size] = 'error';
      });
      setUploadStatus(errorStatus);
    }
  }

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-4", className)}>
        <div
          onClick={handleClick}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300",
            "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept={Object.keys(accept).join(',')}
          />
          <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground mb-1">
            Click to upload files
          </p>
          <p className="text-xs text-muted-foreground">
            Up to {maxFiles} files, max {Math.round(maxSize / 1024 / 1024)}MB each
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <FilePreview
                key={file.name + file.size}
                file={file}
                onRemove={() => removeFile(index)}
                uploadStatus={uploadStatus[file.name + file.size]}
              />
            ))}
            <Button onClick={uploadFiles} className="w-full" disabled={selectedFiles.length === 0}>
              Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <ModernCard variant="gradient" hover="lift" className={className}>
      <ModernCardHeader>
        <ModernCardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Upload className="h-5 w-5 text-white" />
          </div>
          Secure File Upload
        </ModernCardTitle>
        <ModernCardDescription>
          Upload and encrypt your files with military-grade AES-256 encryption
        </ModernCardDescription>
      </ModernCardHeader>

      <ModernCardContent className="space-y-6">
        <div
          onClick={handleClick}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
            "border-border hover:border-primary/50 hover:bg-muted/30 hover:scale-102"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept={Object.keys(accept).join(',')}
          />
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground mb-2">
                Choose files to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Click to browse and select files
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="bg-muted px-2 py-1 rounded">PDF</span>
              <span className="bg-muted px-2 py-1 rounded">DOC/DOCX</span>
              <span className="bg-muted px-2 py-1 rounded">TXT/MD</span>
              <span className="bg-muted px-2 py-1 rounded">CSV</span>
              <span className="bg-muted px-2 py-1 rounded">Images</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each
            </p>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Selected Files</h4>
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <FilePreview
                  key={file.name + file.size}
                  file={file}
                  onRemove={() => removeFile(index)}
                  uploadStatus={uploadStatus[file.name + file.size]}
                />
              ))}
            </div>
            <Button
              onClick={uploadFiles}
              variant="premium"
              size="lg"
              className="w-full shadow-xl"
              disabled={selectedFiles.length === 0}
            >
              <Upload className="h-5 w-5 mr-2" />
              Encrypt & Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </ModernCardContent>
    </ModernCard>
  )
}