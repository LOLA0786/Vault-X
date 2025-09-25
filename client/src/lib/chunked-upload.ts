import { EncryptionService } from './encryption';

export interface ChunkUploadOptions {
  chunkSize?: number; // Default 1MB
  maxRetries?: number; // Default 3
  onProgress?: (progress: number) => void;
  onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
}

export interface UploadChunk {
  index: number;
  data: Uint8Array;
  hash: string; // For integrity verification
  isLast: boolean;
}

export interface ChunkedUploadSession {
  sessionId: string;
  fileName: string;
  fileType: string;
  totalChunks: number;
  totalSize: number;
  userId: string;
}

/**
 * Enhanced chunked upload service for large files
 * Provides resumable uploads, progress tracking, and error recovery
 */
export class ChunkedUploadService {
  private static readonly DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB
  private static readonly MAX_RETRIES = 3;

  /**
   * Upload a file using chunked binary upload
   */
  static async uploadFile(
    file: File,
    userId: string,
    options: ChunkUploadOptions = {}
  ): Promise<{ success: boolean; fileId?: string; error?: string }> {
    const {
      chunkSize = this.DEFAULT_CHUNK_SIZE,
      maxRetries = this.MAX_RETRIES,
      onProgress,
      onChunkComplete
    } = options;

    try {
      // Step 1: Encrypt the entire file
      onProgress?.(5);
      const encryptedData = await EncryptionService.encryptFileToUint8Array(file);
      onProgress?.(15);

      // Step 2: Create chunks from encrypted data
      const chunks = this.createChunks(encryptedData, chunkSize);
      const totalChunks = chunks.length;

      // Step 3: Initialize upload session
      const session = await this.initializeUploadSession({
        fileName: file.name,
        fileType: file.type,
        totalChunks,
        totalSize: encryptedData.length,
        userId
      });

      onProgress?.(20);

      // Step 4: Upload chunks with retry logic
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        let success = false;
        let retries = 0;

        while (!success && retries < maxRetries) {
          try {
            await this.uploadChunk(session.sessionId, chunk);
            success = true;
            onChunkComplete?.(i + 1, totalChunks);
            
            // Update progress (20% + 70% for chunks + 10% for finalization)
            const chunkProgress = 20 + ((i + 1) / totalChunks) * 70;
            onProgress?.(chunkProgress);
          } catch (error) {
            retries++;
            console.warn(`Chunk ${i} upload failed, retry ${retries}/${maxRetries}:`, error);
            
            if (retries >= maxRetries) {
              throw new Error(`Failed to upload chunk ${i} after ${maxRetries} retries`);
            }
            
            // Exponential backoff
            await this.delay(Math.pow(2, retries) * 1000);
          }
        }
      }

      // Step 5: Finalize upload
      const result = await this.finalizeUpload(session.sessionId);
      onProgress?.(100);

      return { success: true, fileId: result.fileId };

    } catch (error) {
      console.error('Chunked upload failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Create chunks from encrypted file data
   */
  private static createChunks(data: Uint8Array, chunkSize: number): UploadChunk[] {
    const chunks: UploadChunk[] = [];
    const totalChunks = Math.ceil(data.length / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, data.length);
      const chunkData = data.slice(start, end);
      
      chunks.push({
        index: i,
        data: chunkData,
        hash: this.calculateHash(chunkData),
        isLast: i === totalChunks - 1
      });
    }

    return chunks;
  }

  /**
   * Initialize upload session on server
   */
  private static async initializeUploadSession(
    session: Omit<ChunkedUploadSession, 'sessionId'>
  ): Promise<ChunkedUploadSession> {
    const response = await fetch('/api/upload/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });

    if (!response.ok) {
      throw new Error(`Failed to initialize upload session: ${response.statusText}`);
    }

    const result = await response.json();
    return { ...session, sessionId: result.sessionId };
  }

  /**
   * Upload a single chunk
   */
  private static async uploadChunk(sessionId: string, chunk: UploadChunk): Promise<void> {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('chunkIndex', chunk.index.toString());
    formData.append('chunkHash', chunk.hash);
    formData.append('isLast', chunk.isLast.toString());
    formData.append('chunkData', new Blob([chunk.data]), `chunk-${chunk.index}`);

    const response = await fetch('/api/upload/chunk', {
      method: 'POST',
      body: formData // Binary FormData - no Base64 encoding!
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Chunk upload failed: ${response.status} ${errorText}`);
    }
  }

  /**
   * Finalize upload and create file record
   */
  private static async finalizeUpload(sessionId: string): Promise<{ fileId: string }> {
    const response = await fetch('/api/upload/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
      throw new Error(`Failed to finalize upload: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Resume an interrupted upload
   */
  static async resumeUpload(
    sessionId: string,
    file: File,
    options: ChunkUploadOptions = {}
  ): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
      // Get upload status from server
      const status = await this.getUploadStatus(sessionId);
      
      if (status.completed) {
        return { success: true, fileId: status.fileId };
      }

      // Resume from where we left off
      const { chunkSize = this.DEFAULT_CHUNK_SIZE } = options;
      const encryptedData = await EncryptionService.encryptFileToUint8Array(file);
      const chunks = this.createChunks(encryptedData, chunkSize);
      
      // Upload only missing chunks
      const missingChunks = chunks.filter(chunk => 
        !status.completedChunks.includes(chunk.index)
      );

      for (const chunk of missingChunks) {
        await this.uploadChunk(sessionId, chunk);
        options.onChunkComplete?.(chunk.index + 1, chunks.length);
      }

      const result = await this.finalizeUpload(sessionId);
      return { success: true, fileId: result.fileId };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Resume failed' 
      };
    }
  }

  /**
   * Get upload session status
   */
  private static async getUploadStatus(sessionId: string): Promise<{
    completed: boolean;
    completedChunks: number[];
    fileId?: string;
  }> {
    const response = await fetch(`/api/upload/status/${sessionId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get upload status: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Calculate simple hash for chunk integrity
   */
  private static calculateHash(data: Uint8Array): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Utility delay function
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if file should use chunked upload
   */
  static shouldUseChunkedUpload(file: File): boolean {
    const CHUNK_THRESHOLD = 5 * 1024 * 1024; // 5MB
    return file.size > CHUNK_THRESHOLD;
  }
}

