import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Subscription fields - NO FREE PLAN, users must subscribe to access features
  currentPlan: varchar("current_plan"), // null until they subscribe
  planStatus: varchar("plan_status").default("inactive"), // inactive, active, cancelled, expired
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  billingPeriod: varchar("billing_period").default("month"),
  lastPaymentId: varchar("last_payment_id"),
});

export const encryptedFiles = pgTable("encrypted_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  encryptedData: text("encrypted_data").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const aiAgents = pgTable("ai_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  encryptedSystemPrompt: text("encrypted_system_prompt").notNull(),
  encryptedDescription: text("encrypted_description").notNull(),
  icon: text("icon").default("robot"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  encryptedHistory: text("encrypted_history").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  agentId: varchar("agent_id").references(() => aiAgents.id, { onDelete: 'set null' }),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFileSchema = createInsertSchema(encryptedFiles).omit({
  id: true,
  uploadedAt: true,
});

export const insertAiAgentSchema = createInsertSchema(aiAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  agentId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type EncryptedFile = typeof encryptedFiles.$inferSelect;
export type InsertAiAgent = z.infer<typeof insertAiAgentSchema>;
export type AiAgent = typeof aiAgents.$inferSelect;
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: numeric("amount").notNull(),
  currency: varchar("currency").notNull().default("INR"),
  originalAmount: numeric("original_amount"),  // Original amount before conversion
  originalCurrency: varchar("original_currency"),  // Original currency before conversion
  razorpayOrderId: varchar("razorpay_order_id").notNull(),
  razorpayPaymentId: varchar("razorpay_payment_id"),
  razorpaySignature: varchar("razorpay_signature"),
  status: varchar("status").notNull().default("created"),
  planId: varchar("plan_id"),
  planName: varchar("plan_name"),
  billingPeriod: varchar("billing_period").default("month"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  razorpayPaymentId: true,
  razorpaySignature: true,
  status: true,
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: varchar("plan_id").notNull(), // starter-plan, personal-plan, pro-plan, business-plan
  planName: varchar("plan_name").notNull(),
  status: varchar("status").notNull().default("active"), // active, cancelled, expired, paused
  billingPeriod: varchar("billing_period").notNull().default("month"),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  autoRenew: integer("auto_renew").default(1), // 1 = true, 0 = false
  paymentId: varchar("payment_id").references(() => payments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Plan configuration - NO FREE PLAN, PAID PLANS ONLY
// Pricing optimized for sustainable margins and competitive positioning
export const PLAN_CONFIGS = {
  'starter-plan': {
    name: 'Starter Plan',
    description: 'Perfect for individuals',
    features: ['50GB Storage', '200 AI chats/month', '3 Devices', '3 AI Agents', 'Max 100MB per file', '30 days history'],
    price: { monthly: 7, yearly: 70 },
    limits: { 
      storage: 50, // GB
      chats: 200, // per month
      devices: 3,
      aiAgents: 3,
      maxFileSize: 100, // MB
      chatHistoryDays: 30
    }
  },
  'personal-plan': {
    name: 'Personal Plan',
    description: 'For power users',
    features: ['200GB Storage', '800 chats/month', '5 Devices', '10 AI Agents', 'Max 500MB per file', '90 days history', 'Priority Support'],
    price: { monthly: 15, yearly: 150 },
    limits: { 
      storage: 200, // GB
      chats: 800, // per month
      devices: 5,
      aiAgents: 10,
      maxFileSize: 500, // MB
      chatHistoryDays: 90,
      prioritySupport: true
    }
  },
  'pro-plan': {
    name: 'Pro Plan',
    description: 'For professionals & creators',
    features: ['500GB Storage', '3,000 chats/month', 'Unlimited Devices', 'Unlimited AI Agents', 'Max 2GB per file', '1 year history', 'API Access', '24/7 Support'],
    price: { monthly: 39, yearly: 390 },
    limits: { 
      storage: 500, // GB
      chats: 3000, // per month
      devices: -1, // unlimited
      aiAgents: -1, // unlimited
      maxFileSize: 2048, // MB (2GB)
      chatHistoryDays: 365,
      prioritySupport: true,
      apiAccess: true,
      advancedAnalytics: true,
      versionHistory: 30 // days
    }
  },
  'business-plan': {
    name: 'Business Plan',
    description: 'For growing teams',
    features: ['2TB Shared Storage', '15,000 chats/month', 'Unlimited Devices', 'Unlimited AI Agents', 'Max 5GB per file', 'Up to 10 Users', 'Admin Dashboard', 'SSO & Audit Logs', 'Unlimited History'],
    price: { monthly: 199, yearly: 1990 },
    limits: { 
      storage: 2000, // GB (2TB)
      chats: 15000, // per month
      devices: -1, // unlimited
      aiAgents: -1, // unlimited
      maxFileSize: 5120, // MB (5GB)
      chatHistoryDays: -1, // unlimited
      teamMembers: 10,
      prioritySupport: true,
      apiAccess: true,
      advancedAnalytics: true,
      adminDashboard: true,
      sso: true,
      auditLogs: true,
      complianceReports: true,
      versionHistory: -1, // unlimited
      dedicatedSupport: true
    }
  }
} as const;

export type PlanId = keyof typeof PLAN_CONFIGS;
