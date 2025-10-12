import { type User, type InsertUser, type EncryptedFile, type InsertFile, type ChatSession, type InsertChatSession, type AiAgent, type InsertAiAgent, type Payment, type InsertPayment, type UserSubscription, type InsertUserSubscription } from "../shared/schema";
import { randomUUID } from "crypto";

export class DrizzleStorage implements IStorage {
  private db: any;
  private schema: any;
  private ready: Promise<void>;
  
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required for DrizzleStorage');
    }
    console.log('[DrizzleStorage] Initializing with DATABASE_URL');
    this.ready = this.init();
  }
  
  private async init() {
    try {
      console.log('[DrizzleStorage] Importing drizzle dependencies...');
      const { drizzle } = await import('drizzle-orm/node-postgres');
      const pgModule = await import('pg');
      const schema = await import('../shared/schema');
      
      console.log('[DrizzleStorage] Creating database connection pool...');
      const pool = new pgModule.default.Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      
      // Test the connection
      console.log('[DrizzleStorage] Testing database connection...');
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('[DrizzleStorage] Database connection successful!');
      
      this.db = drizzle(pool, { schema });
      this.schema = schema;
      console.log('[DrizzleStorage] DrizzleStorage initialized successfully');
    } catch (error) {
      console.error('[DrizzleStorage] Failed to initialize:', error);
      throw new Error(`DrizzleStorage initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  private async ensureReady() { await this.ready; }
  async getUser(id: string): Promise<User | undefined> {
    await this.ensureReady();
    const user = await this.db.query.users.findFirst({ where: (u: any, { eq }: any) => eq(u.id, id) });
    return user || undefined;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureReady();
    const user = await this.db.query.users.findFirst({ where: (u: any, { eq }: any) => eq(u.email, email) });
    return user || undefined;
  }
  async createUser(user: InsertUser): Promise<User> {
    await this.ensureReady();
    const [created] = await this.db.insert(this.schema.users).values(user).returning();
    return created;
  }
  
  async getAllUsers(): Promise<User[]> {
    await this.ensureReady();
    const users = await this.db.query.users.findMany();
    return users;
  }

  async getAllPayments(): Promise<Payment[]> {
    await this.ensureReady();
    const { desc } = await import('drizzle-orm');
    const payments = await this.db.query.payments.findMany({
      orderBy: desc(this.schema.payments.createdAt)
    });
    return payments;
  }

  async getAllSubscriptions(): Promise<UserSubscription[]> {
    await this.ensureReady();
    const { desc } = await import('drizzle-orm');
    const subscriptions = await this.db.query.userSubscriptions.findMany({
      orderBy: desc(this.schema.userSubscriptions.createdAt)
    });
    return subscriptions;
  }
  async getFilesByUserId(userId: string): Promise<EncryptedFile[]> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    const files = await this.db.query.encryptedFiles.findMany({ 
      where: eq(this.schema.encryptedFiles.userId, userId) 
    });
    return files;
  }
  async getFile(id: string): Promise<EncryptedFile | undefined> { return undefined; }
  async createFile(file: any): Promise<EncryptedFile> {
    await this.ensureReady();
    // Accept extra fields from multer and map to schema
    const insertData = {
      userId: file.userId,
      fileName: file.fileName || file.filename || '',
      fileType: file.fileType || file.mimetype || '',
      encryptedData: file.encryptedData || '',
      uploadedAt: file.uploadedAt ? new Date(file.uploadedAt) : new Date(),
    };
    // Actually insert the file into the database
    const [created] = await this.db.insert(this.schema.encryptedFiles).values(insertData).returning();
    return created;
  }

  async deleteFile(id: string): Promise<void> {
    await this.ensureReady();
    console.log('[Storage Debug] Deleting file with ID:', id);
    const { eq } = await import('drizzle-orm');
    await this.db.delete(this.schema.encryptedFiles).where(eq(this.schema.encryptedFiles.id, id));
    console.log('[Storage Debug] File deletion query completed');
  }

  async getChatSessionsByUserId(userId: string): Promise<ChatSession[]> {
    await this.ensureReady();
    console.log('[Storage Debug] Getting chat sessions for user:', userId);
    try {
      const { eq, desc } = await import('drizzle-orm');
      const sessions = await this.db.query.chatSessions.findMany({
        where: eq(this.schema.chatSessions.userId, userId),
        orderBy: desc(this.schema.chatSessions.updatedAt)
      });
      console.log('[Storage Debug] Found sessions count:', sessions.length);
      return sessions;
    } catch (error) {
      console.error('[Storage Debug] Error finding chat sessions:', error);
      throw error;
    }
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    const session = await this.db.query.chatSessions.findFirst({
      where: eq(this.schema.chatSessions.id, id)
    });
    return session || undefined;
  }

  async createChatSession(session: InsertChatSession, agentId?: string): Promise<ChatSession> {
    await this.ensureReady();
    console.log('[Storage Debug] Creating chat session:', session, 'with agent:', agentId);
    try {
      const [created] = await this.db.insert(this.schema.chatSessions).values({
        ...session,
        agentId: agentId || null
      }).returning();
      console.log('[Storage Debug] Chat session created successfully:', created);
      return created;
    } catch (error) {
      console.error('[Storage Debug] Error creating chat session:', error);
      throw error;
    }
  }

  async updateChatSession(id: string, encryptedHistory: string, title?: string): Promise<ChatSession | undefined> {
    await this.ensureReady();
    console.log('[Storage Debug] Updating chat session:', id);
    console.log('[Storage Debug] Encrypted history length:', encryptedHistory.length);
    console.log('[Storage Debug] Title:', title);
    
    const session = await this.getChatSession(id);
    if (!session) {
      console.log('[Storage Debug] Session not found:', id);
      return undefined;
    }

    const updateData: any = { encryptedHistory, updatedAt: new Date() };
    if (typeof title === 'string' && title.length > 0) updateData.title = title;

    console.log('[Storage Debug] Update data:', { ...updateData, encryptedHistory: `[${encryptedHistory.length} chars]` });

    try {
      const { eq } = await import('drizzle-orm');
      const [updated] = await this.db.update(this.schema.chatSessions)
        .set(updateData)
        .where(eq(this.schema.chatSessions.id, id))
        .returning();

      console.log('[Storage Debug] Update successful:', updated ? 'YES' : 'NO');
      return updated;
    } catch (error) {
      console.error('[Storage Debug] Update failed:', error);
      throw error;
    }
  }

  async deleteChatSession(id: string): Promise<void> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    await this.db.delete(this.schema.chatSessions).where(eq(this.schema.chatSessions.id, id));
  }

  // AI Agent methods
  async getAiAgentsByUserId(userId: string): Promise<AiAgent[]> {
    await this.ensureReady();
    console.log('[Storage Debug] Getting AI agents for user:', userId);
    try {
      const { eq, desc } = await import('drizzle-orm');
      const agents = await this.db.query.aiAgents.findMany({
        where: eq(this.schema.aiAgents.userId, userId),
        orderBy: desc(this.schema.aiAgents.updatedAt)
      });
      console.log('[Storage Debug] Found agents count:', agents.length);
      return agents;
    } catch (error) {
      console.error('[Storage Debug] Error finding AI agents:', error);
      throw error;
    }
  }

  async getAiAgent(id: string): Promise<AiAgent | undefined> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    const agent = await this.db.query.aiAgents.findFirst({
      where: eq(this.schema.aiAgents.id, id)
    });
    return agent || undefined;
  }

  async createAiAgent(agent: InsertAiAgent): Promise<AiAgent> {
    await this.ensureReady();
    console.log('[Storage Debug] Creating AI agent:', agent);
    try {
      const [created] = await this.db.insert(this.schema.aiAgents).values(agent).returning();
      console.log('[Storage Debug] AI agent created successfully:', created);
      return created;
    } catch (error) {
      console.error('[Storage Debug] Error creating AI agent:', error);
      throw error;
    }
  }

  async updateAiAgent(id: string, data: Partial<Omit<InsertAiAgent, 'userId'>>): Promise<AiAgent | undefined> {
    await this.ensureReady();
    const agent = await this.getAiAgent(id);
    if (!agent) return undefined;

    const [updated] = await this.db.update(this.schema.aiAgents)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where((a: any, { eq }: any) => eq(a.id, id))
      .returning();

    return updated;
  }

  async deleteAiAgent(id: string): Promise<void> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    await this.db.delete(this.schema.aiAgents).where(eq(this.schema.aiAgents.id, id));
  }
  
  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    await this.ensureReady();
    const [created] = await this.db.insert(this.schema.payments).values(payment).returning();
    return created;
  }
  
  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    const payments = await this.db.query.payments.findMany({ 
      where: eq(this.schema.payments.userId, userId) 
    });
    return payments;
  }
  
  async getPaymentByOrderId(orderId: string): Promise<Payment | undefined> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    const payment = await this.db.query.payments.findFirst({ 
      where: eq(this.schema.payments.razorpayOrderId, orderId) 
    });
    return payment || undefined;
  }
  
  async updatePaymentStatus(id: string, paymentId: string, signature: string, status: string, planId?: string): Promise<Payment | undefined> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    const updateData: any = {
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      status: status,
      updatedAt: new Date()
    };
    
    // Only add planId if provided
    if (planId) {
      updateData.planId = planId;
    }
    
    const [updated] = await this.db
      .update(this.schema.payments)
      .set(updateData)
      .where(eq(this.schema.payments.id, id))
      .returning();
    return updated;
  }

  // Subscription methods
  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    await this.ensureReady();
    const { eq, and } = await import('drizzle-orm');
    const subscription = await this.db.query.userSubscriptions.findFirst({
      where: and(
        eq(this.schema.userSubscriptions.userId, userId),
        eq(this.schema.userSubscriptions.status, 'active')
      )
    });
    return subscription;
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    await this.ensureReady();
    const [created] = await this.db.insert(this.schema.userSubscriptions).values(subscription).returning();
    return created;
  }

  async updateUserSubscription(userId: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    const [updated] = await this.db
      .update(this.schema.userSubscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(this.schema.userSubscriptions.userId, userId))
      .returning();
    return updated;
  }

  async updateUserPlan(userId: string, planId: string, planName: string, billingPeriod: string, paymentId?: string): Promise<User | undefined> {
    await this.ensureReady();
    const { eq } = await import('drizzle-orm');
    
    try {
      console.log("DrizzleStorage: Updating user plan for user:", userId, "with plan:", planId);
      
      const now = new Date();
      const endDate = new Date(now);
      if (billingPeriod === 'year') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      console.log("DrizzleStorage: Update data:", {
        currentPlan: planId,
        planStatus: 'active',
        subscriptionStartDate: now,
        subscriptionEndDate: endDate,
        billingPeriod: billingPeriod,
        lastPaymentId: paymentId || null
      });

      const [updated] = await this.db
        .update(this.schema.users)
        .set({
          currentPlan: planId,
          planStatus: 'active',
          subscriptionStartDate: now,
          subscriptionEndDate: endDate,
          billingPeriod: billingPeriod,
          lastPaymentId: paymentId || null
        })
        .where(eq(this.schema.users.id, userId))
        .returning();
        
      console.log("DrizzleStorage: User plan update successful:", !!updated);
      return updated;
    } catch (error) {
      console.error("DrizzleStorage: Error updating user plan:", error);
      throw error;
    }
  }
}


// All imports must be at the top
// Drizzle/Postgres dependencies are only required if DATABASE_URL is set, but type-only imports can be at the top
// (Dynamic require is still used in DrizzleStorage for runtime)

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers?(): Promise<User[]>;

  // File methods
  getFilesByUserId(userId: string): Promise<EncryptedFile[]>;
  getFile(id: string): Promise<EncryptedFile | undefined>;
  createFile(file: InsertFile): Promise<EncryptedFile>;
  deleteFile(id: string): Promise<void>;

  // Chat session methods
  getChatSessionsByUserId(userId: string): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession, agentId?: string): Promise<ChatSession>;
  updateChatSession(id: string, encryptedHistory: string, title?: string): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<void>;

  // AI Agent methods
  getAiAgentsByUserId(userId: string): Promise<AiAgent[]>;
  getAiAgent(id: string): Promise<AiAgent | undefined>;
  createAiAgent(agent: InsertAiAgent): Promise<AiAgent>;
  updateAiAgent(id: string, data: Partial<Omit<InsertAiAgent, 'userId'>>): Promise<AiAgent | undefined>;
  deleteAiAgent(id: string): Promise<void>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
  getPaymentByOrderId(orderId: string): Promise<Payment | undefined>;
  updatePaymentStatus(id: string, paymentId: string, signature: string, status: string, planId?: string): Promise<Payment | undefined>;
  getAllPayments?(): Promise<Payment[]>;
  
  // Subscription methods
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(userId: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined>;
  updateUserPlan(userId: string, planId: string, planName: string, billingPeriod: string, paymentId?: string): Promise<User | undefined>;
  getAllSubscriptions?(): Promise<UserSubscription[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private files: Map<string, EncryptedFile>;
  private chatSessions: Map<string, ChatSession>;
  private aiAgents: Map<string, AiAgent>;
  private payments: Map<string, Payment>;
  private userSubscriptions: Map<string, UserSubscription>;

  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.chatSessions = new Map();
    this.aiAgents = new Map();
    this.payments = new Map();
    this.userSubscriptions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      currentPlan: insertUser.currentPlan || null, // No free plan - must subscribe
      planStatus: insertUser.planStatus || 'inactive', // Inactive until they subscribe
      subscriptionStartDate: insertUser.subscriptionStartDate || null,
      subscriptionEndDate: insertUser.subscriptionEndDate || null,
      billingPeriod: insertUser.billingPeriod || 'month',
      lastPaymentId: insertUser.lastPaymentId || null
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getAllSubscriptions(): Promise<UserSubscription[]> {
    return Array.from(this.userSubscriptions.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getFilesByUserId(userId: string): Promise<EncryptedFile[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.userId === userId,
    );
  }

  async getFile(id: string): Promise<EncryptedFile | undefined> {
    return this.files.get(id);
  }

  async createFile(insertFile: InsertFile): Promise<EncryptedFile> {
    const id = randomUUID();
    const file: EncryptedFile = {
      ...insertFile,
      id,
      uploadedAt: new Date()
    };
    this.files.set(id, file);
    return file;
  }

  async deleteFile(id: string): Promise<void> {
    this.files.delete(id);
  }

  async getChatSessionsByUserId(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(
      (session) => session.userId === userId,
    );
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession, agentId?: string): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now,
      agentId: agentId || null
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, encryptedHistory: string, title?: string): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;

    const updatedSession: ChatSession = {
      ...session,
      encryptedHistory,
      title: typeof title === 'string' && title.length > 0 ? title : session.title,
      updatedAt: new Date()
    };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteChatSession(id: string): Promise<void> {
    this.chatSessions.delete(id);
  }

  // AI Agent methods
  async getAiAgentsByUserId(userId: string): Promise<AiAgent[]> {
    return Array.from(this.aiAgents.values()).filter(
      (agent) => agent.userId === userId,
    );
  }

  async getAiAgent(id: string): Promise<AiAgent | undefined> {
    return this.aiAgents.get(id);
  }

  async createAiAgent(insertAgent: InsertAiAgent): Promise<AiAgent> {
    const id = randomUUID();
    const now = new Date();
    const agent: AiAgent = {
      ...insertAgent,
      id,
      createdAt: now,
      updatedAt: now,
      icon: insertAgent.icon || "robot"
    };
    this.aiAgents.set(id, agent);
    return agent;
  }

  async updateAiAgent(id: string, data: Partial<Omit<InsertAiAgent, 'userId'>>): Promise<AiAgent | undefined> {
    const agent = this.aiAgents.get(id);
    if (!agent) return undefined;

    const updatedAgent: AiAgent = {
      ...agent,
      ...data,
      updatedAt: new Date()
    };
    this.aiAgents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAiAgent(id: string): Promise<void> {
    this.aiAgents.delete(id);
  }
  
  // Payment methods implementation for MemStorage
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const now = new Date();
    const newPayment: Payment = {
      ...payment,
      id,
      createdAt: now,
      updatedAt: now,
      razorpayPaymentId: null,
      razorpaySignature: null,
      status: 'created',
      currency: payment.currency || "INR",
      originalAmount: payment.originalAmount || null,
      originalCurrency: payment.originalCurrency || null,
      planId: payment.planId || null,
      planName: payment.planName || null,
      billingPeriod: payment.billingPeriod || null
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }
  
  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.userId === userId,
    );
  }
  
  async getPaymentByOrderId(orderId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(
      (payment) => payment.razorpayOrderId === orderId,
    );
  }
  
  async updatePaymentStatus(id: string, paymentId: string, signature: string, status: string, planId?: string): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const updatedPayment: Payment = {
      ...payment,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      status,
      // Only update planId if provided and payment doesn't already have one
      planId: planId || payment.planId,
      updatedAt: new Date()
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  // Subscription methods
  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    return Array.from(this.userSubscriptions.values()).find(
      (sub) => sub.userId === userId && sub.status === 'active'
    );
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const id = randomUUID();
    const now = new Date();
    const newSubscription: UserSubscription = {
      id,
      userId: subscription.userId,
      planId: subscription.planId,
      planName: subscription.planName,
      billingPeriod: subscription.billingPeriod || 'month',
      startDate: subscription.startDate || now,
      endDate: subscription.endDate || null,
      status: subscription.status || 'active',
      autoRenew: subscription.autoRenew || null,
      paymentId: subscription.paymentId || null,
      createdAt: now,
      updatedAt: now
    };
    this.userSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async updateUserSubscription(userId: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return undefined;

    const updatedSubscription: UserSubscription = {
      ...subscription,
      ...data,
      updatedAt: new Date()
    };
    this.userSubscriptions.set(subscription.id, updatedSubscription);
    return updatedSubscription;
  }

  async updateUserPlan(userId: string, planId: string, planName: string, billingPeriod: string, paymentId?: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const now = new Date();
    const endDate = new Date(now);
    if (billingPeriod === 'year') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const updatedUser: User = {
      ...user,
      currentPlan: planId,
      planStatus: 'active',
      subscriptionStartDate: now,
      subscriptionEndDate: endDate,
      billingPeriod: billingPeriod,
      lastPaymentId: paymentId || null
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

// Initialize storage with proper error handling and logging
function createStorage(): IStorage {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    console.log('[Storage] DATABASE_URL found, initializing DrizzleStorage for cloud database');
    console.log('[Storage] Database URL:', databaseUrl.substring(0, 20) + '...' + databaseUrl.substring(databaseUrl.length - 10));
    try {
      return new DrizzleStorage();
    } catch (error) {
      console.error('[Storage] Failed to initialize DrizzleStorage:', error);
      console.error('[Storage] Falling back to MemStorage (this means your data will be lost on restart!)');
      return new MemStorage();
    }
  } else {
    console.log('[Storage] No DATABASE_URL found, using MemStorage (local memory)');
    return new MemStorage();
  }
}

export const storage = createStorage();
