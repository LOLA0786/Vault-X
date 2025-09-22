import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFileSchema, insertChatSessionSchema, insertAiAgentSchema, insertPaymentSchema } from "@shared/schema";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";


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

  // Admin route to get all users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const { adminEmail } = req.query;
      
      // Check if the requesting user is admin
      if (adminEmail !== "Lolasolution27@gmail.com" && adminEmail !== "lolasolution27@gmail.com") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      // Get all users (add this method to storage if it doesn't exist)
      const users = await storage.getAllUsers?.() || [];
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
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
      console.log('[Routes Debug] Deleting file with ID:', req.params.id);
      await storage.deleteFile(req.params.id);
      console.log('[Routes Debug] File deletion successful');
      res.json({ success: true });
    } catch (error) {
      console.error('[Routes Debug] File deletion error:', error);
      res.status(500).json({ error: "Internal server error", details: error });
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
      const { encryptedHistory, title } = req.body;
      if (!encryptedHistory) {
        return res.status(400).json({ error: "encryptedHistory is required" });
      }

      const session = await storage.updateChatSession(req.params.id, encryptedHistory, title);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error('[Server Debug] Error updating chat session:', error);
      res.status(500).json({ error: "Internal server error", details: (error instanceof Error) ? error.message : error });
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

  // Database health check endpoint (development only)
  // Payment routes
  // Initialize Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });

  // Create a new payment order
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { userId, amount, currency, planId, planName, billingPeriod } = req.body;
      
      if (!userId || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Convert amount to INR if needed (Razorpay primarily uses INR)
      let processedAmount = parseFloat(amount);
      let targetCurrency = currency || "INR";
      
      if (currency && currency !== "INR") {
        console.log(`Converting ${processedAmount} ${currency} to INR`);
        processedAmount = convertCurrency(processedAmount, currency, "INR");
        targetCurrency = "INR"; // Always use INR for Razorpay
        console.log(`Converted amount: ${processedAmount} INR`);
      }

      // Create Razorpay order
      const options = {
        amount: Math.round(processedAmount * 100), // Razorpay expects amount as integer in smallest currency unit (paise)
        currency: targetCurrency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          planId: planId || 'one-time-payment',
          planName: planName || 'Standard Payment',
          billingPeriod: billingPeriod || 'one-time',
          originalCurrency: currency || "INR",
          originalAmount: amount
        }
      };

      const order = await razorpay.orders.create(options);
      
      // Store payment information in database
      const paymentData = {
        userId,
        amount: processedAmount.toString(), // Convert to string for the database
        currency: targetCurrency,
        originalAmount: amount.toString(), // Convert original amount to string
        originalCurrency: currency,
        razorpayOrderId: order.id,
        planId,
        planName,
        billingPeriod
      };

      const payment = await storage.createPayment(paymentData);
      
      res.json({
        success: true,
        order,
        payment,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      console.error("Payment order creation failed:", error);
      res.status(500).json({ 
        success: false, 
        error: "Payment order creation failed", 
        details: error instanceof Error ? error.message : error 
      });
    }
  });

  // Verify and update payment status
  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan_id } = req.body;
      
      // Validate input parameters
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        console.error("Payment verification failed: Missing required parameters");
        return res.status(400).json({ 
          success: false, 
          error: "Missing required payment verification parameters" 
        });
      }
      
      // Fetch the payment from database using orderId
      const payment = await storage.getPaymentByOrderId(razorpay_order_id);
      if (!payment) {
        console.error(`Payment verification failed: Order ID ${razorpay_order_id} not found`);
        return res.status(404).json({ success: false, error: "Payment not found" });
      }

      console.log("Verifying payment signature for order:", razorpay_order_id);
      console.log("Razorpay secret key available:", !!process.env.RAZORPAY_KEY_SECRET);
      
      // Verify signature
      try {
        const generatedSignature = generateSignature(razorpay_order_id, razorpay_payment_id);
        const isValid = generatedSignature === razorpay_signature;

        if (!isValid) {
          console.error("Payment verification failed: Invalid signature");
          return res.status(400).json({ success: false, error: "Invalid signature" });
        }
      } catch (signatureError) {
        console.error("Error generating signature:", signatureError);
        return res.status(500).json({ 
          success: false, 
          error: "Signature verification error", 
          details: signatureError instanceof Error ? signatureError.message : String(signatureError)
        });
      }

      // Update payment status in database with plan information if passed
      const updateData: any = {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "completed"
      };
      
      // If plan_id is passed and payment doesn't already have one, update it
      if (plan_id && !payment.planId) {
        updateData.planId = plan_id;
      }

      const updatedPayment = await storage.updatePaymentStatus(
        payment.id,
        razorpay_payment_id,
        razorpay_signature,
        "completed",
        plan_id
      );
      
      console.log("Payment verification successful for order:", razorpay_order_id);
      res.json({ success: true, payment: updatedPayment });
    } catch (error) {
      console.error("Payment verification failed:", error);
      res.status(500).json({ 
        success: false, 
        error: "Payment verification failed", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Get user payments
  app.get("/api/payments/user/:userId", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByUserId(req.params.userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Helper function to generate signature
  function generateSignature(orderId: string, paymentId: string) {
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const payload = orderId + "|" + paymentId;
    return crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
  }
  
  // Helper function to convert USD to INR
  function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    // Current conversion rates (as of September 2025)
    const conversionRates = {
      USD_TO_INR: 83.5, // 1 USD = 83.5 INR (example rate)
      EUR_TO_INR: 90.2, // 1 EUR = 90.2 INR (example rate)
    };
    
    // Convert from USD to INR
    if (fromCurrency === "USD" && toCurrency === "INR") {
      return amount * conversionRates.USD_TO_INR;
    }
    // Convert from EUR to INR
    else if (fromCurrency === "EUR" && toCurrency === "INR") {
      return amount * conversionRates.EUR_TO_INR;
    }
    // If the currencies are the same or unsupported conversion, return original amount
    return amount;
  }

  // Development debugging endpoints
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/debug/storage-info', async (req, res) => {
      try {
        const storageType = storage.constructor.name;
        const hasDbUrl = !!process.env.DATABASE_URL;
        const dbUrlPreview = process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.substring(0, 20) + '...' + process.env.DATABASE_URL.substring(process.env.DATABASE_URL.length - 10) : 
          'Not configured';
        
        res.json({ 
          storageType,
          hasDbUrl,
          dbUrlPreview,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: 'Storage info error', details: error });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
