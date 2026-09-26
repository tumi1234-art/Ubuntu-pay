import { pgTable, uuid, text, timestamp, numeric, integer, boolean } from "drizzle-orm/pg-core";

// --- USERS ---
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("member"), // member | admin (audit trail req.)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- SAVINGS GROUPS (Create/Join) ---
export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  targetAmount: numeric("target_amount").notNull(),
  timeframeDays: integer("timeframe_days").notNull(),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- MEMBERSHIP (who's in which group) ---
export const memberships = pgTable("memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id").notNull().references(() => groups.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

// --- CONTRIBUTIONS (sandbox — no real money) ---
export const contributions = pgTable("contributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id").notNull().references(() => groups.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  amount: numeric("amount").notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed | pending
  isDemoData: boolean("is_demo_data").notNull().default(true), // never pass off as real traction
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- UBUNTU UNLOCK (the one realistic rule that triggers) ---
export const unlocks = pgTable("unlocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id").notNull().references(() => groups.id),
  ruleDescription: text("rule_description").notNull(), // one-sentence rule, per playbook
  triggeredAt: timestamp("triggered_at"),
});

// --- MARKETPLACE OFFERS (if time) ---
export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  merchantName: text("merchant_name").notNull(),
  description: text("description").notNull(),
  goalCategory: text("goal_category"), // for offer relevance matching, if time
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- AUDIT TRAIL (Done Means: auth, roles & audit trail demonstrable) ---
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  meta: text("meta"), // JSON stringified detail
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
