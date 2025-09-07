import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const excos = pgTable("excos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const developers = pgTable("developers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  skills: text("skills").array(),
  status: text("status").notNull().default("active"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  fileUrl: text("file_url"),
  fileType: text("file_type").notNull(),
  fileSize: text("file_size"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const uiSettings = pgTable("ui_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  primaryColor: text("primary_color").notNull().default("#006600"),
  secondaryColor: text("secondary_color").notNull().default("#C3B091"),
  accentColor: text("accent_color").notNull().default("#FFD700"),
  logoUrl: text("logo_url"),
  siteTitle: text("site_title").notNull().default("NYSC Jos North - Official Biodata Portal"),
  siteDescription: text("site_description").notNull().default("Official portal for NYSC Jos North operations and management"),
  contactEmail: text("contact_email").notNull().default("contact@nyscjosnorth.gov.ng"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertExcoSchema = createInsertSchema(excos).omit({
  id: true,
  createdAt: true,
});

export const insertDeveloperSchema = createInsertSchema(developers).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertUiSettingsSchema = createInsertSchema(uiSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertExco = z.infer<typeof insertExcoSchema>;
export type Exco = typeof excos.$inferSelect;
export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type Developer = typeof developers.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertUiSettings = z.infer<typeof insertUiSettingsSchema>;
export type UiSettings = typeof uiSettings.$inferSelect;
