import type { Express } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import { storage } from "./storage";

// In-memory session storage (use Redis in production)
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

const uploadSessions = new Map<string, UploadSession>();

// Configure multer for chunk uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB per chunk (safety buffer)
  },
});

/**
 * Register chunked upload routes
 */
export function registerChunkedUploadRoutes(app: Express) {
  
  // Initialize upload session
  app.post("/api/upload/init", async (req, res) => {
    try {
      const { userId, fileName, fileType, totalChunks, totalSize } = req.body;
      
      if (!userId || !fileName || !fileType || !totalChunks || !totalSize) {
        return res.status(400).json({ 
          error: "Missing required fields: userId, fileName, fileType, totalChunks, totalSize" 
        });
      }

      const sessionId = randomUUID();
      const session: UploadSession = {
        sessionId,
        userId,
        fileName,
        fileType,
        totalChunks,
        totalSize,
        completedChunks: new Set(),
        chunks: new Map(),
        createdAt: new Date()
      };

      uploadSessions.set(sessionId, session);
      
      // Clean up old sessions (older than 1 hour)
      cleanupOldSessions();

      console.log(`[Chunked Upload] Initialized session ${sessionId} for ${fileName} (${totalChunks} chunks, ${totalSize} bytes)`);
      
      res.json({ sessionId });
    } catch (error) {
      console.error("Failed to initialize upload session:", error);
      res.status(500).json({ error: "Failed to initialize upload session" });
    }
  });

  // Upload chunk
  app.post("/api/upload/chunk", upload.single('chunkData'), async (req, res) => {
    try {
      const { sessionId, chunkIndex, chunkHash } = req.body;
      const chunkFile = req.file;

      if (!sessionId || chunkIndex === undefined || !chunkHash || !chunkFile) {
        return res.status(400).json({ 
          error: "Missing required fields: sessionId, chunkIndex, chunkHash, chunkData" 
        });
      }

      const session = uploadSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Upload session not found" });
      }

      const index = parseInt(chunkIndex);
      
      // Verify chunk hasn't been uploaded already
      if (session.completedChunks.has(index)) {
        return res.json({ message: "Chunk already uploaded", chunkIndex: index });
      }

      // Verify chunk hash for integrity
      const calculatedHash = calculateChunkHash(chunkFile.buffer);
      if (calculatedHash !== chunkHash) {
        return res.status(400).json({ error: "Chunk integrity check failed" });
      }

      // Store chunk
      session.chunks.set(index, chunkFile.buffer);
      session.completedChunks.add(index);

      console.log(`[Chunked Upload] Received chunk ${index}/${session.totalChunks - 1} for session ${sessionId}`);

      res.json({ 
        message: "Chunk uploaded successfully", 
        chunkIndex: index,
        completedChunks: session.completedChunks.size,
        totalChunks: session.totalChunks
      });

    } catch (error) {
      console.error("Failed to upload chunk:", error);
      res.status(500).json({ error: "Failed to upload chunk" });
    }
  });

  // Finalize upload
  app.post("/api/upload/finalize", async (req, res) => {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: "Missing sessionId" });
      }

      const session = uploadSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Upload session not found" });
      }

      // Verify all chunks are present
      if (session.completedChunks.size !== session.totalChunks) {
        return res.status(400).json({ 
          error: `Missing chunks. Expected ${session.totalChunks}, got ${session.completedChunks.size}` 
        });
      }

      // Reassemble file from chunks
      const reassembledData = reassembleChunks(session);
      
      // Verify total size
      if (reassembledData.length !== session.totalSize) {
        return res.status(400).json({ 
          error: `File size mismatch. Expected ${session.totalSize}, got ${reassembledData.length}` 
        });
      }

      // Convert to base64 for storage (maintaining compatibility with existing storage)
      const base64Data = reassembledData.toString('base64');

      // Create file record in database
      const fileRecord = await storage.createFile({
        userId: session.userId,
        fileName: session.fileName,
        fileType: session.fileType,
        encryptedData: base64Data
      });

      // Clean up session
      uploadSessions.delete(sessionId);

      console.log(`[Chunked Upload] Finalized upload for session ${sessionId}, created file ${fileRecord.id}`);

      res.json({ 
        fileId: fileRecord.id,
        message: "File uploaded successfully",
        fileName: session.fileName,
        fileSize: session.totalSize
      });

    } catch (error) {
      console.error("Failed to finalize upload:", error);
      res.status(500).json({ error: "Failed to finalize upload" });
    }
  });

  // Get upload status
  app.get("/api/upload/status/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = uploadSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Upload session not found" });
      }

      const completed = session.completedChunks.size === session.totalChunks;
      
      res.json({
        sessionId,
        completed,
        completedChunks: Array.from(session.completedChunks).sort((a, b) => a - b),
        totalChunks: session.totalChunks,
        fileName: session.fileName,
        fileSize: session.totalSize,
        progress: (session.completedChunks.size / session.totalChunks) * 100
      });

    } catch (error) {
      console.error("Failed to get upload status:", error);
      res.status(500).json({ error: "Failed to get upload status" });
    }
  });

  // Cancel upload session
  app.delete("/api/upload/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = uploadSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Upload session not found" });
      }

      uploadSessions.delete(sessionId);
      
      console.log(`[Chunked Upload] Cancelled session ${sessionId}`);
      
      res.json({ message: "Upload session cancelled" });

    } catch (error) {
      console.error("Failed to cancel upload session:", error);
      res.status(500).json({ error: "Failed to cancel upload session" });
    }
  });
}

/**
 * Reassemble chunks into complete file buffer
 */
function reassembleChunks(session: UploadSession): Buffer {
  const chunks: Buffer[] = [];
  
  // Sort chunks by index and concatenate
  for (let i = 0; i < session.totalChunks; i++) {
    const chunk = session.chunks.get(i);
    if (!chunk) {
      throw new Error(`Missing chunk ${i}`);
    }
    chunks.push(chunk);
  }
  
  return Buffer.concat(chunks);
}

/**
 * Calculate simple hash for chunk integrity verification
 */
function calculateChunkHash(buffer: Buffer): string {
  let hash = 0;
  for (let i = 0; i < buffer.length; i++) {
    const char = buffer[i];
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

/**
 * Clean up old upload sessions (older than 1 hour)
 */
function cleanupOldSessions() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  // Convert to array to avoid iteration issues
  const sessions = Array.from(uploadSessions.entries());
  for (const [sessionId, session] of sessions) {
    if (session.createdAt < oneHourAgo) {
      uploadSessions.delete(sessionId);
      console.log(`[Chunked Upload] Cleaned up expired session ${sessionId}`);
    }
  }
}

// Clean up sessions every 30 minutes
setInterval(cleanupOldSessions, 30 * 60 * 1000);