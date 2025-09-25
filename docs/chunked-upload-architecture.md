# Chunked Upload Architecture

## Overview

The chunked upload system optimizes large file uploads by eliminating Base64 encoding overhead and enabling resumable uploads. This reduces upload size by 33% and provides better user experience for large files.

## Performance Comparison

### Current System (Base64 JSON)
```
10MB file → 13.3MB Base64 → Single JSON request
- 33% size increase
- No resumability
- Memory intensive
- Timeout prone
```

### Optimized System (Binary Chunks)
```
10MB file → 10MB binary → 10 x 1MB chunks
- No size increase
- Resumable uploads
- Memory efficient
- Fault tolerant
```

## Architecture Flow

### 1. Client-Side Process

```typescript
// File size check
if (ChunkedUploadService.shouldUseChunkedUpload(file)) {
  // Use chunked upload for files > 5MB
  await ChunkedUploadService.uploadFile(file, userId, options);
} else {
  // Use traditional upload for smaller files
  await traditionalUpload(file);
}
```

### 2. Upload Session Initialization

```http
POST /api/upload/init
{
  "userId": "user123",
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "totalChunks": 10,
  "totalSize": 10485760
}

Response: { "sessionId": "uuid-session-id" }
```

### 3. Chunk Upload Process

```typescript
// Client encrypts file and splits into chunks
const encryptedData = await EncryptionService.encryptFileToUint8Array(file);
const chunks = createChunks(encryptedData, 1024 * 1024); // 1MB chunks

// Upload each chunk as binary FormData
for (const chunk of chunks) {
  const formData = new FormData();
  formData.append('sessionId', sessionId);
  formData.append('chunkIndex', chunk.index.toString());
  formData.append('chunkHash', chunk.hash);
  formData.append('chunkData', new Blob([chunk.data]));
  
  await fetch('/api/upload/chunk', {
    method: 'POST',
    body: formData // Binary upload - no Base64!
  });
}
```

### 4. Server-Side Chunk Handling

```typescript
// Multer handles binary chunk upload
app.post("/api/upload/chunk", upload.single('chunkData'), async (req, res) => {
  const { sessionId, chunkIndex, chunkHash } = req.body;
  const chunkFile = req.file; // Binary buffer
  
  // Verify integrity
  const calculatedHash = calculateChunkHash(chunkFile.buffer);
  if (calculatedHash !== chunkHash) {
    return res.status(400).json({ error: "Chunk integrity check failed" });
  }
  
  // Store chunk in session
  session.chunks.set(parseInt(chunkIndex), chunkFile.buffer);
  session.completedChunks.add(parseInt(chunkIndex));
});
```

### 5. File Reassembly and Finalization

```typescript
// Reassemble chunks in correct order
const reassembledData = Buffer.concat(
  Array.from({ length: session.totalChunks }, (_, i) => session.chunks.get(i))
);

// Convert to base64 for database storage (maintaining compatibility)
const base64Data = reassembledData.toString('base64');

// Create file record
const fileRecord = await storage.createFile({
  userId: session.userId,
  fileName: session.fileName,
  fileType: session.fileType,
  encryptedData: base64Data
});
```

## Key Benefits

### 1. Performance Improvements
- **33% smaller uploads** (no Base64 encoding during transfer)
- **Parallel chunk processing** potential
- **Reduced memory usage** (process chunks individually)
- **Faster upload times** for large files

### 2. Reliability Features
- **Resumable uploads** - continue from where you left off
- **Chunk integrity verification** - detect corruption
- **Automatic retry logic** with exponential backoff
- **Session timeout handling** - clean up abandoned uploads

### 3. User Experience
- **Real-time progress tracking** - per-chunk progress updates
- **Better error messages** - specific chunk failure information
- **Cancellation support** - abort uploads cleanly
- **Network resilience** - handle temporary disconnections

## Implementation Details

### Chunk Size Strategy
```typescript
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const CHUNK_THRESHOLD = 5 * 1024 * 1024; // Use chunking for files > 5MB
```

### Session Management
```typescript
interface UploadSession {
  sessionId: string;
  userId: string;
  fileName: string;
  fileType: string;
  totalChunks: number;
  totalSize: number;
  completedChunks: Set<number>;
  chunks: Map<number, Buffer>;
  createdAt: Date;
}
```

### Error Handling
```typescript
// Retry logic with exponential backoff
let retries = 0;
while (!success && retries < maxRetries) {
  try {
    await uploadChunk(chunk);
    success = true;
  } catch (error) {
    retries++;
    await delay(Math.pow(2, retries) * 1000); // 2s, 4s, 8s delays
  }
}
```

## Security Considerations

### 1. Maintained Encryption
- Files are still encrypted client-side before chunking
- Chunks contain encrypted data only
- Server never sees plaintext content

### 2. Integrity Verification
- Each chunk has a hash for integrity checking
- Total file size verification after reassembly
- Chunk order validation during reassembly

### 3. Session Security
- Session IDs are UUIDs (cryptographically random)
- Sessions expire after 1 hour
- User ID validation for each chunk upload

## Monitoring and Observability

### Client-Side Metrics
```typescript
// Progress tracking
onProgress: (progress: number) => void;
onChunkComplete: (completed: number, total: number) => void;

// Error tracking
uploadErrors: ChunkError[];
retryAttempts: number;
totalUploadTime: number;
```

### Server-Side Logging
```typescript
console.log(`[Chunked Upload] Initialized session ${sessionId} for ${fileName}`);
console.log(`[Chunked Upload] Received chunk ${index}/${totalChunks}`);
console.log(`[Chunked Upload] Finalized upload for session ${sessionId}`);
```

## Future Enhancements

### 1. Advanced Features
- **Parallel chunk uploads** - upload multiple chunks simultaneously
- **Delta sync** - only upload changed chunks for file updates
- **Compression** - compress chunks before upload
- **Deduplication** - detect and skip duplicate chunks

### 2. Infrastructure Improvements
- **Redis session storage** - for multi-server deployments
- **S3 direct upload** - bypass server for chunk storage
- **CDN integration** - edge locations for faster uploads
- **WebSocket progress** - real-time progress updates

### 3. Mobile Optimizations
- **Background uploads** - continue uploads when app is backgrounded
- **Network awareness** - adjust chunk size based on connection quality
- **Offline queuing** - queue uploads when offline

## Migration Strategy

### Phase 1: Dual Support
- Keep existing Base64 upload for small files (< 5MB)
- Use chunked upload for large files (> 5MB)
- Maintain backward compatibility

### Phase 2: Gradual Migration
- Lower threshold to 1MB for chunked uploads
- Monitor performance improvements
- Gather user feedback

### Phase 3: Full Migration
- Use chunked upload for all files
- Remove Base64 upload code
- Optimize chunk size based on analytics

This architecture provides a robust, scalable solution for large file uploads while maintaining VaultX's security guarantees and improving user experience significantly.