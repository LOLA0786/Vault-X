import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
