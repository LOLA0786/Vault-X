import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFileSchema, insertChatSessionSchema, insertAiAgentSchema } from "@shared/schema";
import { z } from "zod";


export async function registerRoutes(app: Express): Promise<Server> {

  // Secure file upload route: only accept encrypted file data as JSON
  app.post("/api/upload", async (req, res) => {
    try {
      const { encryptedData, fileName, fileType, userId } = req.body;
      if (!encryptedData || !fileName || !fileType || !userId) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }
      const insertFile = {
        userId,
        fileName,
        fileType,
        encryptedData,
        uploadedAt: new Date(),
      };
      const saved = await storage.createFile(insertFile);
      res.status(200).json({ success: true, message: "File uploaded and saved to storage", file: saved });
    } catch (error) {
      console.error("File upload failed:", error);
      res.status(200).json({ success: false, error: "File upload failed", details: error instanceof Error ? error.message : error });
    }
  });
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data", details: error });
    }
  });

  app.get("/api/users/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // File routes
  app.post("/api/files", async (req, res) => {
    try {
      const fileData = insertFileSchema.parse(req.body);
      const file = await storage.createFile(fileData);
      res.json(file);
    } catch (error) {
      res.status(400).json({ error: "Invalid file data", details: error });
    }
  });

  app.get("/api/files/user/:userId", async (req, res) => {
    try {
      const files = await storage.getFilesByUserId(req.params.userId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      await storage.deleteFile(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Chat session routes
  app.post("/api/chat-sessions", async (req, res) => {
    try {
      console.log('[Server Debug] POST /api/chat-sessions request body:', req.body);
      
      // Check for agent ID
      const agentId = req.body.agentId || null;
      delete req.body.agentId; // Remove it so Zod validation passes

      // Use safeParse so we can return structured validation errors
      const parsed = insertChatSessionSchema.safeParse(req.body);
      if (!parsed.success) {
        console.warn('[Server Debug] Chat session validation failed');
        console.warn('[Server Debug] Zod validation error:', parsed.error);
        // Log incoming body keys and a preview for debugging
        try {
          const bodyKeys = Object.keys(req.body || {});
          console.log('[Server Debug] Request body keys:', bodyKeys);
          bodyKeys.forEach((k) => console.log('[Server Debug] field:', k, 'type:', typeof (req.body as any)[k]));
          if (req.body && typeof (req.body as any).encryptedHistory !== 'undefined') {
            const preview = String((req.body as any).encryptedHistory).slice(0, 200);
            console.log('[Server Debug] encryptedHistory preview:', preview);
          }
        } catch (e) {
          console.warn('[Server Debug] Failed to inspect request body for debugging', e);
        }

        // Return formatted Zod error to the client for debugging
        return res.status(400).json({ error: 'Invalid session data', details: parsed.error.format() });
      }

      const sessionData = parsed.data;
      console.log('[Server Debug] Parsed session data (types):', {
        userId: typeof sessionData.userId,
        title: typeof sessionData.title,
        encryptedHistoryLength: sessionData.encryptedHistory ? sessionData.encryptedHistory.length : 0,
        agentId: agentId
      });

      const session = await storage.createChatSession(sessionData, agentId);
      console.log('[Server Debug] Created chat session:', session);

      res.json(session);
    } catch (error) {
      console.error('[Server Debug] Error creating chat session (unexpected):', error);
      res.status(500).json({ error: 'Internal server error', details: (error instanceof Error) ? error.message : error });
    }
  });

  app.get("/api/chat-sessions/user/:userId", async (req, res) => {
    try {
      console.log('[Server Debug] GET chat sessions for user:', req.params.userId);
      const sessions = await storage.getChatSessionsByUserId(req.params.userId);
      console.log('[Server Debug] Found sessions:', sessions.length);
      res.json(sessions);
    } catch (error) {
      console.error('[Server Debug] Error fetching chat sessions:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/chat-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/chat-sessions/:id", async (req, res) => {
    try {
      const { encryptedHistory } = req.body;
      if (!encryptedHistory) {
        return res.status(400).json({ error: "encryptedHistory is required" });
      }
      
      const session = await storage.updateChatSession(req.params.id, encryptedHistory);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/chat-sessions/:id", async (req, res) => {
    try {
      await storage.deleteChatSession(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Development-only debug endpoint: list recent chat sessions
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/debug/chat-sessions', async (req, res) => {
      try {
        const sessions = await storage.getChatSessionsByUserId(req.query.userId as string || '');
        res.json({ count: sessions.length, sessions: sessions.slice(0, 20) });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
      }
    });
  }
  
  // AI Agent routes
  app.post("/api/ai-agents", async (req, res) => {
    try {
      console.log('[Server Debug] POST /api/ai-agents request body:', req.body);

      // Use safeParse so we can return structured validation errors
      const parsed = insertAiAgentSchema.safeParse(req.body);
      if (!parsed.success) {
        console.warn('[Server Debug] AI agent validation failed');
        console.warn('[Server Debug] Zod validation error:', parsed.error);
        
        // Return formatted Zod error to the client for debugging
        return res.status(400).json({ error: 'Invalid agent data', details: parsed.error.format() });
      }

      const agentData = parsed.data;
      console.log('[Server Debug] Parsed agent data (types):', {
        userId: typeof agentData.userId,
        name: typeof agentData.name,
        systemPromptLength: agentData.encryptedSystemPrompt ? agentData.encryptedSystemPrompt.length : 0,
        descriptionLength: agentData.encryptedDescription ? agentData.encryptedDescription.length : 0,
      });

      const agent = await storage.createAiAgent(agentData);
      console.log('[Server Debug] Created AI agent:', agent);

      res.json(agent);
    } catch (error) {
      console.error('[Server Debug] Error creating AI agent (unexpected):', error);
      res.status(500).json({ error: 'Internal server error', details: (error instanceof Error) ? error.message : error });
    }
  });

  app.get("/api/ai-agents/user/:userId", async (req, res) => {
    try {
      console.log('[Server Debug] GET AI agents for user:', req.params.userId);
      const agents = await storage.getAiAgentsByUserId(req.params.userId);
      console.log('[Server Debug] Found agents:', agents.length);
      res.json(agents);
    } catch (error) {
      console.error('[Server Debug] Error fetching AI agents:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/ai-agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAiAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/ai-agents/:id", async (req, res) => {
    try {
      const { name, encryptedSystemPrompt, encryptedDescription, icon } = req.body;
      const updateData: Partial<Omit<typeof req.body, 'userId'>> = {};
      
      if (name) updateData.name = name;
      if (encryptedSystemPrompt) updateData.encryptedSystemPrompt = encryptedSystemPrompt;
      if (encryptedDescription) updateData.encryptedDescription = encryptedDescription;
      if (icon) updateData.icon = icon;
      
      const agent = await storage.updateAiAgent(req.params.id, updateData);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/ai-agents/:id", async (req, res) => {
    try {
      await storage.deleteAiAgent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
