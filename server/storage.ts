import { type User, type InsertUser, type EncryptedFile, type InsertFile, type ChatSession, type InsertChatSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // File methods
  getFilesByUserId(userId: string): Promise<EncryptedFile[]>;
  getFile(id: string): Promise<EncryptedFile | undefined>;
  createFile(file: InsertFile): Promise<EncryptedFile>;
  deleteFile(id: string): Promise<void>;
  
  // Chat session methods
  getChatSessionsByUserId(userId: string): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, encryptedHistory: string): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private files: Map<string, EncryptedFile>;
  private chatSessions: Map<string, ChatSession>;

  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.chatSessions = new Map();
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
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
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

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, encryptedHistory: string): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession: ChatSession = {
      ...session,
      encryptedHistory,
      updatedAt: new Date()
    };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteChatSession(id: string): Promise<void> {
    this.chatSessions.delete(id);
  }
}

export const storage = new MemStorage();
